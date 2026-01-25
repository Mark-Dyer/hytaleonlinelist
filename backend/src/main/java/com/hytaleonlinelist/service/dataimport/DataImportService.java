package com.hytaleonlinelist.service.dataimport;

import com.hytaleonlinelist.domain.entity.CategoryEntity;
import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.ServerTagEntity;
import com.hytaleonlinelist.domain.repository.CategoryRepository;
import com.hytaleonlinelist.domain.repository.ServerRepository;
import com.hytaleonlinelist.service.FileUploadService;
import com.hytaleonlinelist.service.dataimport.ExternalServerDto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.*;

/**
 * Service for importing server data from external sources.
 * This is a one-time import utility for seeding the database with servers
 * from hytale-servers.com.
 *
 * Note: This service commits each page independently to prevent long-running
 * transactions that could timeout during large imports.
 */
@Service
public class DataImportService {

    private static final Logger log = LoggerFactory.getLogger(DataImportService.class);

    private static final String EXTERNAL_API_URL = "https://api.hytale-servers.com/api/servers";
    private static final int MAX_PAGES = 50; // Safety limit

    private final ServerRepository serverRepository;
    private final CategoryRepository categoryRepository;
    private final RestClient restClient;
    private final FileUploadService fileUploadService; // May be null if R2 is disabled
    private final TransactionTemplate transactionTemplate;

    // Mapping from external tag slugs to our category slugs
    private static final Map<String, String> TAG_TO_CATEGORY_MAP = Map.ofEntries(
        Map.entry("survival", "survival"),
        Map.entry("pvp", "pvp"),
        Map.entry("creative", "creative"),
        Map.entry("rpg", "rpg"),
        Map.entry("minigames", "minigames"),
        Map.entry("adventure", "adventure"),
        Map.entry("modded", "modded"),
        Map.entry("factions", "pvp"),
        Map.entry("hardcore", "survival"),
        Map.entry("pve", "rpg"),
        Map.entry("economy", "survival"),
        Map.entry("roleplay", "rpg"),
        Map.entry("sandbox", "creative"),
        Map.entry("skyblock", "survival"),
        Map.entry("co-op", "minigames")
    );

    public DataImportService(
        ServerRepository serverRepository,
        CategoryRepository categoryRepository,
        TransactionTemplate transactionTemplate,
        @Autowired(required = false) FileUploadService fileUploadService
    ) {
        this.serverRepository = serverRepository;
        this.categoryRepository = categoryRepository;
        this.transactionTemplate = transactionTemplate;
        this.fileUploadService = fileUploadService;
        this.restClient = RestClient.builder()
            .baseUrl(EXTERNAL_API_URL)
            .build();

        if (fileUploadService != null) {
            log.info("DataImportService initialized with R2 image upload support");
        } else {
            log.info("DataImportService initialized WITHOUT R2 support - images will use external URLs");
        }
    }

    /**
     * Import result statistics.
     */
    public record ImportResult(
        int totalFetched,
        int imported,
        int skipped,
        int failed,
        List<String> errors
    ) {}

    /**
     * Result of processing a single page.
     */
    private record PageResult(
        int fetched,
        int imported,
        int skipped,
        int failed,
        int totalPages,
        List<String> errors
    ) {}

    /**
     * Imports all servers from hytale-servers.com.
     * Skips servers that already exist (by slug).
     * Each page is committed independently to prevent long-running transactions.
     */
    public ImportResult importAllServers() {
        log.info("Starting server import from hytale-servers.com");

        // Pre-load all categories (read-only, no transaction needed)
        Map<String, CategoryEntity> categoryMap = loadCategoryMap();
        if (categoryMap.isEmpty()) {
            log.error("No categories found in database. Please run migrations first.");
            return new ImportResult(0, 0, 0, 0, List.of("No categories found in database"));
        }

        // Pre-load existing slugs (will be updated as we import)
        Set<String> existingSlugs = new HashSet<>(serverRepository.findAllSlugs());
        log.info("Found {} existing server slugs", existingSlugs.size());

        int totalFetched = 0;
        int imported = 0;
        int skipped = 0;
        int failed = 0;
        List<String> errors = new ArrayList<>();

        int page = 1;
        int totalPages = 1; // Will be updated after first request

        while (page <= totalPages && page <= MAX_PAGES) {
            try {
                log.info("Fetching page {} of {}", page, totalPages);

                // Fetch data from external API (no transaction needed)
                ApiResponse response = restClient.get()
                    .uri("?page={page}", page)
                    .retrieve()
                    .body(ApiResponse.class);

                if (response == null || response.data() == null) {
                    log.warn("Empty response for page {}", page);
                    break;
                }

                // Update total pages from response
                if (response.meta() != null && response.meta().pagination() != null) {
                    totalPages = response.meta().pagination().pageCount();
                }

                // Process and save this page in its own transaction
                final int currentPage = page;
                final int knownTotalPages = totalPages;
                PageResult pageResult = processAndSavePage(
                    response.data(),
                    categoryMap,
                    existingSlugs,
                    currentPage
                );

                totalFetched += pageResult.fetched();
                imported += pageResult.imported();
                skipped += pageResult.skipped();
                failed += pageResult.failed();
                errors.addAll(pageResult.errors());

                log.info("Page {} committed: {} imported, {} skipped, {} failed",
                    page, pageResult.imported(), pageResult.skipped(), pageResult.failed());

                page++;

                // Small delay to be respectful to the external API
                Thread.sleep(100);

            } catch (Exception e) {
                String error = String.format("Error fetching page %d: %s", page, e.getMessage());
                errors.add(error);
                log.error(error, e);
                break; // Stop on fetch error
            }
        }

        log.info("Import complete: {} fetched, {} imported, {} skipped, {} failed",
            totalFetched, imported, skipped, failed);

        return new ImportResult(totalFetched, imported, skipped, failed, errors);
    }

    /**
     * Processes a single page of servers and saves them in a separate transaction.
     * This ensures each page is committed independently, preventing long-running transactions.
     */
    private PageResult processAndSavePage(
        List<ServerData> serverDataList,
        Map<String, CategoryEntity> categoryMap,
        Set<String> existingSlugs,
        int pageNumber
    ) {
        return transactionTemplate.execute(status -> {
            int fetched = serverDataList.size();
            int imported = 0;
            int skipped = 0;
            int failed = 0;
            List<String> errors = new ArrayList<>();
            List<ServerEntity> serversToSave = new ArrayList<>();

            for (ServerData serverData : serverDataList) {
                try {
                    // Skip if slug already exists
                    if (existingSlugs.contains(serverData.slug())) {
                        log.debug("Skipping existing server: {}", serverData.slug());
                        skipped++;
                        continue;
                    }

                    // Map to our entity
                    ServerEntity server = mapToServerEntity(serverData, categoryMap);
                    if (server != null) {
                        serversToSave.add(server);
                        existingSlugs.add(serverData.slug()); // Track for duplicates within import
                    } else {
                        failed++;
                        errors.add("Failed to map server: " + serverData.name());
                    }
                } catch (Exception e) {
                    failed++;
                    String error = String.format("Error processing server '%s': %s",
                        serverData.name(), e.getMessage());
                    errors.add(error);
                    log.warn(error, e);
                }
            }

            // Batch save for this page
            if (!serversToSave.isEmpty()) {
                serverRepository.saveAll(serversToSave);
                imported = serversToSave.size();
                log.info("Saved {} servers from page {}", imported, pageNumber);
            }

            return new PageResult(fetched, imported, skipped, failed, 0, errors);
        });
    }

    /**
     * Maps external server data to our ServerEntity.
     */
    private ServerEntity mapToServerEntity(ServerData data, Map<String, CategoryEntity> categoryMap) {
        // Determine category from tags
        CategoryEntity category = determineCategoryFromTags(data.tags(), categoryMap);
        if (category == null) {
            log.warn("Could not determine category for server: {}", data.name());
            // Default to Survival
            category = categoryMap.get("survival");
            if (category == null) {
                return null;
            }
        }

        ServerEntity server = new ServerEntity();
        server.setName(truncate(data.name(), 100));
        server.setSlug(sanitizeSlug(data.slug()));
        server.setIpAddress(data.ip());
        server.setPort(data.port() > 0 ? data.port() : 5520);

        // Description handling
        String description = data.description() != null ? data.description() : "";
        server.setDescription(description);
        server.setShortDescription(truncate(stripNewlines(description), 200));

        // Media URLs - upload to R2 if available, otherwise skip (no external URLs)
        if (data.banner() != null && data.banner().url() != null) {
            String bannerUrl = uploadToR2(data.banner().url(), "banners", data.slug());
            server.setBannerUrl(bannerUrl);
        }
        if (data.logo() != null && data.logo().url() != null) {
            String iconUrl = uploadToR2(data.logo().url(), "icons", data.slug());
            server.setIconUrl(iconUrl);
        }

        // Links
        server.setWebsiteUrl(emptyToNull(data.websiteUrl()));
        server.setDiscordUrl(emptyToNull(data.discordUrl()));

        // Category
        server.setCategory(category);

        // Version
        server.setVersion(data.version() != null ? data.version() : "1.0");

        // Status (all are currently "Unknown" from their API)
        server.setIsOnline(false);
        server.setPlayerCount(data.currentPlayers() != null ? data.currentPlayers() : 0);
        server.setMaxPlayers(data.maxPlayers() != null ? data.maxPlayers() : 100);
        server.setUptimePercentage(data.uptimePercentage() != null ? data.uptimePercentage() : 0.0);

        // Stats
        server.setVoteCount(data.votes());
        server.setReviewCount(data.totalReviews() != null ? data.totalReviews() : 0);
        if (data.averageRating() != null) {
            server.setAverageRating(BigDecimal.valueOf(data.averageRating()));
        }
        server.setViewCount(0L);

        // Flags
        server.setIsFeatured(false);
        server.setIsVerified(false);

        // No owner (unclaimed)
        server.setOwner(null);

        // Add tags
        if (data.tags() != null) {
            for (TagData tag : data.tags()) {
                ServerTagEntity tagEntity = new ServerTagEntity();
                tagEntity.setServer(server);
                tagEntity.setTag(tag.slug());
                server.getTags().add(tagEntity);
            }
        }

        return server;
    }

    /**
     * Determines the best category based on the server's tags.
     */
    private CategoryEntity determineCategoryFromTags(List<TagData> tags, Map<String, CategoryEntity> categoryMap) {
        if (tags == null || tags.isEmpty()) {
            return null;
        }

        // Try to find a matching category for the first tag that maps
        for (TagData tag : tags) {
            String ourCategorySlug = TAG_TO_CATEGORY_MAP.get(tag.slug().toLowerCase());
            if (ourCategorySlug != null) {
                CategoryEntity category = categoryMap.get(ourCategorySlug);
                if (category != null) {
                    return category;
                }
            }
        }

        return null;
    }

    /**
     * Loads all categories into a map keyed by slug.
     */
    private Map<String, CategoryEntity> loadCategoryMap() {
        Map<String, CategoryEntity> map = new HashMap<>();
        categoryRepository.findAll().forEach(cat -> map.put(cat.getSlug(), cat));
        return map;
    }

    /**
     * Truncates a string to the specified length.
     */
    private String truncate(String str, int maxLength) {
        if (str == null) return "";
        if (str.length() <= maxLength) return str;
        return str.substring(0, maxLength - 3) + "...";
    }

    /**
     * Strips newlines and excessive whitespace from a string.
     */
    private String stripNewlines(String str) {
        if (str == null) return "";
        return str.replaceAll("\\s+", " ").trim();
    }

    /**
     * Converts empty strings to null.
     */
    private String emptyToNull(String str) {
        if (str == null || str.isBlank()) return null;
        return str;
    }

    /**
     * Sanitizes a slug to ensure it's valid.
     */
    private String sanitizeSlug(String slug) {
        if (slug == null) return "unknown-" + System.currentTimeMillis();
        // Remove any characters that aren't alphanumeric, hyphens, or underscores
        return slug.toLowerCase()
            .replaceAll("[^a-z0-9\\-_]", "-")
            .replaceAll("-+", "-")
            .replaceAll("^-|-$", "");
    }

    /**
     * Uploads an image to R2 storage. Returns null if R2 is unavailable or upload fails.
     * No fallback to external URLs - we don't want any reference to external sources.
     */
    private String uploadToR2(String sourceUrl, String folder, String serverSlug) {
        if (sourceUrl == null || sourceUrl.isBlank()) {
            return null;
        }

        if (fileUploadService == null) {
            log.warn("R2 storage not available, skipping image upload for {}", serverSlug);
            return null;
        }

        String r2Url = fileUploadService.uploadImageFromUrl(sourceUrl, folder, serverSlug);
        if (r2Url == null) {
            log.warn("Failed to upload image to R2 for server {}", serverSlug);
        }
        return r2Url;
    }
}

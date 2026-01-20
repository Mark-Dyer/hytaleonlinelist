package com.hytaleonlinelist.service;

import com.hytaleonlinelist.domain.entity.CategoryEntity;
import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.ServerTagEntity;
import com.hytaleonlinelist.domain.entity.UserEntity;
import com.hytaleonlinelist.domain.repository.CategoryRepository;
import com.hytaleonlinelist.domain.repository.ServerRepository;
import com.hytaleonlinelist.dto.request.CreateServerRequest;
import com.hytaleonlinelist.dto.request.UpdateServerRequest;
import com.hytaleonlinelist.dto.response.PaginatedResponse;
import com.hytaleonlinelist.dto.response.PaginationMeta;
import com.hytaleonlinelist.dto.response.ServerResponse;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import com.hytaleonlinelist.mapper.ServerMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@Transactional(readOnly = true)
public class ServerService {

    private final ServerRepository serverRepository;
    private final CategoryRepository categoryRepository;
    private final ServerMapper serverMapper;

    public ServerService(ServerRepository serverRepository,
                        CategoryRepository categoryRepository,
                        ServerMapper serverMapper) {
        this.serverRepository = serverRepository;
        this.categoryRepository = categoryRepository;
        this.serverMapper = serverMapper;
    }

    public PaginatedResponse<ServerResponse> getServers(
            String sort,
            String category,
            String search,
            Boolean online,
            int page,
            int limit) {

        // Use unsorted pageable since native query handles sorting
        Pageable pageable = PageRequest.of(page - 1, limit);
        String sortBy = getSortField(sort);

        Page<ServerEntity> serverPage = serverRepository.findWithFilters(
                category != null && !category.isBlank() ? category : null,
                online,
                search != null && !search.isBlank() ? search : null,
                sortBy,
                pageable
        );

        List<ServerResponse> servers = serverPage.getContent().stream()
                .map(serverMapper::toResponse)
                .toList();

        PaginationMeta meta = new PaginationMeta(
                page,
                limit,
                serverPage.getTotalElements(),
                serverPage.getTotalPages()
        );

        return new PaginatedResponse<>(servers, meta);
    }

    public ServerResponse getServerBySlug(String slug) {
        ServerEntity server = serverRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found with slug: " + slug));

        return serverMapper.toResponse(server);
    }

    @Transactional
    public ServerResponse getServerBySlugAndIncrementViews(String slug) {
        ServerEntity server = serverRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found with slug: " + slug));

        // Increment view count
        server.setViewCount(server.getViewCount() + 1);
        serverRepository.save(server);

        return serverMapper.toResponse(server);
    }

    public List<ServerResponse> getFeaturedServers() {
        return serverRepository.findByIsFeaturedTrue().stream()
                .map(serverMapper::toResponse)
                .toList();
    }

    @Transactional
    public ServerResponse createServer(CreateServerRequest request, UserEntity owner) {
        CategoryEntity category = categoryRepository.findById(UUID.fromString(request.categoryId()))
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        ServerEntity server = new ServerEntity();
        server.setName(request.name());
        server.setSlug(generateSlug(request.name()));
        server.setIpAddress(request.ipAddress());
        server.setPort(request.port());
        server.setShortDescription(request.shortDescription());
        server.setDescription(request.description());
        server.setBannerUrl(request.bannerUrl());
        server.setIconUrl(request.iconUrl());
        server.setWebsiteUrl(request.websiteUrl());
        server.setDiscordUrl(request.discordUrl());
        server.setCategory(category);
        server.setVersion(request.version());
        server.setMaxPlayers(request.maxPlayers());
        server.setOwner(owner);

        ServerEntity saved = serverRepository.save(server);

        // Save tags
        if (request.tags() != null && !request.tags().isEmpty()) {
            List<ServerTagEntity> tags = new ArrayList<>();
            for (String tagName : request.tags()) {
                ServerTagEntity tagEntity = new ServerTagEntity();
                tagEntity.setServer(saved);
                tagEntity.setTag(tagName);
                tags.add(tagEntity);
            }
            saved.setTags(tags);
            saved = serverRepository.save(saved);
        }

        return serverMapper.toResponse(saved);
    }

    @Transactional
    public void incrementVoteCount(UUID serverId) {
        serverRepository.findById(serverId).ifPresent(server -> {
            server.setVoteCount(server.getVoteCount() + 1);
            serverRepository.save(server);
        });
    }

    public List<ServerResponse> getServersByOwner(UUID ownerId) {
        return serverRepository.findByOwnerId(ownerId).stream()
                .map(serverMapper::toResponse)
                .toList();
    }

    public ServerResponse getServerByIdForOwner(UUID serverId, UUID ownerId) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found"));

        // Server must have an owner and it must match the requesting user
        if (server.getOwner() == null || !server.getOwner().getId().equals(ownerId)) {
            throw new ResourceNotFoundException("Server not found");
        }

        return serverMapper.toResponse(server);
    }

    public ServerResponse getServerById(UUID serverId) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found"));
        return serverMapper.toResponse(server);
    }

    @Transactional
    public ServerResponse updateServer(UUID serverId, UpdateServerRequest request, UserEntity owner) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found"));

        // Verify ownership - server must have an owner and it must match the requesting user
        if (server.getOwner() == null || !server.getOwner().getId().equals(owner.getId())) {
            throw new SecurityException("You are not the owner of this server");
        }

        // Update category if changed
        if (request.categoryId() != null && !request.categoryId().isBlank()) {
            CategoryEntity category = categoryRepository.findById(UUID.fromString(request.categoryId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            server.setCategory(category);
        }

        // Update fields
        if (request.name() != null) server.setName(request.name());
        if (request.ipAddress() != null) server.setIpAddress(request.ipAddress());
        if (request.port() != null) server.setPort(request.port());
        if (request.shortDescription() != null) server.setShortDescription(request.shortDescription());
        if (request.description() != null) server.setDescription(request.description());
        if (request.bannerUrl() != null) server.setBannerUrl(request.bannerUrl());
        if (request.iconUrl() != null) server.setIconUrl(request.iconUrl());
        if (request.websiteUrl() != null) server.setWebsiteUrl(request.websiteUrl());
        if (request.discordUrl() != null) server.setDiscordUrl(request.discordUrl());
        if (request.version() != null) server.setVersion(request.version());
        if (request.maxPlayers() != null) server.setMaxPlayers(request.maxPlayers());

        // Update tags
        if (request.tags() != null) {
            server.getTags().clear();
            for (String tagName : request.tags()) {
                ServerTagEntity tagEntity = new ServerTagEntity();
                tagEntity.setServer(server);
                tagEntity.setTag(tagName);
                server.getTags().add(tagEntity);
            }
        }

        ServerEntity saved = serverRepository.save(server);
        return serverMapper.toResponse(saved);
    }

    @Transactional
    public void deleteServer(UUID serverId, UserEntity owner) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found"));

        // Verify ownership - server must have an owner and it must match the requesting user
        if (server.getOwner() == null || !server.getOwner().getId().equals(owner.getId())) {
            throw new SecurityException("You are not the owner of this server");
        }

        serverRepository.delete(server);
    }

    private String getSortField(String sort) {
        return switch (sort != null ? sort.toLowerCase() : "votes") {
            case "players" -> "playerCount";
            case "newest" -> "createdAt";
            case "name" -> "name";
            default -> "voteCount";
        };
    }

    private String generateSlug(String name) {
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(normalized).replaceAll("")
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");

        // Ensure uniqueness
        String baseSlug = slug;
        int counter = 1;
        while (serverRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        return slug;
    }
}

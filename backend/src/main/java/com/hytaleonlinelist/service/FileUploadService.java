package com.hytaleonlinelist.service;

import com.hytaleonlinelist.config.R2Properties;
import com.hytaleonlinelist.dto.response.UploadResponse;
import com.hytaleonlinelist.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Service for uploading files to Cloudflare R2 storage.
 *
 * File Storage Strategy:
 * ----------------------
 * - Banners: banners/{identifier}-{uuid}.{ext}  (server images)
 * - Icons:   icons/{identifier}-{uuid}.{ext}    (server images)
 * - Avatars: avatars/{userId}-{uuid}.{ext}      (user profile images)
 *
 * Where {identifier} is:
 * - Server slug (if known - for edits and imports)
 * - UUID only (for new server creation before slug exists)
 */
@Service
@ConditionalOnProperty(prefix = "cloudflare.r2", name = "enabled", havingValue = "true")
public class FileUploadService {

    private static final Logger log = LoggerFactory.getLogger(FileUploadService.class);

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp"
    );

    private static final Map<String, String> EXTENSION_TO_CONTENT_TYPE = Map.of(
            ".jpg", "image/jpeg",
            ".jpeg", "image/jpeg",
            ".png", "image/png",
            ".gif", "image/gif",
            ".webp", "image/webp"
    );

    private static final long MAX_ICON_SIZE = 2 * 1024 * 1024; // 2MB
    private static final long MAX_BANNER_SIZE = 5 * 1024 * 1024; // 5MB
    private static final long MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
    private static final long MAX_IMPORT_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB for imports

    private final S3Client s3Client;
    private final R2Properties r2Properties;
    private final HttpClient httpClient;

    public FileUploadService(S3Client s3Client, R2Properties r2Properties) {
        this.s3Client = s3Client;
        this.r2Properties = r2Properties;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    // ==================== Server Image Uploads ====================

    /**
     * Upload a server icon image.
     *
     * @param file The image file to upload
     * @param serverSlug Optional server slug for naming (null for new servers)
     * @return Upload response with the public URL
     */
    public UploadResponse uploadIcon(MultipartFile file, String serverSlug) throws IOException {
        validateImageFile(file, MAX_ICON_SIZE);
        String key = generateServerImageKey("icons", serverSlug, getFileExtension(file.getOriginalFilename()));
        return uploadFile(file, key);
    }

    /**
     * Upload a server banner image.
     *
     * @param file The image file to upload
     * @param serverSlug Optional server slug for naming (null for new servers)
     * @return Upload response with the public URL
     */
    public UploadResponse uploadBanner(MultipartFile file, String serverSlug) throws IOException {
        validateImageFile(file, MAX_BANNER_SIZE);
        String key = generateServerImageKey("banners", serverSlug, getFileExtension(file.getOriginalFilename()));
        return uploadFile(file, key);
    }

    // ==================== User Avatar Uploads ====================

    /**
     * Upload a user avatar image.
     *
     * @param file The image file to upload
     * @param userId The user's ID
     * @return Upload response with the public URL
     */
    public UploadResponse uploadAvatar(MultipartFile file, UUID userId) throws IOException {
        validateImageFile(file, MAX_AVATAR_SIZE);
        String key = generateAvatarKey(userId, getFileExtension(file.getOriginalFilename()));
        return uploadFile(file, key);
    }

    // ==================== URL-based Uploads (for imports) ====================

    /**
     * Downloads an image from a URL and uploads it to R2 storage.
     * Uses the same storage pattern as regular uploads.
     *
     * @param imageUrl The URL to download the image from
     * @param folder The folder ("banners" or "icons")
     * @param serverSlug The server slug for naming
     * @return The public URL of the uploaded image, or null if download/upload failed
     */
    public String uploadImageFromUrl(String imageUrl, String folder, String serverSlug) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return null;
        }

        try {
            // Download the image
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(imageUrl))
                    .timeout(Duration.ofSeconds(30))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

            if (response.statusCode() != 200) {
                log.warn("Failed to download image from {}: HTTP {}", imageUrl, response.statusCode());
                return null;
            }

            byte[] imageData = response.body();

            // Validate size
            if (imageData.length > MAX_IMPORT_IMAGE_SIZE) {
                log.warn("Image from {} exceeds max size: {} bytes", imageUrl, imageData.length);
                return null;
            }

            // Determine content type and extension
            String contentType = response.headers().firstValue("Content-Type").orElse(null);
            String extension = determineExtension(imageUrl, contentType);

            if (extension == null) {
                log.warn("Could not determine image type for {}", imageUrl);
                return null;
            }

            // Determine actual content type from extension
            String actualContentType = EXTENSION_TO_CONTENT_TYPE.getOrDefault(extension, "image/jpeg");

            // Generate key using same pattern as regular uploads
            String key = generateServerImageKey(folder, serverSlug, extension);

            // Upload to R2
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(r2Properties.getBucketName())
                    .key(key)
                    .contentType(actualContentType)
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromBytes(imageData));

            String publicUrl = r2Properties.getPublicUrl() + "/" + key;
            log.debug("Uploaded image to R2: {}", publicUrl);

            return publicUrl;

        } catch (IOException | InterruptedException e) {
            log.warn("Error downloading/uploading image from {}: {}", imageUrl, e.getMessage());
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return null;
        } catch (Exception e) {
            log.warn("Unexpected error processing image from {}: {}", imageUrl, e.getMessage());
            return null;
        }
    }

    // ==================== File Deletion ====================

    /**
     * Delete a file from R2 storage.
     *
     * @param fileUrl The public URL of the file to delete
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith(r2Properties.getPublicUrl())) {
            return;
        }

        String key = fileUrl.replace(r2Properties.getPublicUrl() + "/", "");

        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(r2Properties.getBucketName())
                .key(key)
                .build();

        s3Client.deleteObject(deleteRequest);
        log.debug("Deleted file from R2: {}", key);
    }

    // ==================== Private Helper Methods ====================

    private UploadResponse uploadFile(MultipartFile file, String key) throws IOException {
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(r2Properties.getBucketName())
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putRequest, RequestBody.fromBytes(file.getBytes()));

        String publicUrl = r2Properties.getPublicUrl() + "/" + key;
        return new UploadResponse(publicUrl, key, file.getSize());
    }

    private void validateImageFile(MultipartFile file, long maxSize) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new BadRequestException("Invalid file type. Allowed types: JPEG, PNG, GIF, WebP");
        }

        if (file.getSize() > maxSize) {
            throw new BadRequestException("File size exceeds maximum allowed size of " + (maxSize / 1024 / 1024) + "MB");
        }
    }

    /**
     * Generate storage key for server images (banners/icons).
     * Pattern: {folder}/{slug}-{shortUuid}.{ext} or {folder}/{uuid}.{ext}
     */
    private String generateServerImageKey(String folder, String serverSlug, String extension) {
        String shortUuid = UUID.randomUUID().toString().substring(0, 8);
        String filename;

        if (serverSlug != null && !serverSlug.isBlank()) {
            // With slug: banners/my-server-a1b2c3d4.jpg
            filename = sanitizeSlug(serverSlug) + "-" + shortUuid + extension;
        } else {
            // Without slug (new server): banners/a1b2c3d4-e5f6g7h8.jpg
            filename = UUID.randomUUID().toString().substring(0, 8) + "-" + shortUuid + extension;
        }

        return folder + "/" + filename;
    }

    /**
     * Generate storage key for user avatars.
     * Pattern: avatars/{userId}-{shortUuid}.{ext}
     */
    private String generateAvatarKey(UUID userId, String extension) {
        String shortUuid = UUID.randomUUID().toString().substring(0, 8);
        String filename = userId.toString().substring(0, 8) + "-" + shortUuid + extension;
        return "avatars/" + filename;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg"; // Default extension
        }
        return filename.substring(filename.lastIndexOf(".")).toLowerCase();
    }

    /**
     * Determines the file extension from URL or content type.
     */
    private String determineExtension(String url, String contentType) {
        // First try to get from URL
        String urlLower = url.toLowerCase();
        for (String ext : EXTENSION_TO_CONTENT_TYPE.keySet()) {
            if (urlLower.contains(ext)) {
                return ext;
            }
        }

        // Fall back to content type
        if (contentType != null) {
            String ctLower = contentType.toLowerCase();
            if (ctLower.contains("jpeg") || ctLower.contains("jpg")) return ".jpg";
            if (ctLower.contains("png")) return ".png";
            if (ctLower.contains("gif")) return ".gif";
            if (ctLower.contains("webp")) return ".webp";
        }

        // Default to jpg
        return ".jpg";
    }

    /**
     * Sanitizes a slug for use in filenames.
     */
    private String sanitizeSlug(String slug) {
        if (slug == null) return "";
        return slug.toLowerCase()
                .replaceAll("[^a-z0-9\\-]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}

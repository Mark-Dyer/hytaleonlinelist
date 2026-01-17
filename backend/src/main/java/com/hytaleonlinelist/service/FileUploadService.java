package com.hytaleonlinelist.service;

import com.hytaleonlinelist.config.R2Properties;
import com.hytaleonlinelist.dto.response.UploadResponse;
import com.hytaleonlinelist.exception.BadRequestException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@Service
@ConditionalOnProperty(prefix = "cloudflare.r2", name = "enabled", havingValue = "true")
public class FileUploadService {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp"
    );

    private static final long MAX_ICON_SIZE = 2 * 1024 * 1024; // 2MB
    private static final long MAX_BANNER_SIZE = 5 * 1024 * 1024; // 5MB
    private static final long MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

    private final S3Client s3Client;
    private final R2Properties r2Properties;

    public FileUploadService(S3Client s3Client, R2Properties r2Properties) {
        this.s3Client = s3Client;
        this.r2Properties = r2Properties;
    }

    public UploadResponse uploadIcon(MultipartFile file, UUID userId) throws IOException {
        validateImageFile(file, MAX_ICON_SIZE);
        String key = generateKey("icons", userId, file);
        return uploadFile(file, key);
    }

    public UploadResponse uploadBanner(MultipartFile file, UUID userId) throws IOException {
        validateImageFile(file, MAX_BANNER_SIZE);
        String key = generateKey("banners", userId, file);
        return uploadFile(file, key);
    }

    public UploadResponse uploadAvatar(MultipartFile file, UUID userId) throws IOException {
        validateImageFile(file, MAX_AVATAR_SIZE);
        String key = generateKey("avatars", userId, file);
        return uploadFile(file, key);
    }

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
    }

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

    private String generateKey(String folder, UUID userId, MultipartFile file) {
        String extension = getFileExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID().toString() + extension;
        return String.format("%s/%s/%s", folder, userId.toString(), filename);
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
}

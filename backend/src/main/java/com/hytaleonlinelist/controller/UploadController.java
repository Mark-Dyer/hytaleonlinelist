package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.dto.response.UploadResponse;
import com.hytaleonlinelist.security.EmailVerified;
import com.hytaleonlinelist.security.UserPrincipal;
import com.hytaleonlinelist.service.FileUploadService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Controller for file uploads to R2 storage.
 *
 * Endpoints:
 * - POST /api/upload/icon?serverSlug={slug} - Upload server icon
 * - POST /api/upload/banner?serverSlug={slug} - Upload server banner
 * - POST /api/upload/avatar - Upload user avatar
 *
 * The serverSlug parameter is optional:
 * - For new servers: omit serverSlug (files named with UUID)
 * - For existing servers: include serverSlug (files named with slug)
 */
@RestController
@RequestMapping("/api/upload")
@ConditionalOnProperty(prefix = "cloudflare.r2", name = "enabled", havingValue = "true")
public class UploadController {

    private final FileUploadService fileUploadService;

    public UploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    /**
     * Upload a server icon image.
     *
     * @param file The image file to upload
     * @param serverSlug Optional server slug for naming (omit for new servers)
     * @return The uploaded file URL and metadata
     */
    @PostMapping("/icon")
    @EmailVerified
    public ResponseEntity<UploadResponse> uploadIcon(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "serverSlug", required = false) String serverSlug,
            @AuthenticationPrincipal UserPrincipal principal) throws IOException {

        UploadResponse response = fileUploadService.uploadIcon(file, serverSlug);
        return ResponseEntity.ok(response);
    }

    /**
     * Upload a server banner image.
     *
     * @param file The image file to upload
     * @param serverSlug Optional server slug for naming (omit for new servers)
     * @return The uploaded file URL and metadata
     */
    @PostMapping("/banner")
    @EmailVerified
    public ResponseEntity<UploadResponse> uploadBanner(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "serverSlug", required = false) String serverSlug,
            @AuthenticationPrincipal UserPrincipal principal) throws IOException {

        UploadResponse response = fileUploadService.uploadBanner(file, serverSlug);
        return ResponseEntity.ok(response);
    }

    /**
     * Upload a user avatar image.
     *
     * @param file The image file to upload
     * @return The uploaded file URL and metadata
     */
    @PostMapping("/avatar")
    public ResponseEntity<UploadResponse> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) throws IOException {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        UploadResponse response = fileUploadService.uploadAvatar(file, principal.id());
        return ResponseEntity.ok(response);
    }
}

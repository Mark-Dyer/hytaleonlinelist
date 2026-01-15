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

@RestController
@RequestMapping("/api/upload")
@ConditionalOnProperty(prefix = "cloudflare.r2", name = "enabled", havingValue = "true")
public class UploadController {

    private final FileUploadService fileUploadService;

    public UploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/icon")
    @EmailVerified
    public ResponseEntity<UploadResponse> uploadIcon(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) throws IOException {

        UploadResponse response = fileUploadService.uploadIcon(file, principal.id());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/banner")
    @EmailVerified
    public ResponseEntity<UploadResponse> uploadBanner(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) throws IOException {

        UploadResponse response = fileUploadService.uploadBanner(file, principal.id());
        return ResponseEntity.ok(response);
    }
}

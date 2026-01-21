package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.config.AppProperties;
import com.hytaleonlinelist.dto.request.BanUserRequest;
import com.hytaleonlinelist.dto.request.ChangeRoleRequest;
import com.hytaleonlinelist.dto.response.*;
import com.hytaleonlinelist.security.UserPrincipal;
import com.hytaleonlinelist.service.AdminService;
import com.hytaleonlinelist.service.dataimport.DataImportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AppProperties appProperties;
    private final DataImportService dataImportService;

    public AdminController(
            AdminService adminService,
            AppProperties appProperties,
            DataImportService dataImportService) {
        this.adminService = adminService;
        this.appProperties = appProperties;
        this.dataImportService = dataImportService;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<PaginatedResponse<AdminUserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getUsers(page, size, search));
    }

    @GetMapping("/servers")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<PaginatedResponse<AdminServerResponse>> getServers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getServers(page, size, search));
    }

    @PostMapping("/servers/{id}/feature")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<AdminServerResponse> featureServer(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(adminService.featureServer(id, principal.id()));
    }

    @PostMapping("/servers/{id}/verify")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    public ResponseEntity<AdminServerResponse> verifyServer(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(adminService.verifyServer(id, principal.id()));
    }

    @DeleteMapping("/servers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteServer(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        adminService.deleteServer(id, principal.id());
        return ResponseEntity.ok(new MessageResponse("Server deleted successfully"));
    }

    @PostMapping("/users/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserResponse> banUser(
            @PathVariable UUID id,
            @Valid @RequestBody BanUserRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(adminService.banUser(id, request, principal.id()));
    }

    @PostMapping("/users/{id}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserResponse> unbanUser(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(adminService.unbanUser(id, principal.id()));
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserResponse> changeUserRole(
            @PathVariable UUID id,
            @Valid @RequestBody ChangeRoleRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(adminService.changeUserRole(id, request, principal.id()));
    }

    @GetMapping("/audit-log")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaginatedResponse<AdminActionResponse>> getAuditLog(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getAuditLog(page, size));
    }

    // Settings endpoints

    @GetMapping("/settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminSettingsResponse> getSettings() {
        return ResponseEntity.ok(new AdminSettingsResponse(
                appProperties.isRegistrationEnabled(),
                appProperties.isDiscordLoginEnabled(),
                appProperties.isGoogleLoginEnabled()
        ));
    }

    @PutMapping("/settings/registration")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminSettingsResponse> setRegistrationEnabled(
            @RequestParam boolean enabled) {
        appProperties.setRegistrationEnabled(enabled);
        return ResponseEntity.ok(new AdminSettingsResponse(
                appProperties.isRegistrationEnabled(),
                appProperties.isDiscordLoginEnabled(),
                appProperties.isGoogleLoginEnabled()
        ));
    }

    @PutMapping("/settings/discord-login")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminSettingsResponse> setDiscordLoginEnabled(
            @RequestParam boolean enabled) {
        appProperties.setDiscordLoginEnabled(enabled);
        return ResponseEntity.ok(new AdminSettingsResponse(
                appProperties.isRegistrationEnabled(),
                appProperties.isDiscordLoginEnabled(),
                appProperties.isGoogleLoginEnabled()
        ));
    }

    @PutMapping("/settings/google-login")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminSettingsResponse> setGoogleLoginEnabled(
            @RequestParam boolean enabled) {
        appProperties.setGoogleLoginEnabled(enabled);
        return ResponseEntity.ok(new AdminSettingsResponse(
                appProperties.isRegistrationEnabled(),
                appProperties.isDiscordLoginEnabled(),
                appProperties.isGoogleLoginEnabled()
        ));
    }

    // Data import endpoints

    /**
     * Import servers from hytale-servers.com.
     * This is a one-time operation to seed the database with existing servers.
     * Only ADMIN role can trigger this import.
     */
    @PostMapping("/import/servers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DataImportService.ImportResult> importServers() {
        DataImportService.ImportResult result = dataImportService.importAllServers();
        return ResponseEntity.ok(result);
    }
}

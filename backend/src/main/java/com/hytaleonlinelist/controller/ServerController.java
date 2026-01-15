package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.domain.entity.UserEntity;
import com.hytaleonlinelist.domain.repository.UserRepository;
import com.hytaleonlinelist.dto.request.CreateServerRequest;
import com.hytaleonlinelist.dto.request.UpdateServerRequest;
import com.hytaleonlinelist.dto.response.MessageResponse;
import com.hytaleonlinelist.dto.response.PaginatedResponse;
import com.hytaleonlinelist.dto.response.ServerResponse;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import com.hytaleonlinelist.security.EmailVerified;
import com.hytaleonlinelist.security.UserPrincipal;
import com.hytaleonlinelist.service.ServerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/servers")
public class ServerController {

    private final ServerService serverService;
    private final UserRepository userRepository;

    public ServerController(ServerService serverService, UserRepository userRepository) {
        this.serverService = serverService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<ServerResponse>> getServers(
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean online,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {

        PaginatedResponse<ServerResponse> response = serverService.getServers(
                sort, category, search, online, page, limit
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ServerResponse> getServerBySlug(@PathVariable String slug) {
        ServerResponse server = serverService.getServerBySlugAndIncrementViews(slug);
        return ResponseEntity.ok(server);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ServerResponse>> getFeaturedServers() {
        List<ServerResponse> servers = serverService.getFeaturedServers();
        return ResponseEntity.ok(servers);
    }

    @GetMapping("/my-servers")
    public ResponseEntity<List<ServerResponse>> getMyServers(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ServerResponse> servers = serverService.getServersByOwner(principal.id());
        return ResponseEntity.ok(servers);
    }

    @GetMapping("/my-servers/{id}")
    public ResponseEntity<ServerResponse> getMyServerById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ServerResponse server = serverService.getServerByIdForOwner(id, principal.id());
        return ResponseEntity.ok(server);
    }

    @PostMapping
    @EmailVerified
    public ResponseEntity<ServerResponse> createServer(
            @Valid @RequestBody CreateServerRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        UserEntity owner = userRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ServerResponse server = serverService.createServer(request, owner);
        return ResponseEntity.ok(server);
    }

    @PutMapping("/{id}")
    @EmailVerified
    public ResponseEntity<ServerResponse> updateServer(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateServerRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        UserEntity owner = userRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ServerResponse server = serverService.updateServer(id, request, owner);
        return ResponseEntity.ok(server);
    }

    @DeleteMapping("/{id}")
    @EmailVerified
    public ResponseEntity<MessageResponse> deleteServer(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {

        UserEntity owner = userRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        serverService.deleteServer(id, owner);
        return ResponseEntity.ok(new MessageResponse("Server deleted successfully"));
    }
}

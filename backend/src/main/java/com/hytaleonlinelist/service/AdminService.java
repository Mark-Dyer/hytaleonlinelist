package com.hytaleonlinelist.service;

import com.hytaleonlinelist.domain.entity.*;
import com.hytaleonlinelist.domain.repository.*;
import com.hytaleonlinelist.dto.request.BanUserRequest;
import com.hytaleonlinelist.dto.request.ChangeRoleRequest;
import com.hytaleonlinelist.dto.response.*;
import com.hytaleonlinelist.exception.BadRequestException;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final ServerRepository serverRepository;
    private final VoteRepository voteRepository;
    private final AdminActionRepository adminActionRepository;

    public AdminService(
            UserRepository userRepository,
            ServerRepository serverRepository,
            VoteRepository voteRepository,
            AdminActionRepository adminActionRepository) {
        this.userRepository = userRepository;
        this.serverRepository = serverRepository;
        this.voteRepository = voteRepository;
        this.adminActionRepository = adminActionRepository;
    }

    public AdminStatsResponse getStats() {
        Instant todayStart = LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC);

        long totalUsers = userRepository.count();
        long totalServers = serverRepository.count();
        long totalVotes = voteRepository.count();
        long newUsersToday = userRepository.countUsersCreatedSince(todayStart);
        long newServersToday = serverRepository.countServersCreatedSince(todayStart);

        return new AdminStatsResponse(
                totalUsers,
                totalServers,
                totalVotes,
                newUsersToday,
                newServersToday
        );
    }

    public PaginatedResponse<AdminUserResponse> getUsers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserEntity> userPage = userRepository.findAllWithSearch(search, pageable);

        var users = userPage.getContent().stream()
                .map(this::toAdminUserResponse)
                .toList();

        return new PaginatedResponse<>(
                users,
                new PaginationMeta(
                        userPage.getNumber() + 1,
                        userPage.getSize(),
                        userPage.getTotalElements(),
                        userPage.getTotalPages()
                )
        );
    }

    public PaginatedResponse<AdminServerResponse> getServers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ServerEntity> serverPage = serverRepository.findAllWithSearchForAdmin(search, pageable);

        var servers = serverPage.getContent().stream()
                .map(this::toAdminServerResponse)
                .toList();

        return new PaginatedResponse<>(
                servers,
                new PaginationMeta(
                        serverPage.getNumber() + 1,
                        serverPage.getSize(),
                        serverPage.getTotalElements(),
                        serverPage.getTotalPages()
                )
        );
    }

    @Transactional
    public AdminServerResponse featureServer(UUID serverId, UUID adminId) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found"));

        UserEntity admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        boolean newFeaturedStatus = !server.getIsFeatured();
        server.setIsFeatured(newFeaturedStatus);
        serverRepository.save(server);

        logAction(admin,
                newFeaturedStatus ? AdminActionType.SERVER_FEATURED : AdminActionType.SERVER_UNFEATURED,
                TargetType.SERVER,
                serverId,
                "Server: " + server.getName());

        return toAdminServerResponse(server);
    }

    @Transactional
    public AdminServerResponse verifyServer(UUID serverId, UUID adminId) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found"));

        UserEntity admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        boolean newVerifiedStatus = !server.getIsVerified();
        server.setIsVerified(newVerifiedStatus);
        serverRepository.save(server);

        logAction(admin,
                newVerifiedStatus ? AdminActionType.SERVER_VERIFIED : AdminActionType.SERVER_UNVERIFIED,
                TargetType.SERVER,
                serverId,
                "Server: " + server.getName());

        return toAdminServerResponse(server);
    }

    @Transactional
    public void deleteServer(UUID serverId, UUID adminId) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found"));

        UserEntity admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        String serverName = server.getName();
        serverRepository.delete(server);

        logAction(admin,
                AdminActionType.SERVER_DELETED,
                TargetType.SERVER,
                serverId,
                "Deleted server: " + serverName);
    }

    @Transactional
    public AdminUserResponse banUser(UUID userId, BanUserRequest request, UUID adminId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserEntity admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        if (user.getId().equals(adminId)) {
            throw new BadRequestException("You cannot ban yourself");
        }

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot ban an admin user");
        }

        user.setBanned(true);
        user.setBannedAt(Instant.now());
        user.setBannedReason(request.reason());
        userRepository.save(user);

        logAction(admin,
                AdminActionType.USER_BANNED,
                TargetType.USER,
                userId,
                "Banned user: " + user.getUsername() + ". Reason: " + request.reason());

        return toAdminUserResponse(user);
    }

    @Transactional
    public AdminUserResponse unbanUser(UUID userId, UUID adminId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserEntity admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        user.setBanned(false);
        user.setBannedAt(null);
        user.setBannedReason(null);
        userRepository.save(user);

        logAction(admin,
                AdminActionType.USER_UNBANNED,
                TargetType.USER,
                userId,
                "Unbanned user: " + user.getUsername());

        return toAdminUserResponse(user);
    }

    @Transactional
    public AdminUserResponse changeUserRole(UUID userId, ChangeRoleRequest request, UUID adminId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserEntity admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        if (user.getId().equals(adminId)) {
            throw new BadRequestException("You cannot change your own role");
        }

        Role oldRole = user.getRole();
        Role newRole = Role.valueOf(request.role());

        user.setRole(newRole);
        userRepository.save(user);

        logAction(admin,
                AdminActionType.USER_ROLE_CHANGED,
                TargetType.USER,
                userId,
                "Changed role for " + user.getUsername() + " from " + oldRole + " to " + newRole);

        return toAdminUserResponse(user);
    }

    public PaginatedResponse<AdminActionResponse> getAuditLog(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminActionEntity> actionPage = adminActionRepository.findAllByOrderByCreatedAtDesc(pageable);

        var actions = actionPage.getContent().stream()
                .map(this::toAdminActionResponse)
                .toList();

        return new PaginatedResponse<>(
                actions,
                new PaginationMeta(
                        actionPage.getNumber() + 1,
                        actionPage.getSize(),
                        actionPage.getTotalElements(),
                        actionPage.getTotalPages()
                )
        );
    }

    @Transactional
    public void logReviewDeletion(UUID reviewId, String targetName, UUID adminId) {
        UserEntity admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        logAction(admin,
                AdminActionType.REVIEW_DELETED,
                TargetType.REVIEW,
                reviewId,
                "Deleted review: " + targetName);
    }

    private void logAction(UserEntity admin, AdminActionType actionType, TargetType targetType,
                          UUID targetId, String details) {
        AdminActionEntity action = new AdminActionEntity();
        action.setAdmin(admin);
        action.setActionType(actionType);
        action.setTargetType(targetType);
        action.setTargetId(targetId);
        action.setDetails(details);
        adminActionRepository.save(action);
    }

    private AdminUserResponse toAdminUserResponse(UserEntity user) {
        long serverCount = serverRepository.countByOwnerId(user.getId());
        return new AdminUserResponse(
                user.getId().toString(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getRole().name(),
                user.isEmailVerified(),
                user.isBanned(),
                user.getBannedReason(),
                user.getCreatedAt().toString(),
                serverCount
        );
    }

    private AdminServerResponse toAdminServerResponse(ServerEntity server) {
        return new AdminServerResponse(
                server.getId().toString(),
                server.getName(),
                server.getSlug(),
                server.getIconUrl(),
                server.getOwner() != null ? server.getOwner().getUsername() : null,
                server.getOwner() != null ? server.getOwner().getId().toString() : null,
                server.getIsFeatured(),
                server.getIsVerified(),
                server.getIsOnline(),
                server.getVoteCount(),
                server.getPlayerCount(),
                server.getCreatedAt().toString()
        );
    }

    private AdminActionResponse toAdminActionResponse(AdminActionEntity action) {
        String targetName = getTargetName(action.getTargetType(), action.getTargetId());
        return new AdminActionResponse(
                action.getId().toString(),
                action.getAdmin().getId().toString(),
                action.getAdmin().getUsername(),
                action.getActionType().name(),
                action.getTargetType().name(),
                action.getTargetId().toString(),
                targetName,
                action.getDetails(),
                action.getCreatedAt().toString()
        );
    }

    private String getTargetName(TargetType type, UUID targetId) {
        return switch (type) {
            case SERVER -> serverRepository.findById(targetId)
                    .map(ServerEntity::getName)
                    .orElse("Deleted Server");
            case USER -> userRepository.findById(targetId)
                    .map(UserEntity::getUsername)
                    .orElse("Deleted User");
            case REVIEW -> "Deleted Review";
        };
    }
}

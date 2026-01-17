package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.domain.entity.ReviewEntity;
import com.hytaleonlinelist.domain.entity.UserEntity;
import com.hytaleonlinelist.domain.repository.UserRepository;
import com.hytaleonlinelist.dto.request.CreateReviewRequest;
import com.hytaleonlinelist.dto.request.UpdateReviewRequest;
import com.hytaleonlinelist.dto.response.PaginatedResponse;
import com.hytaleonlinelist.dto.response.ReviewResponse;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import com.hytaleonlinelist.security.EmailVerified;
import com.hytaleonlinelist.security.UserPrincipal;
import com.hytaleonlinelist.service.AdminService;
import com.hytaleonlinelist.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;
    private final AdminService adminService;

    public ReviewController(ReviewService reviewService,
                           UserRepository userRepository,
                           AdminService adminService) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
        this.adminService = adminService;
    }

    /**
     * Get reviews for a server (public, paginated)
     */
    @GetMapping("/server/{serverId}")
    public ResponseEntity<PaginatedResponse<ReviewResponse>> getServerReviews(
            @PathVariable UUID serverId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal principal) {

        UUID currentUserId = principal != null ? principal.id() : null;
        PaginatedResponse<ReviewResponse> reviews = reviewService.getReviewsForServer(
                serverId, page, size, currentUserId
        );
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get current user's review for a server
     */
    @GetMapping("/server/{serverId}/me")
    public ResponseEntity<ReviewResponse> getMyReview(
            @PathVariable UUID serverId,
            @AuthenticationPrincipal UserPrincipal principal) {

        return reviewService.getUserReviewForServer(serverId, principal.id())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new review for a server
     */
    @PostMapping("/server/{serverId}")
    @EmailVerified
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable UUID serverId,
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        UserEntity user = userRepository.findById(principal.id())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ReviewResponse response = reviewService.createReview(serverId, request, user);
        return ResponseEntity.ok(response);
    }

    /**
     * Update own review
     */
    @PutMapping("/{reviewId}")
    @EmailVerified
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable UUID reviewId,
            @Valid @RequestBody UpdateReviewRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        ReviewResponse response = reviewService.updateReview(reviewId, request, principal.id());
        return ResponseEntity.ok(response);
    }

    /**
     * Delete own review
     */
    @DeleteMapping("/{reviewId}")
    @EmailVerified
    public ResponseEntity<Void> deleteReview(
            @PathVariable UUID reviewId,
            @AuthenticationPrincipal UserPrincipal principal) {

        reviewService.deleteReview(reviewId, principal.id());
        return ResponseEntity.noContent().build();
    }

    /**
     * Admin: Delete any review
     */
    @DeleteMapping("/admin/{reviewId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adminDeleteReview(
            @PathVariable UUID reviewId,
            @AuthenticationPrincipal UserPrincipal principal) {

        // Get review info for audit log before deletion
        ReviewEntity review = reviewService.getReviewById(reviewId);
        String targetName = review.getUser().getUsername() + "'s review on " + review.getServer().getName();

        reviewService.adminDeleteReview(reviewId);

        // Log the action
        adminService.logReviewDeletion(reviewId, targetName, principal.id());

        return ResponseEntity.noContent().build();
    }
}

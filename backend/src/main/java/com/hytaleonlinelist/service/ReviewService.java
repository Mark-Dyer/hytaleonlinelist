package com.hytaleonlinelist.service;

import com.hytaleonlinelist.domain.entity.ReviewEntity;
import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.UserEntity;
import com.hytaleonlinelist.domain.repository.ReviewRepository;
import com.hytaleonlinelist.domain.repository.ServerRepository;
import com.hytaleonlinelist.dto.request.CreateReviewRequest;
import com.hytaleonlinelist.dto.request.UpdateReviewRequest;
import com.hytaleonlinelist.dto.response.PaginatedResponse;
import com.hytaleonlinelist.dto.response.PaginationMeta;
import com.hytaleonlinelist.dto.response.ReviewResponse;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import com.hytaleonlinelist.mapper.ReviewMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ServerRepository serverRepository;
    private final ReviewMapper reviewMapper;

    public ReviewService(ReviewRepository reviewRepository,
                        ServerRepository serverRepository,
                        ReviewMapper reviewMapper) {
        this.reviewRepository = reviewRepository;
        this.serverRepository = serverRepository;
        this.reviewMapper = reviewMapper;
    }

    public PaginatedResponse<ReviewResponse> getReviewsForServer(UUID serverId, int page, int limit, UUID currentUserId) {
        PageRequest pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ReviewEntity> reviewPage = reviewRepository.findByServerIdWithUser(serverId, pageable);

        List<ReviewResponse> reviews = reviewPage.getContent().stream()
                .map(entity -> reviewMapper.toResponse(entity, currentUserId))
                .toList();

        PaginationMeta meta = new PaginationMeta(
                page,
                limit,
                reviewPage.getTotalElements(),
                reviewPage.getTotalPages()
        );

        return new PaginatedResponse<>(reviews, meta);
    }

    public Optional<ReviewResponse> getUserReviewForServer(UUID serverId, UUID userId) {
        return reviewRepository.findByServerIdAndUserId(serverId, userId)
                .map(entity -> reviewMapper.toResponse(entity, userId));
    }

    @Transactional
    public ReviewResponse createReview(UUID serverId, CreateReviewRequest request, UserEntity user) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found"));

        // Check if user already reviewed this server
        if (reviewRepository.existsByServerIdAndUserId(serverId, user.getId())) {
            throw new IllegalStateException("You have already reviewed this server");
        }

        // Check if user is the server owner
        if (server.getOwner().getId().equals(user.getId())) {
            throw new IllegalStateException("You cannot review your own server");
        }

        ReviewEntity review = new ReviewEntity();
        review.setServer(server);
        review.setUser(user);
        review.setRating(request.rating());
        review.setContent(request.content());

        ReviewEntity saved = reviewRepository.save(review);

        // Update server rating statistics
        recalculateServerRating(serverId);

        return reviewMapper.toResponse(saved, user.getId());
    }

    @Transactional
    public ReviewResponse updateReview(UUID reviewId, UpdateReviewRequest request, UUID userId) {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        // Check ownership
        if (!review.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only edit your own reviews");
        }

        review.setRating(request.rating());
        review.setContent(request.content());

        ReviewEntity saved = reviewRepository.save(review);

        // Update server rating statistics
        recalculateServerRating(review.getServer().getId());

        return reviewMapper.toResponse(saved, userId);
    }

    @Transactional
    public void deleteReview(UUID reviewId, UUID userId) {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        // Check ownership
        if (!review.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only delete your own reviews");
        }

        UUID serverId = review.getServer().getId();
        reviewRepository.delete(review);

        // Update server rating statistics
        recalculateServerRating(serverId);
    }

    @Transactional
    public void adminDeleteReview(UUID reviewId) {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        UUID serverId = review.getServer().getId();
        reviewRepository.delete(review);

        // Update server rating statistics
        recalculateServerRating(serverId);
    }

    public ReviewEntity getReviewById(UUID reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
    }

    @Transactional
    public void recalculateServerRating(UUID serverId) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found"));

        long count = reviewRepository.countByServerId(serverId);
        Double avgRating = reviewRepository.getAverageRatingByServerId(serverId);

        server.setReviewCount((int) count);

        if (avgRating != null) {
            // Round to 1 decimal place
            BigDecimal rounded = BigDecimal.valueOf(avgRating).setScale(1, RoundingMode.HALF_UP);
            server.setAverageRating(rounded);
        } else {
            server.setAverageRating(null);
        }

        serverRepository.save(server);
    }
}

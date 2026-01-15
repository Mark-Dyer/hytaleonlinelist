package com.hytaleonlinelist.service;

import com.hytaleonlinelist.domain.entity.ReviewEntity;
import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.UserEntity;
import com.hytaleonlinelist.domain.repository.ReviewRepository;
import com.hytaleonlinelist.domain.repository.ServerRepository;
import com.hytaleonlinelist.dto.request.CreateReviewRequest;
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

import java.util.List;
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

    public PaginatedResponse<ReviewResponse> getReviewsForServer(UUID serverId, int page, int limit) {
        PageRequest pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ReviewEntity> reviewPage = reviewRepository.findByServerId(serverId, pageable);

        List<ReviewResponse> reviews = reviewPage.getContent().stream()
                .map(reviewMapper::toResponse)
                .toList();

        PaginationMeta meta = new PaginationMeta(
                page,
                limit,
                reviewPage.getTotalElements(),
                reviewPage.getTotalPages()
        );

        return new PaginatedResponse<>(reviews, meta);
    }

    @Transactional
    public ReviewResponse createReview(UUID serverId, CreateReviewRequest request, UserEntity user) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found"));

        // Check if user already reviewed this server
        if (reviewRepository.existsByServerIdAndUserId(serverId, user.getId())) {
            throw new IllegalStateException("User has already reviewed this server");
        }

        ReviewEntity review = new ReviewEntity();
        review.setServer(server);
        review.setUser(user);
        review.setRating(request.rating());
        review.setContent(request.content());

        ReviewEntity saved = reviewRepository.save(review);
        return reviewMapper.toResponse(saved);
    }
}

package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.dto.response.PaginatedResponse;
import com.hytaleonlinelist.dto.response.ReviewResponse;
import com.hytaleonlinelist.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/servers/{serverId}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<ReviewResponse>> getReviews(
            @PathVariable String serverId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {

        PaginatedResponse<ReviewResponse> reviews = reviewService.getReviewsForServer(
                UUID.fromString(serverId), page, limit
        );
        return ResponseEntity.ok(reviews);
    }

    // TODO: Implement POST endpoint when authentication is added
    // @PostMapping
}

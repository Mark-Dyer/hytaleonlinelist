package com.hytaleonlinelist.dto.request;

import jakarta.validation.constraints.*;

public record UpdateReviewRequest(
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    Integer rating,

    @NotBlank(message = "Content is required")
    @Size(min = 10, max = 2000, message = "Content must be between 10 and 2000 characters")
    String content
) {}

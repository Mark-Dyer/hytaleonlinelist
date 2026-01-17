package com.hytaleonlinelist.dto.request;

import jakarta.validation.constraints.Size;

public record BanUserRequest(
    @Size(max = 500, message = "Ban reason must not exceed 500 characters")
    String reason
) {}

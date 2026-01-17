package com.hytaleonlinelist.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangeRoleRequest(
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(USER|MODERATOR|ADMIN)$", message = "Role must be USER, MODERATOR, or ADMIN")
    String role
) {}

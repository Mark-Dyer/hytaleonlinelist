package com.hytaleonlinelist.dto.request;

import jakarta.validation.constraints.*;
import java.util.List;

public record UpdateServerRequest(
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    String name,

    @Size(max = 255, message = "IP address must not exceed 255 characters")
    String ipAddress,

    @Min(value = 1, message = "Port must be at least 1")
    @Max(value = 65535, message = "Port must not exceed 65535")
    Integer port,

    @Size(min = 10, max = 200, message = "Short description must be between 10 and 200 characters")
    String shortDescription,

    @Size(min = 50, max = 10000, message = "Description must be between 50 and 10000 characters")
    String description,

    @Pattern(regexp = "^(https?://.*)?$", message = "Banner URL must be a valid URL")
    @Size(max = 500, message = "Banner URL must not exceed 500 characters")
    String bannerUrl,

    @Pattern(regexp = "^(https?://.*)?$", message = "Icon URL must be a valid URL")
    @Size(max = 500, message = "Icon URL must not exceed 500 characters")
    String iconUrl,

    @Pattern(regexp = "^(https?://.*)?$", message = "Website URL must be a valid URL")
    @Size(max = 500, message = "Website URL must not exceed 500 characters")
    String websiteUrl,

    @Pattern(regexp = "^(https?://(discord\\.gg|discord\\.com)/.*)?$", message = "Discord URL must be a valid Discord invite URL")
    @Size(max = 500, message = "Discord URL must not exceed 500 characters")
    String discordUrl,

    String categoryId,

    @Size(max = 10, message = "Maximum 10 tags allowed")
    List<@Size(min = 2, max = 50, message = "Each tag must be between 2 and 50 characters") String> tags,

    @Size(max = 20, message = "Version must not exceed 20 characters")
    String version,

    @Min(value = 1, message = "Max players must be at least 1")
    @Max(value = 100000, message = "Max players must not exceed 100000")
    Integer maxPlayers
) {}

package com.hytaleonlinelist.mapper;

import com.hytaleonlinelist.domain.entity.ReviewEntity;
import com.hytaleonlinelist.dto.response.ReviewResponse;
import com.hytaleonlinelist.dto.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Context;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ReviewMapper {

    @Mapping(target = "id", expression = "java(entity.getId().toString())")
    @Mapping(target = "serverId", expression = "java(entity.getServer().getId().toString())")
    @Mapping(target = "createdAt", expression = "java(formatInstant(entity.getCreatedAt()))")
    @Mapping(target = "updatedAt", expression = "java(formatInstant(entity.getUpdatedAt()))")
    @Mapping(target = "user", source = "user")
    @Mapping(target = "isOwner", expression = "java(isOwner(entity, currentUserId))")
    ReviewResponse toResponse(ReviewEntity entity, @Context UUID currentUserId);

    default String formatInstant(Instant instant) {
        if (instant == null) return null;
        return DateTimeFormatter.ISO_INSTANT.format(instant);
    }

    default boolean isOwner(ReviewEntity entity, UUID currentUserId) {
        if (currentUserId == null) return false;
        return entity.getUser().getId().equals(currentUserId);
    }
}

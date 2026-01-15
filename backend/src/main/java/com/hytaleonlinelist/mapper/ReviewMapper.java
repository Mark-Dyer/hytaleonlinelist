package com.hytaleonlinelist.mapper;

import com.hytaleonlinelist.domain.entity.ReviewEntity;
import com.hytaleonlinelist.dto.response.ReviewResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.Instant;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ReviewMapper {

    @Mapping(target = "id", expression = "java(entity.getId().toString())")
    @Mapping(target = "serverId", expression = "java(entity.getServer().getId().toString())")
    @Mapping(target = "createdAt", expression = "java(formatInstant(entity.getCreatedAt()))")
    @Mapping(target = "user", source = "user")
    ReviewResponse toResponse(ReviewEntity entity);

    default String formatInstant(Instant instant) {
        if (instant == null) return null;
        return DateTimeFormatter.ISO_INSTANT.format(instant);
    }
}

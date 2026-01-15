package com.hytaleonlinelist.mapper;

import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.ServerTagEntity;
import com.hytaleonlinelist.dto.response.CategoryResponse;
import com.hytaleonlinelist.dto.response.ServerResponse;
import com.hytaleonlinelist.dto.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface ServerMapper {

    @Mapping(target = "id", expression = "java(entity.getId().toString())")
    @Mapping(target = "tags", expression = "java(mapTags(entity.getTags()))")
    @Mapping(target = "createdAt", expression = "java(formatInstant(entity.getCreatedAt()))")
    @Mapping(target = "lastPingedAt", expression = "java(formatInstant(entity.getLastPingedAt()))")
    @Mapping(target = "category", expression = "java(mapCategory(entity))")
    @Mapping(target = "owner", source = "owner")
    @Mapping(target = "isOnline", source = "isOnline")
    @Mapping(target = "isFeatured", source = "isFeatured")
    @Mapping(target = "isVerified", source = "isVerified")
    ServerResponse toResponse(ServerEntity entity);

    default CategoryResponse mapCategory(ServerEntity entity) {
        if (entity.getCategory() == null) return null;
        var category = entity.getCategory();
        int serverCount = category.getServers() != null ? category.getServers().size() : 0;
        return new CategoryResponse(
            category.getId().toString(),
            category.getName(),
            category.getSlug(),
            category.getDescription(),
            category.getIcon(),
            serverCount
        );
    }

    default List<String> mapTags(List<ServerTagEntity> tags) {
        if (tags == null) return List.of();
        return tags.stream()
                .map(ServerTagEntity::getTag)
                .toList();
    }

    default String formatInstant(Instant instant) {
        if (instant == null) return null;
        return DateTimeFormatter.ISO_INSTANT.format(instant);
    }
}

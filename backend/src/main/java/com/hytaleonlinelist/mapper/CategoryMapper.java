package com.hytaleonlinelist.mapper;

import com.hytaleonlinelist.domain.entity.CategoryEntity;
import com.hytaleonlinelist.dto.response.CategoryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", expression = "java(entity.getId().toString())")
    @Mapping(target = "serverCount", expression = "java(entity.getServers() != null ? entity.getServers().size() : 0)")
    CategoryResponse toResponse(CategoryEntity entity);

    @Mapping(target = "id", expression = "java(entity.getId().toString())")
    @Mapping(target = "serverCount", source = "serverCount")
    CategoryResponse toResponseWithCount(CategoryEntity entity, int serverCount);
}

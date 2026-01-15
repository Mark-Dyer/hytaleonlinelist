package com.hytaleonlinelist.mapper;

import com.hytaleonlinelist.domain.entity.UserEntity;
import com.hytaleonlinelist.dto.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", expression = "java(entity.getId().toString())")
    UserResponse toResponse(UserEntity entity);
}

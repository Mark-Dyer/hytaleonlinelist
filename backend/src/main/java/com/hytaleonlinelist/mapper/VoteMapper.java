package com.hytaleonlinelist.mapper;

import com.hytaleonlinelist.domain.entity.VoteEntity;
import com.hytaleonlinelist.dto.response.VoteResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.Instant;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface VoteMapper {

    @Mapping(target = "id", expression = "java(entity.getId().toString())")
    @Mapping(target = "serverId", expression = "java(entity.getServer().getId().toString())")
    @Mapping(target = "userId", expression = "java(entity.getUser().getId().toString())")
    @Mapping(target = "votedAt", expression = "java(formatInstant(entity.getVotedAt()))")
    VoteResponse toResponse(VoteEntity entity);

    default String formatInstant(Instant instant) {
        if (instant == null) return null;
        return DateTimeFormatter.ISO_INSTANT.format(instant);
    }
}

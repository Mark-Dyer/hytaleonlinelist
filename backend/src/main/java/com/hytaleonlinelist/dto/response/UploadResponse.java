package com.hytaleonlinelist.dto.response;

public record UploadResponse(
    String url,
    String key,
    long size
) {}

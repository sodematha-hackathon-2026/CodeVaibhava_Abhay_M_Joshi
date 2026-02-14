package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ArtefactDto {

    public record ArtefactPublic(
            String id,
            String title,
            String category,
            String type,
            String description,
            String url,
            String thumbnailUrl,
            boolean active,
            String createdAt
    ) {}

    //admin
    public record ArtefactAdmin(
            String id,
            String title,
            String category,
            String type,
            String description,
            String url,
            String thumbnailUrl,
            boolean active,
            String createdAt
    ) {}

    public record Upsert(
            @NotBlank String title,
            @NotBlank String category,
            @NotBlank String type, // "PDF" or "AUDIO"
            String description,
            @NotBlank String url,
            String thumbnailUrl,
            @NotNull Boolean active
    ) {}
}

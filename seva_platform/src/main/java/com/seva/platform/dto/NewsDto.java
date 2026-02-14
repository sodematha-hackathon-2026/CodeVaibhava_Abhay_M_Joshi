package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class NewsDto {

    public record NewsAdmin(
            String id,
            String title,
            String imageUrl,
            String body,
            boolean active,
            String createdAt
    ) {}

    public record Upsert(
            @NotBlank String title,
            @NotBlank String imageUrl,
            String body,
            @NotNull Boolean active
    ) {}
}

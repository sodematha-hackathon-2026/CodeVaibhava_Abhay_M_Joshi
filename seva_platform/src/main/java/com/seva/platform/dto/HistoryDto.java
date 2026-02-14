package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class HistoryDto {

    public record PublicItem(
            String id,
            String title,
            String subtitle,
            String period,
            String description,
            String imageUrl,
            int sortOrder
    ) {}

    public record AdminItem(
            String id,
            String title,
            String subtitle,
            String period,
            String description,
            String imageUrl,
            int sortOrder,
            boolean active,
            String createdAt
    ) {}

    public record Upsert(
            @NotBlank String title,
            String subtitle,
            String period,
            String description,
            String imageUrl,
            @NotNull Integer sortOrder,
            @NotNull Boolean active
    ) {}
}

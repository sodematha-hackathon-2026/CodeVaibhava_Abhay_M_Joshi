package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SevaAdminDto {

    public record SevaAdmin(
            String id,
            String title,
            String description,
            int amountInPaise,
            boolean active,
            String createdAt,
            String updatedAt
    ) {}

    public record Upsert(
            @NotBlank String title,
            String description,
            @NotNull Integer amountInPaise,
            @NotNull Boolean active
    ) {}
}

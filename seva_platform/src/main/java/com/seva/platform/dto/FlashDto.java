package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FlashDto {

    public record FlashAdmin(
            String id,
            String text,
            boolean active,
            String createdAt
    ) {}

    public record Upsert(
            @NotBlank String text,
            @NotNull Boolean active
    ) {}
}

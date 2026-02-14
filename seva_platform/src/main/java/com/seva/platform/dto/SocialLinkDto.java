package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SocialLinkDto {

    public record AdminItem(
            String id,
            String platform,
            String url,
            boolean active,
            String createdAt
    ) {}

    public record Upsert(
            @NotBlank String platform,
            @NotBlank String url,
            @NotNull Boolean active
    ) {}
}

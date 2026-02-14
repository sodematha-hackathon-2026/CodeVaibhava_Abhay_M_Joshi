package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;

public record SocialLinkRequest(
        @NotBlank String platform,
        @NotBlank String url,
        boolean active
) {}
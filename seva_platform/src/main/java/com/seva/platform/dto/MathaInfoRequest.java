package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;

public record MathaInfoRequest(
        @NotBlank String morningDarshan,
        @NotBlank String morningPrasada,
        @NotBlank String eveningDarshan,
        @NotBlank String eveningPrasada
) {}
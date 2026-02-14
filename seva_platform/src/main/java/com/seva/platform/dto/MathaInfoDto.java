package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;

public class MathaInfoDto {

    public record AdminItem(
            String id,
            String morningDarshan,
            String morningPrasada,
            String eveningDarshan,
            String eveningPrasada,
            String updatedAt
    ) {}

    public record UpdateRequest(
            @NotBlank String morningDarshan,
            @NotBlank String morningPrasada,
            @NotBlank String eveningDarshan,
            @NotBlank String eveningPrasada
    ) {}
}

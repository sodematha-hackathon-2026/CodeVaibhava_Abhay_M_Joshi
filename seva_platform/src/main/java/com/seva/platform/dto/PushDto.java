package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PushDto {
    public record RegisterRequest(@NotBlank String token, @NotNull Boolean enabled) {}
}

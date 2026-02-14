package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;

public class AdminUserDto {
    public record PromoteRequest(@NotBlank String uid) {}
    public record DemoteRequest(@NotBlank String uid) {}
    public record AdminActionResponse(String uid, String role) {}
}

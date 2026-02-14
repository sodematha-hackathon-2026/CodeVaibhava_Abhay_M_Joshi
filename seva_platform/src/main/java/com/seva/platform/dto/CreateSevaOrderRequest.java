package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateSevaOrderRequest(
        @NotBlank String sevaId,
        @NotNull Boolean consentToStore,
        String fullName,
        String mobile,
        String email,
        String addressLine1,
        String addressLine2,
        String city,
        String state,
        String pincode
) {}

package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;

public record RazorpayVerifySevaRequest(
        @NotBlank String sevaOrderId,
        @NotBlank String razorpayPaymentId,
        @NotBlank String razorpaySignature
) {}

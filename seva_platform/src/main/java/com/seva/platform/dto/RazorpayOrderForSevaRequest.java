package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;

public record RazorpayOrderForSevaRequest(
        @NotBlank String sevaOrderId
) {}

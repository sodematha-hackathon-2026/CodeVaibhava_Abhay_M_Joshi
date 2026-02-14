package com.seva.platform.dto;

public record SevaOrderResponse(
        String id,
        String sevaTitle,
        int amountInPaise,
        String status
) {}

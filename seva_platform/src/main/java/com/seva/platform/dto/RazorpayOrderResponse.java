package com.seva.platform.dto;

public record RazorpayOrderResponse(
        String keyId,
        String razorpayOrderId,
        int amount,
        String currency
) {}

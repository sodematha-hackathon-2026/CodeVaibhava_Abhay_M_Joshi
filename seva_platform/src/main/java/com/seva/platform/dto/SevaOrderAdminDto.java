package com.seva.platform.dto;

public class SevaOrderAdminDto {

    public record OrderSummary(
            String id,
            String uid,
            String sevaId,
            String sevaTitle,
            int amountInPaise,
            String status,
            boolean consentToStore,
            String razorpayOrderId,
            String razorpayPaymentId,
            String createdAt,
            String updatedAt
    ) {}

    public record OrderDetail(
            String id,
            String uid,
            String sevaId,
            String sevaTitle,
            int amountInPaise,
            String status,
            boolean consentToStore,

            String fullName,
            String mobile,
            String email,
            String addressLine1,
            String addressLine2,
            String city,
            String state,
            String pincode,

            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature,

            String createdAt,
            String updatedAt
    ) {}
}

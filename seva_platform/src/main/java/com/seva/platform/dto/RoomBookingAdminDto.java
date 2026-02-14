package com.seva.platform.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class RoomBookingAdminDto {

    public record Summary(
            String id,
            String nameOrMasked,
            String mobile,
            LocalDate checkInDate,
            int peopleCount,
            boolean consentToStore,
            String status,
            String createdAt
    ) {}

    public record Detail(
            String id,
            String nameOrMasked,
            String mobile,
            String emailOrMasked,
            int peopleCount,
            LocalDate checkInDate,
            String notesOrMasked,
            boolean consentToStore,
            String status,
            String createdAt
    ) {}

    public record UpdateStatusRequest(
            @NotNull String status // NEW | EMAIL_SENT | EMAIL_FAILED
    ) {}

    public record ActionResponse(
            String bookingId,
            String status
    ) {}
}

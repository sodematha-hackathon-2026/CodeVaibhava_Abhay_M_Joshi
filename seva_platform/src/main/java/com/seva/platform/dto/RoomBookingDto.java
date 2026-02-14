package com.seva.platform.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class RoomBookingDto {

    public record CreateRequest(
            @NotBlank String name,

            @NotBlank
            @Pattern(regexp = "^\\+?\\d{10,15}$", message = "Invalid mobile")
            String mobile,

            @Email String email,

            @Min(1) @Max(20)
            int peopleCount,

            @NotNull
            LocalDate checkInDate,

            String notes,

            @NotNull
            Boolean consentToStore
    ) {}

    public record CreateResponse(
            String bookingId,
            String status
    ) {}
}

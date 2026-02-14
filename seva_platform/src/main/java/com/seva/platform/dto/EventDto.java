package com.seva.platform.dto;


import com.seva.platform.model.EventScope;
import com.seva.platform.model.EventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class EventDto {
    public record CreateOrUpdate(
            @NotBlank String title,
            String description,
            @NotNull LocalDate eventDate,
            String location,
            String imageUrl,
            @NotNull EventType type,
            @NotNull EventScope scope,
            @NotNull Boolean notifyUsers,
            String tithiLabel,
            @NotNull Boolean active
    ) {}
}

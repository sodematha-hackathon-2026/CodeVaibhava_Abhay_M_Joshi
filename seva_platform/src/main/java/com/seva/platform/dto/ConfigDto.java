package com.seva.platform.dto;

import jakarta.validation.constraints.NotNull;

public class ConfigDto {

    public record PublicConfig(
            boolean enableEvents,
            boolean enableGallery,
            boolean enableArtefacts,
            boolean enableHistory,
            boolean enableRoomBooking,
            boolean enableSeva,
            boolean enableQuiz
    ) {}

    public record AdminConfig(
            Integer id,
            boolean enableEvents,
            boolean enableGallery,
            boolean enableArtefacts,
            boolean enableHistory,
            boolean enableRoomBooking,
            boolean enableSeva,
            boolean enableQuiz
    ) {}

    public record UpdateRequest(
            @NotNull Boolean enableEvents,
            @NotNull Boolean enableGallery,
            @NotNull Boolean enableArtefacts,
            @NotNull Boolean enableHistory,
            @NotNull Boolean enableRoomBooking,
            @NotNull Boolean enableSeva,
            @NotNull Boolean enableQuiz
    ) {}
}

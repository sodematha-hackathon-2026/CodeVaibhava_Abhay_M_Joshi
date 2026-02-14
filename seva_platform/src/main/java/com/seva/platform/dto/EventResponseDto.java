package com.seva.platform.dto;


import com.seva.platform.model.Event;

public record EventResponseDto(
        String id,
        String title,
        String description,
        String date,
        String weekday,
        String tithi,
        String type,
        String scope,
        String location,
        boolean notifyUsers,
        String imageUrl
) {
    public static EventResponseDto from(Event e, String weekday, String tithi) {
        return new EventResponseDto(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getEventDate().toString(),
                weekday,
                tithi,
                e.getLocation(),
                e.getType().name(),
                e.getScope().name(),
                e.isNotifyUsers(),
                e.getImageUrl()
        );
    }
}

package com.seva.platform.controller;

import com.seva.platform.dto.EventResponseDto;
import com.seva.platform.model.EventScope;
import com.seva.platform.model.EventType;
import com.seva.platform.service.EventService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService service;

    public EventController(EventService service) {
        this.service = service;
    }

    @GetMapping
    public List<EventResponseDto> list(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to,
            @RequestParam(required = false) EventType type,
            @RequestParam(required = false) EventScope scope
    ) {
        return service.listPublic(from, to, type, scope);
    }
}

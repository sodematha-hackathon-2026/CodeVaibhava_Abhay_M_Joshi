package com.seva.platform.controller.admin;

import com.seva.platform.dto.EventDto;
import com.seva.platform.model.Event;
import com.seva.platform.service.EventService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events")
public class AdminEventController {

    private final EventService service;

    public AdminEventController(EventService service) {
        this.service = service;
    }

    @GetMapping
    public List<Event> list() {
        return service.listAdmin();
    }


    @PostMapping
    public Event create(@Valid @RequestBody EventDto.CreateOrUpdate req) {
        return service.create(req);
    }


    @PutMapping("/{id}")
    public Event update(@PathVariable String id,
                        @Valid @RequestBody EventDto.CreateOrUpdate req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}

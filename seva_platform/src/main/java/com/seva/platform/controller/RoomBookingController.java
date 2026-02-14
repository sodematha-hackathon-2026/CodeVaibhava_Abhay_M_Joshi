package com.seva.platform.controller;


import com.seva.platform.dto.RoomBookingDto;
import com.seva.platform.service.RoomBookingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/room-bookings")
public class RoomBookingController {

    private final RoomBookingService service;

    public RoomBookingController(RoomBookingService service) {
        this.service = service;
    }

    @PostMapping
    public RoomBookingDto.CreateResponse create(@Valid @RequestBody RoomBookingDto.CreateRequest req) {
        return service.create(req);
    }
}

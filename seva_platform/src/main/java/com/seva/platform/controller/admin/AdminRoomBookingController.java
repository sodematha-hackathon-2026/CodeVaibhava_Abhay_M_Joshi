package com.seva.platform.controller.admin;

import com.seva.platform.dto.RoomBookingAdminDto;
import com.seva.platform.service.admin.RoomBookingAdminService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/room-bookings")
public class AdminRoomBookingController {

    private final RoomBookingAdminService service;

    public AdminRoomBookingController(RoomBookingAdminService service) {
        this.service = service;
    }

    @GetMapping
    public List<RoomBookingAdminDto.Summary> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to
    ) {
        return service.list(status, from, to);
    }

    @GetMapping("/{id}")
    public RoomBookingAdminDto.Detail get(@PathVariable String id) {
        return service.get(id);
    }

    @PutMapping("/{id}/status")
    public RoomBookingAdminDto.ActionResponse updateStatus(
            @PathVariable String id,
            @Valid @RequestBody RoomBookingAdminDto.UpdateStatusRequest req
    ) {
        return service.updateStatus(id, req);
    }

    @PostMapping("/{id}/resend-email")
    public RoomBookingAdminDto.ActionResponse resendEmail(@PathVariable String id) {
        return service.resendEmail(id);
    }
}

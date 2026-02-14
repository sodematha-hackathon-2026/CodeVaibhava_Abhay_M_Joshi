package com.seva.platform.controller.admin;

import com.seva.platform.dto.SevaOrderAdminDto;
import com.seva.platform.service.admin.SevaOrderAdminService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/seva-orders")
public class AdminSevaOrderController {

    private final SevaOrderAdminService service;

    public AdminSevaOrderController(SevaOrderAdminService service) {
        this.service = service;
    }

    @GetMapping
    public List<SevaOrderAdminDto.OrderSummary> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to
    ) {
        return service.list(status, from, to);
    }

    @GetMapping("/{id}")
    public SevaOrderAdminDto.OrderDetail get(@PathVariable String id) {
        return service.get(id);
    }
}

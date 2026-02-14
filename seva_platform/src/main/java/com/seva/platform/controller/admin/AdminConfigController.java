package com.seva.platform.controller.admin;

import com.seva.platform.dto.ConfigDto;
import com.seva.platform.service.ConfigService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/config")
public class AdminConfigController {

    private final ConfigService service;

    public AdminConfigController(ConfigService service) {
        this.service = service;
    }

    @GetMapping
    public ConfigDto.AdminConfig get() {
        return service.getAdmin();
    }

    @PutMapping
    public ConfigDto.PublicConfig update(@Valid @RequestBody ConfigDto.UpdateRequest req) {
        return service.update(req);
    }
}

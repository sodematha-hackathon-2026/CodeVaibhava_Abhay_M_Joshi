package com.seva.platform.controller;


import com.seva.platform.dto.ConfigDto;
import com.seva.platform.service.ConfigService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    private final ConfigService service;

    public ConfigController(ConfigService service) {
        this.service = service;
    }

    @GetMapping
    public ConfigDto.PublicConfig get() {
        return service.getPublic();
    }
}

package com.seva.platform.controller;

import com.seva.platform.dto.LegalDto;
import com.seva.platform.service.LegalService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/legal")
public class LegalController {

    private final LegalService service;

    public LegalController(LegalService service) {
        this.service = service;
    }

    @GetMapping
    public LegalDto.PublicLegal get() {
        return service.getPublic();
    }
}

package com.seva.platform.controller;


import com.seva.platform.dto.ArtefactDto;
import com.seva.platform.service.ArtefactService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artefacts")
public class ArtefactController {

    private final ArtefactService service;

    public ArtefactController(ArtefactService service) {
        this.service = service;
    }

    @GetMapping
    public List<ArtefactDto.ArtefactPublic> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type
    ) {
        return service.list(category, type);
    }
}

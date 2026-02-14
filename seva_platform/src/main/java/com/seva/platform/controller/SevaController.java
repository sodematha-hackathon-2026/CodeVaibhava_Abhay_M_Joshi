package com.seva.platform.controller;

import com.seva.platform.model.Seva;
import com.seva.platform.service.SevaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sevas")
public class SevaController {
    private final SevaService service;
    public SevaController(SevaService service){ this.service = service; }

    @GetMapping
    public List<Seva> active() {
        return service.listActiveSevas();
    }
}

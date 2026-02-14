package com.seva.platform.controller;

import com.seva.platform.dto.HistoryDto;
import com.seva.platform.service.HistoryService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryService service;

    public HistoryController(HistoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<HistoryDto.PublicItem> list() {
        return service.publicList();
    }
}

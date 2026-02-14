package com.seva.platform.controller;

import com.seva.platform.model.FlashUpdate;
import com.seva.platform.service.FlashService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/flash")
public class FlashController {

    private final FlashService flashService;

    public FlashController(FlashService flashService) {
        this.flashService = flashService;
    }

    @GetMapping
    public List<FlashUpdate> active() {
        return flashService.getActiveFlashUpdates();
    }
}
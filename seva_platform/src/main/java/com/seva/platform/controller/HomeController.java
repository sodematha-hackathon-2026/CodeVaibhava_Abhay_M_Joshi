package com.seva.platform.controller;

import com.seva.platform.dto.HomeResponse;
import com.seva.platform.service.HomeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    private final HomeService service;

    public HomeController(HomeService service) {
        this.service = service;
    }

    @GetMapping
    public HomeResponse home() {
        return service.getHomeData();
    }
}
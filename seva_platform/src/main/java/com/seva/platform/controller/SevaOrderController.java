package com.seva.platform.controller;

import com.seva.platform.dto.CreateSevaOrderRequest;
import com.seva.platform.dto.SevaOrderResponse;
import com.seva.platform.security.AuthUser;
import com.seva.platform.service.SevaOrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seva-orders")
public class SevaOrderController {
    private final SevaOrderService service;
    public SevaOrderController(SevaOrderService service){ this.service = service; }

    @PostMapping
    public SevaOrderResponse create(Authentication auth, @Valid @RequestBody CreateSevaOrderRequest req) {
        if (auth == null || !(auth.getPrincipal() instanceof AuthUser u))
            throw new RuntimeException("Unauthorized");
        return service.create(u.uid(), req);
    }
}

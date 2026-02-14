package com.seva.platform.controller;

import com.seva.platform.dto.PushDto;
import com.seva.platform.security.AuthUser;
import com.seva.platform.service.PushTokenService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/push")
public class PushController {

    private final PushTokenService service;

    public PushController(PushTokenService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public void register(
            @AuthenticationPrincipal AuthUser user,
            @Valid @RequestBody PushDto.RegisterRequest req
    ) {
        if (user == null) {
            throw new RuntimeException("Unauthorized");
        }

        service.register(user.uid(), req);
    }
}
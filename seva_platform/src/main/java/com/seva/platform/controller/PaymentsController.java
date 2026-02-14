package com.seva.platform.controller;

import com.seva.platform.dto.*;
import com.seva.platform.security.AuthUser;
import com.seva.platform.service.SevaPaymentService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments/razorpay")
public class PaymentsController {

    private final SevaPaymentService service;

    public PaymentsController(SevaPaymentService service) {
        this.service = service;
    }

    @PostMapping("/order-for-seva")
    public RazorpayOrderResponse orderForSeva(Authentication auth, @Valid @RequestBody RazorpayOrderForSevaRequest req) throws Exception {
        if (auth == null || !(auth.getPrincipal() instanceof AuthUser u))
            throw new RuntimeException("Unauthorized");
        return service.createRazorpayOrderForSeva(u.uid(), req);
    }

    @PostMapping("/verify-seva")
    public RazorpayVerifyResponse verifySeva(Authentication auth, @Valid @RequestBody RazorpayVerifySevaRequest req) {
        if (auth == null || !(auth.getPrincipal() instanceof AuthUser u))
            throw new RuntimeException("Unauthorized");
        return service.verifySevaPayment(u.uid(), req);
    }
}

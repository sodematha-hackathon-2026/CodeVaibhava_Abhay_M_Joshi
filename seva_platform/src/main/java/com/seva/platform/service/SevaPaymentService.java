package com.seva.platform.service;

import com.seva.platform.dto.*;
import com.seva.platform.model.SevaOrder;
import com.seva.platform.repository.SevaOrderRepository;
import org.springframework.stereotype.Service;

@Service
public class SevaPaymentService {

    private final RazorpayService razorpay;
    private final SevaOrderRepository orders;

    public SevaPaymentService(RazorpayService razorpay, SevaOrderRepository orders) {
        this.razorpay = razorpay;
        this.orders = orders;
    }

    public RazorpayOrderResponse createRazorpayOrderForSeva(String uid, RazorpayOrderForSevaRequest req) throws Exception {
        SevaOrder o = orders.findById(req.sevaOrderId()).orElseThrow();
        if (!o.getUid().equals(uid)) throw new RuntimeException("Forbidden");
        if (!"INITIATED".equals(o.getStatus())) throw new RuntimeException("Order not payable: " + o.getStatus());

        String shortId = o.getId().replace("-", "").substring(0, 32);
        var receipt = "s_" + shortId;

        var created = razorpay.createOrder(o.getAmountInPaise(), receipt);

        o.setRazorpayOrderId(created.orderId());
        orders.save(o);

        return new RazorpayOrderResponse(razorpay.getKeyId(), created.orderId(), created.amount(), created.currency());
    }

    public RazorpayVerifyResponse verifySevaPayment(String uid, RazorpayVerifySevaRequest req) {
        SevaOrder o = orders.findById(req.sevaOrderId()).orElseThrow();
        if (!o.getUid().equals(uid)) throw new RuntimeException("Forbidden");
        if (o.getRazorpayOrderId() == null || o.getRazorpayOrderId().isBlank())
            throw new RuntimeException("Razorpay order not created");

        boolean ok = razorpay.verifySignature(o.getRazorpayOrderId(), req.razorpayPaymentId(), req.razorpaySignature());
        if (ok) {
            o.setStatus("PAID");
            o.setRazorpayPaymentId(req.razorpayPaymentId());
            o.setRazorpaySignature(req.razorpaySignature());
            orders.save(o);
        }
        return new RazorpayVerifyResponse(ok);
    }
}
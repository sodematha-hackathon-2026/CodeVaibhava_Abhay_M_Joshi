package com.seva.platform.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    private final RazorpayClient client;
    private final String keyId;
    private final String keySecret;

    public RazorpayService(
            @Value("${app.razorpay.keyId}") String keyId,
            @Value("${app.razorpay.keySecret}") String keySecret
    ) throws Exception {
        this.client = new RazorpayClient(keyId, keySecret);
        this.keyId = keyId;
        this.keySecret = keySecret;
    }

    public String getKeyId() { return keyId; }

    public record OrderCreated(String orderId, int amount, String currency) {}

    public OrderCreated createOrder(int amountInPaise, String receipt) throws Exception {
        JSONObject options = new JSONObject();
        options.put("amount", amountInPaise);
        options.put("currency", "INR");
        options.put("receipt", receipt);
        options.put("payment_capture", 1);

        Order order = client.orders.create(options);
        return new OrderCreated(order.get("id"), amountInPaise, "INR");
    }

    public boolean verifySignature(String orderId, String paymentId, String signature) {
        String payload = orderId + "|" + paymentId;
        String expected = HmacUtil.sha256Hex(payload, keySecret);
        return expected.equals(signature);
    }
}

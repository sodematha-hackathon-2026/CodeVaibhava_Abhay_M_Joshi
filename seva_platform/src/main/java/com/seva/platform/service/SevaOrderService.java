package com.seva.platform.service;

import com.seva.platform.dto.CreateSevaOrderRequest;
import com.seva.platform.dto.SevaOrderResponse;
import com.seva.platform.model.Seva;
import com.seva.platform.model.SevaOrder;
import com.seva.platform.repository.SevaOrderRepository;
import com.seva.platform.repository.SevaRepository;
import org.springframework.stereotype.Service;

@Service
public class SevaOrderService {

    private final SevaRepository sevaRepo;
    private final SevaOrderRepository orderRepo;

    public SevaOrderService(SevaRepository sevaRepo, SevaOrderRepository orderRepo){
        this.sevaRepo = sevaRepo;
        this.orderRepo = orderRepo;
    }

    public SevaOrderResponse create(String uid, CreateSevaOrderRequest req) {
        Seva seva = sevaRepo.findById(req.sevaId()).orElseThrow();

        SevaOrder o = SevaOrder.builder()
                .uid(uid)
                .sevaId(seva.getId())
                .sevaTitle(seva.getTitle())
                .amountInPaise(seva.getAmountInPaise())
                .status("INITIATED")
                .consentToStore(Boolean.TRUE.equals(req.consentToStore()))
                .mobile(req.mobile())
                .build();

        if (Boolean.TRUE.equals(req.consentToStore())) {
            o.setFullName(req.fullName());
            o.setEmail(req.email());
            o.setAddressLine1(req.addressLine1());
            o.setAddressLine2(req.addressLine2());
            o.setCity(req.city());
            o.setState(req.state());
            o.setPincode(req.pincode());
        }

        SevaOrder saved = orderRepo.save(o);

        return new SevaOrderResponse(saved.getId(), saved.getSevaTitle(), saved.getAmountInPaise(), saved.getStatus());
    }
}

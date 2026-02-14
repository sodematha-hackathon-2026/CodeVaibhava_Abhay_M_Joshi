package com.seva.platform.service.admin;

import com.seva.platform.dto.SevaOrderAdminDto;
import com.seva.platform.model.SevaOrder;
import com.seva.platform.repository.SevaOrderRepository;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;

@Service
public class SevaOrderAdminService {

    private final SevaOrderRepository repo;

    public SevaOrderAdminService(SevaOrderRepository repo) {
        this.repo = repo;
    }

    public List<SevaOrderAdminDto.OrderSummary> list(String status, LocalDate from, LocalDate to) {
        List<SevaOrder> items;

        Instant fromI = null;
        Instant toI = null;

        if (from != null && to != null) {
            fromI = from.atStartOfDay(ZoneId.systemDefault()).toInstant();
            // include end day fully
            toI = to.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        }

        if (status != null && !status.isBlank() && fromI != null) {
            items = repo.findByStatusAndCreatedAtBetweenOrderByCreatedAtDesc(status.trim(), fromI, toI);
        } else if (status != null && !status.isBlank()) {
            items = repo.findByStatusOrderByCreatedAtDesc(status.trim());
        } else if (fromI != null) {
            items = repo.findByCreatedAtBetweenOrderByCreatedAtDesc(fromI, toI);
        } else {
            items = repo.findAllByOrderByCreatedAtDesc();
        }

        return items.stream().map(this::toSummary).toList();
    }

    public SevaOrderAdminDto.OrderDetail get(String id) {
        SevaOrder o = repo.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        return toDetail(o);
    }

    private SevaOrderAdminDto.OrderSummary toSummary(SevaOrder o) {
        return new SevaOrderAdminDto.OrderSummary(
                o.getId(),
                o.getUid(),
                o.getSevaId(),
                o.getSevaTitle(),
                o.getAmountInPaise(),
                o.getStatus(),
                o.isConsentToStore(),
                o.getRazorpayOrderId(),
                o.getRazorpayPaymentId(),
                o.getCreatedAt() == null ? null : o.getCreatedAt().toString(),
                o.getUpdatedAt() == null ? null : o.getUpdatedAt().toString()
        );
    }

    private SevaOrderAdminDto.OrderDetail toDetail(SevaOrder o) {
        return new SevaOrderAdminDto.OrderDetail(
                o.getId(),
                o.getUid(),
                o.getSevaId(),
                o.getSevaTitle(),
                o.getAmountInPaise(),
                o.getStatus(),
                o.isConsentToStore(),

                o.getFullName(),
                o.getMobile(),
                o.getEmail(),
                o.getAddressLine1(),
                o.getAddressLine2(),
                o.getCity(),
                o.getState(),
                o.getPincode(),

                o.getRazorpayOrderId(),
                o.getRazorpayPaymentId(),
                o.getRazorpaySignature(),

                o.getCreatedAt() == null ? null : o.getCreatedAt().toString(),
                o.getUpdatedAt() == null ? null : o.getUpdatedAt().toString()
        );
    }
}

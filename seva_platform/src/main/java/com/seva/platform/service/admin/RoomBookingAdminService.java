package com.seva.platform.service.admin;

import com.seva.platform.dto.RoomBookingAdminDto;
import com.seva.platform.model.RoomBooking;
import com.seva.platform.repository.RoomBookingRepository;
import com.seva.platform.service.RoomBookingMailService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.List;

@Service
public class RoomBookingAdminService {

    private final RoomBookingRepository repo;
    private final RoomBookingMailService mailService;

    public RoomBookingAdminService(RoomBookingRepository repo, RoomBookingMailService mailService) {
        this.repo = repo;
        this.mailService = mailService;
    }

    public List<RoomBookingAdminDto.Summary> list(String status, LocalDate from, LocalDate to) {
        List<RoomBooking> items;

        RoomBooking.Status st = parseStatusOrNull(status);

        if (from != null && to != null && st != null) {
            items = repo.findByStatusAndCheckInDateBetweenOrderByCheckInDateAsc(st, from, to);
        } else if (from != null && to != null) {
            items = repo.findByCheckInDateBetweenOrderByCheckInDateAsc(from, to);
        } else if (st != null) {
            items = repo.findByStatusOrderByCreatedAtDesc(st);
        } else {
            items = repo.findAllByOrderByCreatedAtDesc();
        }

        return items.stream().map(this::toSummary).toList();
    }

    public RoomBookingAdminDto.Detail get(String id) {
        RoomBooking b = repo.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        return toDetail(b);
    }

    @Transactional
    public RoomBookingAdminDto.ActionResponse updateStatus(String id, RoomBookingAdminDto.UpdateStatusRequest req) {
        RoomBooking b = repo.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        RoomBooking.Status st = parseStatus(req.status());
        b.setStatus(st);
        repo.save(b);
        return new RoomBookingAdminDto.ActionResponse(b.getId(), b.getStatus().name());
    }

    @Transactional
    public RoomBookingAdminDto.ActionResponse resendEmail(String id) {
        RoomBooking b = repo.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));

        try {
            mailService.sendNewBookingEmail(b);
            b.setStatus(RoomBooking.Status.EMAIL_SENT);
            repo.save(b);
            return new RoomBookingAdminDto.ActionResponse(b.getId(), b.getStatus().name());
        } catch (Exception e) {
            b.setStatus(RoomBooking.Status.EMAIL_FAILED);
            repo.save(b);
            return new RoomBookingAdminDto.ActionResponse(b.getId(), b.getStatus().name());
        }
    }

    private RoomBookingAdminDto.Summary toSummary(RoomBooking b) {
        boolean consent = b.isConsentToStore();
        return new RoomBookingAdminDto.Summary(
                b.getId(),
                consent ? safe(b.getName()) : "(no consent)",
                safe(b.getMobile()),
                b.getCheckInDate(),
                b.getPeopleCount(),
                consent,
                b.getStatus().name(),
                b.getCreatedAt() == null ? null : b.getCreatedAt().toString()
        );
    }

    private RoomBookingAdminDto.Detail toDetail(RoomBooking b) {
        boolean consent = b.isConsentToStore();

        return new RoomBookingAdminDto.Detail(
                b.getId(),
                consent ? safe(b.getName()) : "(no consent)",
                safe(b.getMobile()),
                consent ? safe(b.getEmail()) : "(no consent)",
                b.getPeopleCount(),
                b.getCheckInDate(),
                consent ? safe(b.getNotes()) : "(no consent)",
                consent,
                b.getStatus().name(),
                b.getCreatedAt() == null ? null : b.getCreatedAt().toString()
        );
    }

    private static String safe(String s) {
        return (s == null || s.isBlank()) ? "-" : s;
    }

    private static RoomBooking.Status parseStatus(String s) {
        if (s == null) throw new RuntimeException("status is required");
        try {
            return RoomBooking.Status.valueOf(s.trim().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Invalid status: " + s + " (use NEW, EMAIL_SENT, EMAIL_FAILED)");
        }
    }

    private static RoomBooking.Status parseStatusOrNull(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return RoomBooking.Status.valueOf(s.trim().toUpperCase());
        } catch (Exception e) {
            return null;
        }
    }
}

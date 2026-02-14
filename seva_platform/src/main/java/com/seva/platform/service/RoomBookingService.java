package com.seva.platform.service;


import com.seva.platform.dto.RoomBookingDto;
import com.seva.platform.model.RoomBooking;

import com.seva.platform.repository.RoomBookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoomBookingService {

    private final RoomBookingRepository repo;
    private final RoomBookingMailService mailService;

    public RoomBookingService(RoomBookingRepository repo, RoomBookingMailService mailService) {
        this.repo = repo;
        this.mailService = mailService;
    }

    @Transactional
    public RoomBookingDto.CreateResponse create(RoomBookingDto.CreateRequest req) {

        RoomBooking b = RoomBooking.builder()
                .name(req.name())
                .mobile(req.mobile())
                .email(req.email())
                .peopleCount(req.peopleCount())
                .checkInDate(req.checkInDate())
                .notes(req.notes())
                .consentToStore(req.consentToStore())
                .status(RoomBooking.Status.NEW)
                .build();

        b = repo.save(b);

        try {
            mailService.sendNewBookingEmail(b);
            b.setStatus(RoomBooking.Status.EMAIL_SENT);
            repo.save(b);
            return new RoomBookingDto.CreateResponse(b.getId(), "EMAIL_SENT");
        } catch (Exception e) {
            b.setStatus(RoomBooking.Status.EMAIL_FAILED);
            repo.save(b);
            return new RoomBookingDto.CreateResponse(b.getId(), "EMAIL_FAILED");
        }
    }
}

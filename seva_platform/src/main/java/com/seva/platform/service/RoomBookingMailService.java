package com.seva.platform.service;


import com.seva.platform.model.RoomBooking;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class RoomBookingMailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.to}")
    private String mailTo;

    @Value("${app.mail.from}")
    private String mailFrom;

    public RoomBookingMailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendNewBookingEmail(RoomBooking b) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(mailTo);
        msg.setFrom(mailFrom);
        msg.setSubject("Room Booking Request - " + b.getId());

        String body =
                "New Room Booking Request\n\n" +
                        "Booking ID: " + b.getId() + "\n" +
                        "Status: " + b.getStatus() + "\n\n" +
                        "Name: " + safe(b.getName()) + "\n" +
                        "Mobile: " + safe(b.getMobile()) + "\n" +
                        "Email: " + safe(b.getEmail()) + "\n" +
                        "People Count: " + b.getPeopleCount() + "\n" +
                        "Check-in Date: " + b.getCheckInDate() + "\n" +
                        "Consent To Store: " + (b.isConsentToStore() ? "YES" : "NO") + "\n\n" +
                        "Notes:\n" + safe(b.getNotes()) + "\n\n" +
                        "— Sode Matha App (Hackathon)";

        msg.setText(body);
        mailSender.send(msg);
    }

    private String safe(String s) {
        return (s == null || s.isBlank()) ? "-" : s;
    }
}

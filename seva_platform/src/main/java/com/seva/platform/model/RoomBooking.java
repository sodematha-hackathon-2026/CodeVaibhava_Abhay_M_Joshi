package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "room_bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RoomBooking {

    public enum Status {
        NEW,
        EMAIL_SENT,
        EMAIL_FAILED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String mobile;

    private String email;

    @Column(nullable = false)
    private int peopleCount;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Column(columnDefinition = "text")
    private String notes;

    @Column(nullable = false)
    private boolean consentToStore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}

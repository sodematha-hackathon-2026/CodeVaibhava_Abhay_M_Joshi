package com.seva.platform.repository;


import com.seva.platform.model.RoomBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public interface RoomBookingRepository extends JpaRepository<RoomBooking, String> {
    List<RoomBooking> findAllByOrderByCreatedAtDesc();

    List<RoomBooking> findByStatusOrderByCreatedAtDesc(RoomBooking.Status status);

    List<RoomBooking> findByCheckInDateBetweenOrderByCheckInDateAsc(LocalDate from, LocalDate to);

    List<RoomBooking> findByStatusAndCheckInDateBetweenOrderByCheckInDateAsc(
            RoomBooking.Status status, LocalDate from, LocalDate to
    );

    List<RoomBooking> findByCreatedAtBetweenOrderByCreatedAtDesc(Instant from, Instant to);

    List<RoomBooking> findByStatusAndCreatedAtBetweenOrderByCreatedAtDesc(
            RoomBooking.Status status, Instant from, Instant to
    );
}

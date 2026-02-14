package com.seva.platform.repository;

import com.seva.platform.model.SevaOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface SevaOrderRepository extends JpaRepository<SevaOrder, String> {

    List<SevaOrder> findAllByOrderByCreatedAtDesc();

    List<SevaOrder> findByStatusOrderByCreatedAtDesc(String status);

    List<SevaOrder> findByCreatedAtBetweenOrderByCreatedAtDesc(Instant from, Instant to);

    List<SevaOrder> findByStatusAndCreatedAtBetweenOrderByCreatedAtDesc(String status, Instant from, Instant to);
}

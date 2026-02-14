package com.seva.platform.repository;

import com.seva.platform.model.Seva;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SevaRepository extends JpaRepository<Seva, String> {
    List<Seva> findByActiveTrueOrderByCreatedAtDesc();

    // Admin list
    List<Seva> findAllByOrderByUpdatedAtDesc();
}

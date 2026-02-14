package com.seva.platform.repository;

import com.seva.platform.model.FlashUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FlashRepo extends JpaRepository<FlashUpdate, String> {
    List<FlashUpdate> findByActiveTrueOrderByCreatedAtDesc();
}

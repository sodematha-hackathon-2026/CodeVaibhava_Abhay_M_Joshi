package com.seva.platform.repository;

import com.seva.platform.model.HistorySection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistoryRepository extends JpaRepository<HistorySection, String> {
    List<HistorySection> findByActiveTrueOrderBySortOrderAsc();
    List<HistorySection> findAllByOrderBySortOrderAsc();
}

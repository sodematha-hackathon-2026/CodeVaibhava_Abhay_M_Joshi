package com.seva.platform.repository;


import com.seva.platform.model.Event;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, String>, JpaSpecificationExecutor<Event> {
    default Sort sortByDateAsc() {
        return Sort.by(Sort.Direction.ASC, "eventDate");
    }

    // ADD THESE TWO METHODS:
    List<Event> findByEventDateAndActiveTrue(LocalDate date);
    
    List<Event> findByEventDateBetweenAndActiveTrue(LocalDate from, LocalDate to);
}

package com.seva.platform.repository;


import com.seva.platform.model.Event;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, String>, JpaSpecificationExecutor<Event> {
    default Sort sortByDateAsc() {
        return Sort.by(Sort.Direction.ASC, "eventDate");
    }
}

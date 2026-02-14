package com.seva.platform.service;

import com.seva.platform.dto.EventDto;
import com.seva.platform.dto.EventResponseDto;
import com.seva.platform.model.Event;
import com.seva.platform.model.EventScope;
import com.seva.platform.model.EventType;
import com.seva.platform.repository.EventRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
public class EventService {

    private final EventRepository repo;
    private final PushSendService pushSendService;

    public EventService(EventRepository repo, PushSendService pushSendService) {
        this.repo = repo;
        this.pushSendService = pushSendService;
    }

    public List<EventResponseDto> listPublic(LocalDate from, LocalDate to, EventType type, EventScope scope) {

        Specification<Event> spec = (root, q, cb) -> cb.isTrue(root.get("active"));

        if (from != null && to != null) {
            spec = spec.and((root, q, cb) -> cb.between(root.get("eventDate"), from, to));
        }
        if (type != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("type"), type));
        }
        if (scope != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("scope"), scope));
        }

        List<Event> events = repo.findAll(spec, repo.sortByDateAsc());

        return events.stream().map(e -> {
            DayOfWeek dow = DayOfWeek.from(e.getEventDate());
            String weekday = capitalize(dow.name());
            String tithi = (e.getTithiLabel() == null || e.getTithiLabel().isBlank())
                    ? "Tithi not published"
                    : e.getTithiLabel().trim();
            return EventResponseDto.from(e, weekday, tithi);
        }).toList();
    }

    public List<Event> listAdmin() {
        return repo.findAll(repo.sortByDateAsc());
    }

    public Event create(EventDto.CreateOrUpdate req) {
        Event e = Event.builder()
                .title(req.title())
                .description(req.description())
                .eventDate(req.eventDate())
                .location(req.location())
                .imageUrl(req.imageUrl())
                .type(req.type())
                .scope(req.scope())
                .notifyUsers(req.notifyUsers())
                .tithiLabel(req.tithiLabel())
                .active(req.active())
                .build();

        Event saved = repo.save(e);

        if (saved.isNotifyUsers()) {
            sendEventNotification(saved);
        }

        return saved;
    }

    public Event update(String id, EventDto.CreateOrUpdate req) {
        Event e = repo.findById(id).orElseThrow();

        e.setTitle(req.title());
        e.setDescription(req.description());
        e.setEventDate(req.eventDate());
        e.setLocation(req.location());
        e.setImageUrl(req.imageUrl());
        e.setType(req.type());
        e.setScope(req.scope());
        e.setNotifyUsers(req.notifyUsers());
        e.setTithiLabel(req.tithiLabel());
        e.setActive(req.active());

        Event saved = repo.save(e);

        if (saved.isNotifyUsers()) {
            sendEventNotification(saved);
        }

        return saved;
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

    private void sendEventNotification(Event event) {
        try {
            DayOfWeek dow = DayOfWeek.from(event.getEventDate());
            String weekday = capitalize(dow.name());
            String tithi = (event.getTithiLabel() == null || event.getTithiLabel().isBlank())
                    ? "Tithi not published"
                    : event.getTithiLabel().trim();

            String title = event.getType() + " Event";
            String body = event.getTitle() + " • " + weekday + " • " + tithi;

            pushSendService.sendToAllEnabled(title, body);
        } catch (Exception ex) {
            System.err.println("Failed to send push notification: " + ex.getMessage());
        }
    }

    private static String capitalize(String s) {
        if (s == null || s.isBlank()) return s;
        String lower = s.toLowerCase();
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }
}
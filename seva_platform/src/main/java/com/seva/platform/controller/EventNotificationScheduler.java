package com.seva.platform.controller;

import com.seva.platform.model.Event;
import com.seva.platform.repository.EventRepository;
import com.seva.platform.service.PushSendService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Component
public class EventNotificationScheduler {

    private static final Logger log = LoggerFactory.getLogger(EventNotificationScheduler.class);

    private final EventRepository eventRepo;
    private final PushSendService pushSendService;

    public EventNotificationScheduler(EventRepository eventRepo, PushSendService pushSendService) {
        this.eventRepo = eventRepo;
        this.pushSendService = pushSendService;
    }

    // Runs every day at 8:00 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendDailyEventReminders() {
        log.info("Starting daily event notification scheduler...");

        try {
            LocalDate today = LocalDate.now();
            LocalDate tomorrow = today.plusDays(1);

            // Get events for today and tomorrow
            List<Event> todayEvents = eventRepo.findByEventDateAndActiveTrue(today);
            List<Event> tomorrowEvents = eventRepo.findByEventDateAndActiveTrue(tomorrow);

            log.info("Found {} events today, {} events tomorrow", 
                todayEvents.size(), tomorrowEvents.size());

            // Send notifications
            for (Event event : todayEvents) {
                sendEventReminder(event, "TODAY");
            }

            for (Event event : tomorrowEvents) {
                sendEventReminder(event, "TOMORROW");
            }

            log.info("Daily event notifications completed");

        } catch (Exception e) {
            log.error("Error in daily event notification scheduler", e);
        }
    }

    private void sendEventReminder(Event event, String timing) {
        try {
            DayOfWeek dow = DayOfWeek.from(event.getEventDate());
            String weekday = capitalize(dow.name());
            String tithi = (event.getTithiLabel() == null || event.getTithiLabel().isBlank())
                ? "Tithi not published"
                : event.getTithiLabel().trim();

            String title = timing.equals("TODAY") 
                ? "📅 Event Today: " + event.getType()
                : "🔔 Tomorrow: " + event.getType();
                
            String body = event.getTitle() + " • " + weekday + " • " + tithi;

            pushSendService.sendToAllEnabled(title, body);
            
            log.info("✓ Sent {} notification for: {}", timing, event.getTitle());
            
        } catch (Exception ex) {
            log.error("✗ Failed to send notification for event {}", event.getId(), ex);
        }
    }

    private static String capitalize(String s) {
        if (s == null || s.isBlank()) return s;
        String lower = s.toLowerCase();
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }
}
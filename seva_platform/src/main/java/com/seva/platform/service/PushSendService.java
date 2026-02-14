package com.seva.platform.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.Notification;
import com.seva.platform.repository.PushTokenRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PushSendService {
    private final PushTokenRepository repo;

    public PushSendService(PushTokenRepository repo) {
        this.repo = repo;
    }

    public void sendToAllEnabled(String title, String body) {
    System.out.println("=== PUSH SERVICE: sendToAllEnabled called ===");
    System.out.println("Title: " + title);
    System.out.println("Body: " + body);
    
    List<String> tokens = repo.findByEnabledTrue()
        .stream()
        .map(t -> t.getToken())
        .toList();
    
    System.out.println("Found " + tokens.size() + " enabled tokens");
    
    if (tokens.isEmpty()) {
        System.out.println("No enabled tokens found - skipping notification");
        return;
    }

    MulticastMessage msg = MulticastMessage.builder()
            .addAllTokens(tokens)
            .setNotification(Notification.builder().setTitle(title).setBody(body).build())
            .build();

    try { 
        System.out.println("Sending multicast notification to " + tokens.size() + " devices...");
        var result = FirebaseMessaging.getInstance().sendEachForMulticast(msg);
        System.out.println("Multicast sent! Success: " + result.getSuccessCount() + ", Failed: " + result.getFailureCount());
    }
    catch (Exception e) { 
        System.err.println("FCM send error: " + e.getMessage());
        e.printStackTrace();
    }
}
}

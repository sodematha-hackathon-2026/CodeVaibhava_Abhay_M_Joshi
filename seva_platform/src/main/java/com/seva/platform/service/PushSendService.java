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

    public PushSendService(PushTokenRepository repo) { this.repo = repo; }

    public void sendToAllEnabled(String title, String body) {
        List<String> tokens = repo.findByEnabledTrue().stream().map(t -> t.getToken()).toList();
        if (tokens.isEmpty()) return;

        MulticastMessage msg = MulticastMessage.builder()
                .addAllTokens(tokens)
                .setNotification(Notification.builder().setTitle(title).setBody(body).build())
                .build();

        try { FirebaseMessaging.getInstance().sendMulticast(msg); }
        catch (Exception e) { System.out.println("FCM send error: " + e.getMessage()); }
    }
}

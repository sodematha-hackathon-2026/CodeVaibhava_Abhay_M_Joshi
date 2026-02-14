package com.seva.platform.security;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class FirebaseInitializer {

    private static final Logger log = LoggerFactory.getLogger(FirebaseInitializer.class);

    private final ResourceLoader resourceLoader;

    @Value("${app.firebase.serviceAccountPath}")
    private String serviceAccountPath;

    public FirebaseInitializer(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @PostConstruct
    public void init() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                log.info("Initializing Firebase Admin SDK...");
                log.info("Loading service account from: {}", serviceAccountPath);

                Resource resource = resourceLoader.getResource(serviceAccountPath);

                if (!resource.exists()) {
                    throw new RuntimeException("Firebase service account file not found at: " + serviceAccountPath);
                }

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
                        .build();

                FirebaseApp.initializeApp(options);
                log.info("Firebase Admin SDK initialized successfully");
            }
        } catch (IOException e) {
            log.error("Failed to initialize Firebase Admin SDK", e);
            throw new RuntimeException("Failed to init Firebase Admin SDK. Check app.firebase.serviceAccountPath: " + serviceAccountPath, e);
        }
    }
}
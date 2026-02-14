package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name="social_links")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SocialLink {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable=false)
    private String platform; // instagram, youtube, website...

    @Column(nullable=false)
    private String url;

    @Column(nullable=false)
    private boolean active;

    @Column(nullable=false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if(createdAt == null) createdAt = Instant.now();
    }
}
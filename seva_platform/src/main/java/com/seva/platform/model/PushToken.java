package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name="push_tokens")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PushToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable=false)
    private String userUid;

    @Column(nullable=false, unique=true, columnDefinition="text")
    private String token;

    @Column(nullable=false)
    private boolean enabled;

    @Column(nullable=false)
    private Instant updatedAt;

    @PrePersist @PreUpdate
    void touch() { updatedAt = Instant.now(); }
}

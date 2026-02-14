package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name="artefacts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Artefact {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable=false, columnDefinition="text")
    private String title;

    @Column(nullable=false)
    private String category; // e.g. "Stotra", "Lecture", "Bhajana", "PDF"

    @Column(nullable=false)
    private String type; // "PDF" | "AUDIO"

    @Column(columnDefinition="text")
    private String description;

    @Column(nullable=false, columnDefinition="text")
    private String url; // Firebase Storage download URL

    @Column(columnDefinition="text")
    private String thumbnailUrl; // optional

    @Column(nullable=false)
    private boolean active;

    @Column(nullable=false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}

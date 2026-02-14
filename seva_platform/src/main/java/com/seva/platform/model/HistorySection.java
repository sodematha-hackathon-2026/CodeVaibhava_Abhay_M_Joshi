package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name="history_sections")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HistorySection {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable=false, columnDefinition="text")
    private String title;

    @Column(columnDefinition="text")
    private String subtitle;

    @Column(columnDefinition="text")
    private String period;

    @Column(columnDefinition="text")
    private String description;

    @Column(name="image_url", columnDefinition="text")
    private String imageUrl;

    @Column(nullable=false)
    private int sortOrder;

    @Column(nullable=false)
    private boolean active;

    @Column(nullable=false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}

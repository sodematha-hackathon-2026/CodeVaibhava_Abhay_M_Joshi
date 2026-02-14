package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name="temple_info")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MathaInfo {
    @Id
    private String id; // keep fixed = "default"

    @Column(columnDefinition="text", nullable=false)
    private String morningDarshan;

    @Column(columnDefinition="text", nullable=false)
    private String morningPrasada;

    @Column(columnDefinition="text", nullable=false)
    private String eveningDarshan;

    @Column(columnDefinition="text", nullable=false)
    private String eveningPrasada;

    @Column(nullable=false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = Instant.now();
    }
}
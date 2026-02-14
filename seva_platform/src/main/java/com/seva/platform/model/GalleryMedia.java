package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name="gallery_media")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GalleryMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable=false)
    private String albumId;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private MediaType type;

    private String title;

    @Column(nullable=false, columnDefinition="text")
    private String url;

    @Column(columnDefinition="text")
    private String thumbnailUrl;

    @Column(nullable=false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}

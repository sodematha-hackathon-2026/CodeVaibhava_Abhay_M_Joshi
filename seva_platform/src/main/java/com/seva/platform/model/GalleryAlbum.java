package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name="gallery_albums")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GalleryAlbum {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable=false)
    private String title;

    @Column(columnDefinition="text")
    private String description;

    @Column(columnDefinition="text")
    private String coverImageUrl;

    @Column(nullable=false)
    private boolean active;

    @Column(nullable=false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}

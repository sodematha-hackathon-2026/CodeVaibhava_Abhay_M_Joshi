package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "app_config")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppConfig {

    @Id
    private Integer id; // always 1 row

    @Column(name="enable_events", nullable=false) private boolean enableEvents = true;
    @Column(name="enable_gallery", nullable=false) private boolean enableGallery = true;
    @Column(name="enable_artefacts", nullable=false) private boolean enableArtefacts = true;
    @Column(name="enable_history", nullable=false) private boolean enableHistory = true;
    @Column(name="enable_room_booking", nullable=false) private boolean enableRoomBooking = true;
    @Column(name="enable_seva", nullable=false) private boolean enableSeva = true;
    @Column(name="enable_quiz", nullable=false) private boolean enableQuiz = true;

    @Column(name="updated_at", nullable=false) private Instant updatedAt;

    @PrePersist @PreUpdate
    void touch() { updatedAt = Instant.now(); }
}

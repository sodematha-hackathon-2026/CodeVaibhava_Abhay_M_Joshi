package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name="sevas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Seva {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable=false)
    private String title;

    @Column(columnDefinition="text")
    private String description;

    @Column(nullable=false)
    private int amountInPaise;

    @Column(nullable=false)
    private boolean active;

    @Column(nullable=false)
    private Instant createdAt;

    @Column(nullable=false)
    private Instant updatedAt;

    @PrePersist
    void onCreate(){
        Instant now = Instant.now();
        if(createdAt==null) createdAt = now;
        if(updatedAt==null) updatedAt = now;
    }

    @PreUpdate
    void onUpdate(){ updatedAt = Instant.now(); }
}
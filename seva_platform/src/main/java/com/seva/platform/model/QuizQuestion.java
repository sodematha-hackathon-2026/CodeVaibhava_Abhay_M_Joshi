package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "quiz_questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable=false, columnDefinition="text")
    private String questionText;

    @Column(nullable=false, columnDefinition="text")
    private String optionA;

    @Column(nullable=false, columnDefinition="text")
    private String optionB;

    @Column(nullable=false, columnDefinition="text")
    private String optionC;

    @Column(nullable=false, columnDefinition="text")
    private String optionD;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private CorrectOption correctOption;

    @Column(nullable=false)
    private boolean active;

    @Column(nullable=false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}

package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "legal_content")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LegalContent {

    @Id
    private Integer id;

    @Column(nullable = false, columnDefinition = "text")
    private String privacyPolicy;

    @Column(nullable = false, columnDefinition = "text")
    private String termsAndConditions;

    @Column(nullable = false, columnDefinition = "text")
    private String consentText;

    @Column(columnDefinition = "text")
    private String sevaConsent;

    @Column(columnDefinition = "text")
    private String devoteeConsent;

    @Column(columnDefinition = "text")
    private String bookingConsent;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = Instant.now();
    }
}

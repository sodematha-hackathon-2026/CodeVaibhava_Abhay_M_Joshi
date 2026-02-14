package com.seva.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name="seva_orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SevaOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable=false)
    private String uid;

    @Column(nullable=false)
    private String sevaId;

    @Column(nullable=false)
    private String sevaTitle;

    @Column(nullable=false)
    private int amountInPaise;

    @Column(nullable=false)
    private String status;

    @Column(nullable=false)
    private boolean consentToStore;

    private String fullName;
    private String mobile;
    private String email;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

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

package com.seva.platform.dto;

import jakarta.validation.constraints.NotBlank;

public class LegalDto {

        public record PublicLegal(
                        String privacyPolicy,
                        String termsAndConditions,
                        String consentText,
                        String sevaConsent,
                        String devoteeConsent,
                        String bookingConsent,
                        String updatedAt) {
        }

        public record UpdateRequest(
                        @NotBlank String privacyPolicy,
                        @NotBlank String termsAndConditions,
                        @NotBlank String consentText,
                        String sevaConsent,
                        String devoteeConsent,
                        String bookingConsent

        ) {
        }
}

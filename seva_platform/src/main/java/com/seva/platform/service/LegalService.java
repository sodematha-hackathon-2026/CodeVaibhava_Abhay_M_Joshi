package com.seva.platform.service;


import com.seva.platform.model.LegalContent;
import com.seva.platform.dto.LegalDto;
import com.seva.platform.repository.LegalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LegalService {

    private final LegalRepository repo;

    public LegalService(LegalRepository repo) {
        this.repo = repo;
    }

    private LegalContent row() {
        return repo.findById(1).orElseGet(() -> repo.save(
                LegalContent.builder()
                        .id(1)
                        .privacyPolicy("Privacy Policy: (admin will update full content here)")
                        .termsAndConditions("Terms & Conditions: (admin will update full content here)")
                        .consentText("I agree to the Privacy Policy and Terms & Conditions.")
                        .sevaConsent("Seva Consent: (admin will update full content here)")
                        .devoteeConsent("Devotee Consent: (admin will update full content here)")
                        .bookingConsent("Booking Consent: (admin will update full content here)")
                        .build()
        ));
    }

    public LegalDto.PublicLegal getPublic() {
        LegalContent c = row();
        return new LegalDto.PublicLegal(
                c.getPrivacyPolicy(),
                c.getTermsAndConditions(),
                c.getConsentText(),
                c.getSevaConsent(),
                c.getDevoteeConsent(),
                c.getBookingConsent(),
                c.getUpdatedAt().toString()
                
        );
    }

    @Transactional
    public LegalDto.PublicLegal update(LegalDto.UpdateRequest req) {
        LegalContent c = row();
        c.setPrivacyPolicy(req.privacyPolicy());
        c.setTermsAndConditions(req.termsAndConditions());
        c.setConsentText(req.consentText());
        if (req.sevaConsent() != null) c.setSevaConsent(req.sevaConsent());
        if (req.devoteeConsent() != null) c.setDevoteeConsent(req.devoteeConsent());
        repo.save(c);
        return getPublic();
    }
}
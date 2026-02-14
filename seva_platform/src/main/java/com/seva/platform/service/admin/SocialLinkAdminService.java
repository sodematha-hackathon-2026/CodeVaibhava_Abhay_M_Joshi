package com.seva.platform.service.admin;

import com.seva.platform.dto.SocialLinkDto;
import com.seva.platform.model.SocialLink;
import com.seva.platform.repository.SocialLinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class SocialLinkAdminService {

    private final SocialLinkRepository repo;

    public SocialLinkAdminService(SocialLinkRepository repo) {
        this.repo = repo;
    }

    public List<SocialLinkDto.AdminItem> list() {
        return repo.findAll()
                .stream()
                .sorted((a,b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toAdmin)
                .toList();
    }

    @Transactional
    public SocialLinkDto.AdminItem create(SocialLinkDto.Upsert req) {
        SocialLink s = SocialLink.builder()
                .platform(req.platform().trim().toLowerCase())
                .url(req.url().trim())
                .active(Boolean.TRUE.equals(req.active()))
                .createdAt(Instant.now())
                .build();
        return toAdmin(repo.save(s));
    }

    @Transactional
    public SocialLinkDto.AdminItem update(String id, SocialLinkDto.Upsert req) {
        SocialLink s = repo.findById(id).orElseThrow();
        s.setPlatform(req.platform().trim().toLowerCase());
        s.setUrl(req.url().trim());
        s.setActive(Boolean.TRUE.equals(req.active()));
        return toAdmin(repo.save(s));
    }

    @Transactional
    public void delete(String id) {
        repo.deleteById(id);
    }

    private SocialLinkDto.AdminItem toAdmin(SocialLink s) {
        return new SocialLinkDto.AdminItem(
                s.getId(),
                s.getPlatform(),
                s.getUrl(),
                s.isActive(),
                s.getCreatedAt() == null ? null : s.getCreatedAt().toString()
        );
    }
}

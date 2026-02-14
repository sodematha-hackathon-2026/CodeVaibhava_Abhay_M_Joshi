package com.seva.platform.service.admin;

import com.seva.platform.dto.SevaAdminDto;
import com.seva.platform.model.Seva;
import com.seva.platform.repository.SevaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class SevaAdminService {

    private final SevaRepository repo;

    public SevaAdminService(SevaRepository repo) {
        this.repo = repo;
    }

    public List<SevaAdminDto.SevaAdmin> list() {
        return repo.findAllByOrderByUpdatedAtDesc()
                .stream().map(this::toAdmin).toList();
    }

    @Transactional
    public SevaAdminDto.SevaAdmin create(SevaAdminDto.Upsert req) {
        Seva s = Seva.builder()
                .title(req.title().trim())
                .description(req.description())
                .amountInPaise(req.amountInPaise())
                .active(Boolean.TRUE.equals(req.active()))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        return toAdmin(repo.save(s));
    }

    @Transactional
    public SevaAdminDto.SevaAdmin update(String id, SevaAdminDto.Upsert req) {
        Seva s = repo.findById(id).orElseThrow(() -> new RuntimeException("Seva not found"));
        s.setTitle(req.title().trim());
        s.setDescription(req.description());
        s.setAmountInPaise(req.amountInPaise());
        s.setActive(Boolean.TRUE.equals(req.active()));
        // updatedAt handled by @PreUpdate too, but keeping explicit is fine
        s.setUpdatedAt(Instant.now());
        return toAdmin(repo.save(s));
    }

    @Transactional
    public void delete(String id) {
        repo.deleteById(id);
    }

    private SevaAdminDto.SevaAdmin toAdmin(Seva s) {
        return new SevaAdminDto.SevaAdmin(
                s.getId(),
                s.getTitle(),
                s.getDescription(),
                s.getAmountInPaise(),
                s.isActive(),
                s.getCreatedAt() == null ? null : s.getCreatedAt().toString(),
                s.getUpdatedAt() == null ? null : s.getUpdatedAt().toString()
        );
    }
}

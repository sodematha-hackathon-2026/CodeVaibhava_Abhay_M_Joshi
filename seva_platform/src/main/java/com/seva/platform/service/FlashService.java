package com.seva.platform.service;

import com.seva.platform.dto.FlashDto;
import com.seva.platform.model.FlashUpdate;
import com.seva.platform.repository.FlashRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class FlashService {

    private final FlashRepo repo;

    public FlashService(FlashRepo repo) {
        this.repo = repo;
    }

    //public
    public List<FlashUpdate> getActiveFlashUpdates() {
        return repo.findByActiveTrueOrderByCreatedAtDesc();
    }

    // admin
    public List<FlashDto.FlashAdmin> adminList() {
        return repo.findAll().stream().map(this::toAdmin).toList();
    }

    @Transactional
    public FlashDto.FlashAdmin create(FlashDto.Upsert req) {
        FlashUpdate f = FlashUpdate.builder()
                .text(req.text().trim())
                .active(Boolean.TRUE.equals(req.active()))
                .createdAt(Instant.now())
                .build();
        return toAdmin(repo.save(f));
    }

    @Transactional
    public FlashDto.FlashAdmin update(String id, FlashDto.Upsert req) {
        FlashUpdate f = repo.findById(id).orElseThrow();
        f.setText(req.text().trim());
        f.setActive(Boolean.TRUE.equals(req.active()));
        return toAdmin(repo.save(f));
    }

    @Transactional
    public void delete(String id) {
        repo.deleteById(id);
    }

    private FlashDto.FlashAdmin toAdmin(FlashUpdate f) {
        return new FlashDto.FlashAdmin(
                f.getId(),
                f.getText(),
                f.isActive(),
                f.getCreatedAt().toString()
        );
    }
}
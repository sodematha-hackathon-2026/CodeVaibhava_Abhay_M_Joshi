package com.seva.platform.service;


import com.seva.platform.model.HistorySection;
import com.seva.platform.dto.HistoryDto;
import com.seva.platform.repository.HistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HistoryService {

    private final HistoryRepository repo;

    public HistoryService(HistoryRepository repo) {
        this.repo = repo;
    }

    public List<HistoryDto.PublicItem> publicList() {
        return repo.findByActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(s -> new HistoryDto.PublicItem(
                        s.getId(),
                        s.getTitle(),
                        s.getSubtitle(),
                        s.getPeriod(),
                        s.getDescription(),
                        s.getImageUrl(),
                        s.getSortOrder()
                ))
                .toList();
    }

    public List<HistoryDto.AdminItem> adminList() {
        return repo.findAllByOrderBySortOrderAsc()
                .stream()
                .map(this::toAdmin)
                .toList();
    }

    @Transactional
    public HistoryDto.AdminItem create(HistoryDto.Upsert req) {
        HistorySection s = HistorySection.builder()
                .title(req.title())
                .subtitle(req.subtitle())
                .period(req.period())
                .description(req.description())
                .imageUrl(req.imageUrl())
                .sortOrder(req.sortOrder())
                .active(req.active())
                .build();

        return toAdmin(repo.save(s));
    }

    @Transactional
    public HistoryDto.AdminItem update(String id, HistoryDto.Upsert req) {
        HistorySection s = repo.findById(id).orElseThrow();

        s.setTitle(req.title());
        s.setSubtitle(req.subtitle());
        s.setPeriod(req.period());
        s.setDescription(req.description());
        s.setImageUrl(req.imageUrl());
        s.setSortOrder(req.sortOrder());
        s.setActive(req.active());

        return toAdmin(repo.save(s));
    }

    @Transactional
    public void delete(String id) {
        repo.deleteById(id);
    }

    private HistoryDto.AdminItem toAdmin(HistorySection s) {
        return new HistoryDto.AdminItem(
                s.getId(),
                s.getTitle(),
                s.getSubtitle(),
                s.getPeriod(),
                s.getDescription(),
                s.getImageUrl(),
                s.getSortOrder(),
                s.isActive(),
                s.getCreatedAt().toString()
        );
    }
}

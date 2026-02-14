package com.seva.platform.service;


import com.seva.platform.dto.ArtefactDto;
import com.seva.platform.model.Artefact;
import com.seva.platform.repository.ArtefactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class ArtefactService {

    private final ArtefactRepository repo;

    public ArtefactService(ArtefactRepository repo) {
        this.repo = repo;
    }

    public List<ArtefactDto.ArtefactPublic> list(String category, String type) {
        List<Artefact> items;

        if (category != null && !category.isBlank() && type != null && !type.isBlank()) {
            items = repo.findByCategoryIgnoreCaseAndTypeIgnoreCaseOrderByCreatedAtDesc(category.trim(), type.trim());
        } else if (category != null && !category.isBlank()) {
            items = repo.findByCategoryIgnoreCaseOrderByCreatedAtDesc(category.trim());
        } else if (type != null && !type.isBlank()) {
            items = repo.findByTypeIgnoreCaseOrderByCreatedAtDesc(type.trim());
        } else {
            items = repo.findAllByOrderByCreatedAtDesc();
        }

        return items.stream().map(a -> new ArtefactDto.ArtefactPublic(
                a.getId(),
                a.getTitle(),
                a.getCategory(),
                a.getType(),
                a.getDescription(),
                a.getUrl(),
                a.getThumbnailUrl(),
                a.isActive(),
                a.getCreatedAt().toString()
        )).toList();
    }

    public java.util.List<ArtefactDto.ArtefactAdmin> adminList() {
        return repo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toAdmin)
                .toList();
    }

    @Transactional
    public ArtefactDto.ArtefactAdmin create(ArtefactDto.Upsert req) {
        Artefact a = Artefact.builder()
                .title(req.title())
                .category(req.category())
                .type(req.type())
                .description(req.description())
                .url(req.url())
                .thumbnailUrl(req.thumbnailUrl())
                .active(req.active())
                .createdAt(Instant.now())
                .build();

        a = repo.save(a);
        return toAdmin(a);
    }

    @Transactional
    public ArtefactDto.ArtefactAdmin update(String id, ArtefactDto.Upsert req) {
        Artefact a = repo.findById(id).orElseThrow();

        a.setTitle(req.title());
        a.setCategory(req.category());
        a.setType(req.type());
        a.setDescription(req.description());
        a.setUrl(req.url());
        a.setThumbnailUrl(req.thumbnailUrl());
        a.setActive(req.active());

        a = repo.save(a);
        return toAdmin(a);
    }

    @Transactional
    public void delete(String id) {
        repo.deleteById(id);
    }

    private ArtefactDto.ArtefactAdmin toAdmin(Artefact a) {
        return new ArtefactDto.ArtefactAdmin(
                a.getId(),
                a.getTitle(),
                a.getCategory(),
                a.getType(),
                a.getDescription(),
                a.getUrl(),
                a.getThumbnailUrl(),
                a.isActive(),
                a.getCreatedAt().toString()
        );
    }
}

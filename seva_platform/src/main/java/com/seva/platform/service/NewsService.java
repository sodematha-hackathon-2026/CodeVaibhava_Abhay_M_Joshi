package com.seva.platform.service;

import com.seva.platform.dto.NewsDto;
import com.seva.platform.model.News;
import com.seva.platform.repository.NewsRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class NewsService {

    private final NewsRepo repo;

    public NewsService(NewsRepo repo) {
        this.repo = repo;
    }

    // public
    public List<News> getLatestNews(int limit) {
        int validLimit = Math.max(1, Math.min(limit, 50));
        List<News> all = repo.findLatestActive(); // <-- use active
        return all.stream().limit(validLimit).toList();
    }

    public News getNewsById(String id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("News not found with id: " + id));
    }

    // admin
    public List<NewsDto.NewsAdmin> adminList() {
        return repo.findLatestActive().stream().map(this::toAdmin).toList();
    }

    @Transactional
    public NewsDto.NewsAdmin create(NewsDto.Upsert req) {
        News n = News.builder()
                .title(req.title().trim())
                .imageUrl(req.imageUrl().trim())
                .body(req.body())
                .active(req.active())
                .createdAt(Instant.now())
                .build();
        return toAdmin(repo.save(n));
    }

    @Transactional
    public NewsDto.NewsAdmin update(String id, NewsDto.Upsert req) {
        News n = repo.findById(id).orElseThrow();
        n.setTitle(req.title().trim());
        n.setImageUrl(req.imageUrl().trim());
        n.setBody(req.body());
        n.setActive(req.active());
        return toAdmin(repo.save(n));
    }

    @Transactional
    public void delete(String id) {
        repo.deleteById(id);
    }

    private NewsDto.NewsAdmin toAdmin(News n) {
        return new NewsDto.NewsAdmin(
                n.getId(),
                n.getTitle(),
                n.getImageUrl(),
                n.getBody(),
                n.isActive(),
                n.getCreatedAt().toString()
        );
    }
}

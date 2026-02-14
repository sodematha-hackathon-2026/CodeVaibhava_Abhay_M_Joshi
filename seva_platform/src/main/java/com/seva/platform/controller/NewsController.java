package com.seva.platform.controller;

import com.seva.platform.model.News;
import com.seva.platform.service.NewsService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public List<News> latest(@RequestParam(defaultValue = "5") int limit) {
        return newsService.getLatestNews(limit);
    }

    @GetMapping("/{id}")
    public News one(@PathVariable String id) {
        return newsService.getNewsById(id);
    }
}
package com.seva.platform.controller.admin;

import com.seva.platform.dto.NewsDto;
import com.seva.platform.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/news")
public class AdminNewsController {

    private final NewsService service;

    public AdminNewsController(NewsService service) {
        this.service = service;
    }

    @GetMapping
    public List<NewsDto.NewsAdmin> list() {
        return service.adminList();
    }

    @PostMapping
    public NewsDto.NewsAdmin create(@Valid @RequestBody NewsDto.Upsert req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public NewsDto.NewsAdmin update(@PathVariable String id, @Valid @RequestBody NewsDto.Upsert req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}

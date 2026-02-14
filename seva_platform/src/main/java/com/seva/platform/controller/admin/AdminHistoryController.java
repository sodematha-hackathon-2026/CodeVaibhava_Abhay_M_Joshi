package com.seva.platform.controller.admin;

import com.seva.platform.dto.HistoryDto;
import com.seva.platform.service.HistoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/history")
public class AdminHistoryController {

    private final HistoryService service;

    public AdminHistoryController(HistoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<HistoryDto.AdminItem> list() {
        return service.adminList();
    }

    @PostMapping
    public HistoryDto.AdminItem create(@Valid @RequestBody HistoryDto.Upsert req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public HistoryDto.AdminItem update(
            @PathVariable String id,
            @Valid @RequestBody HistoryDto.Upsert req
    ) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}

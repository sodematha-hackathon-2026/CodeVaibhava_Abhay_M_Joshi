package com.seva.platform.controller.admin;

import com.seva.platform.dto.FlashDto;
import com.seva.platform.service.FlashService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/flash")
public class AdminFlashController {

    private final FlashService service;

    public AdminFlashController(FlashService service) {
        this.service = service;
    }

    @GetMapping
    public List<FlashDto.FlashAdmin> list() {
        return service.adminList();
    }

    @PostMapping
    public FlashDto.FlashAdmin create(@Valid @RequestBody FlashDto.Upsert req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public FlashDto.FlashAdmin update(@PathVariable String id, @Valid @RequestBody FlashDto.Upsert req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}

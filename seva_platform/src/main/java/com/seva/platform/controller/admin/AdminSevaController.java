package com.seva.platform.controller.admin;

import com.seva.platform.dto.SevaAdminDto;
import com.seva.platform.service.admin.SevaAdminService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/sevas")
public class AdminSevaController {

    private final SevaAdminService service;

    public AdminSevaController(SevaAdminService service) {
        this.service = service;
    }

    @GetMapping
    public List<SevaAdminDto.SevaAdmin> list() {
        return service.list();
    }

    @PostMapping
    public SevaAdminDto.SevaAdmin create(@Valid @RequestBody SevaAdminDto.Upsert req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public SevaAdminDto.SevaAdmin update(@PathVariable String id, @Valid @RequestBody SevaAdminDto.Upsert req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}

package com.seva.platform.controller.admin;

import com.seva.platform.dto.SocialLinkDto;
import com.seva.platform.service.admin.SocialLinkAdminService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/social")
public class AdminSocialController {

    private final SocialLinkAdminService service;

    public AdminSocialController(SocialLinkAdminService service) {
        this.service = service;
    }

    @GetMapping
    public List<SocialLinkDto.AdminItem> list() {
        return service.list();
    }

    @PostMapping
    public SocialLinkDto.AdminItem create(@Valid @RequestBody SocialLinkDto.Upsert req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public SocialLinkDto.AdminItem update(@PathVariable String id, @Valid @RequestBody SocialLinkDto.Upsert req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}

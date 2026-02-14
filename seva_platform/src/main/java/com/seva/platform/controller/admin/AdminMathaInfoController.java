package com.seva.platform.controller.admin;

import com.seva.platform.dto.MathaInfoDto;
import com.seva.platform.service.admin.MathaInfoAdminService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/temple-info")
public class AdminMathaInfoController {

    private final MathaInfoAdminService service;

    public AdminMathaInfoController(MathaInfoAdminService service) {
        this.service = service;
    }

    @GetMapping
    public MathaInfoDto.AdminItem get() {
        return service.get();
    }

    @PutMapping
    public MathaInfoDto.AdminItem update(@Valid @RequestBody MathaInfoDto.UpdateRequest req) {
        return service.update(req);
    }
}

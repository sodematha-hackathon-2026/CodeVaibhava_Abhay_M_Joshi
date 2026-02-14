package com.seva.platform.controller.admin;

import com.seva.platform.dto.AdminUserDto;
import com.seva.platform.service.admin.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUsersAdminController {

    private final AdminUserService service;

    public AdminUsersAdminController(AdminUserService service) {
        this.service = service;
    }

    @PostMapping("/promote")
    public AdminUserDto.AdminActionResponse promote(@Valid @RequestBody AdminUserDto.PromoteRequest req) {
        service.promoteToAdmin(req.uid());
        return new AdminUserDto.AdminActionResponse(req.uid(), "admin");
    }

    @PostMapping("/demote")
    public AdminUserDto.AdminActionResponse demote(@Valid @RequestBody AdminUserDto.DemoteRequest req) {
        service.demoteToUser(req.uid());
        return new AdminUserDto.AdminActionResponse(req.uid(), "user");
    }
}

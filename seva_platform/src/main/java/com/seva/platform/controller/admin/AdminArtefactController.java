package com.seva.platform.controller.admin;

import com.seva.platform.dto.ArtefactDto;
import com.seva.platform.service.ArtefactService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/artefacts")
public class AdminArtefactController {

    private final ArtefactService service;

    public AdminArtefactController(ArtefactService service) {
        this.service = service;
    }

    @GetMapping
    public List<ArtefactDto.ArtefactAdmin> list() {
        return service.adminList();
    }


    @PostMapping
    public ArtefactDto.ArtefactAdmin create(@Valid @RequestBody ArtefactDto.Upsert req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public ArtefactDto.ArtefactAdmin update(
            @PathVariable String id,
            @Valid @RequestBody ArtefactDto.Upsert req
    ) {
        return service.update(id, req);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}

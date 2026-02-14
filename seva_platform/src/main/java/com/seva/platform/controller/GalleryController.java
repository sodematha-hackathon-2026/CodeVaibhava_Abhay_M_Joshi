package com.seva.platform.controller;

import com.seva.platform.dto.GalleryDto;
import com.seva.platform.service.GalleryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final GalleryService service;

    public GalleryController(GalleryService service) {
        this.service = service;
    }

    @GetMapping("/albums")
    public List<GalleryDto.AlbumSummary> albums() {
        return service.listAlbums();
    }

    @GetMapping("/albums/{id}")
    public GalleryDto.AlbumDetail album(@PathVariable String id) {
        return service.getAlbum(id);
    }
}

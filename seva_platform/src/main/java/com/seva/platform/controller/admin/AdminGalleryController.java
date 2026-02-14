package com.seva.platform.controller.admin;

import com.seva.platform.dto.GalleryDto;
import com.seva.platform.service.GalleryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/gallery")
public class AdminGalleryController {

    private final GalleryService service;

    public AdminGalleryController(GalleryService service) {
        this.service = service;
    }

    @GetMapping("/albums")
    public List<GalleryDto.AlbumSummary> albums() {
        return service.listAlbumsAdmin();
    }

    @PostMapping("/albums")
    public GalleryDto.AlbumSummary createAlbum(@Valid @RequestBody GalleryDto.CreateAlbum req) {
        return service.createAlbum(req);
    }

    @PutMapping("/albums/{id}")
    public GalleryDto.AlbumSummary updateAlbum(
            @PathVariable String id,
            @Valid @RequestBody GalleryDto.CreateAlbum req
    ) {
        return service.updateAlbum(id, req);
    }

    @DeleteMapping("/albums/{id}")
    public void deleteAlbum(@PathVariable String id) {
        service.deleteAlbum(id);
    }

    @PostMapping("/media")
    public GalleryDto.MediaItem addMedia(@Valid @RequestBody GalleryDto.CreateMedia req) {
        return service.addMedia(req);
    }

    @DeleteMapping("/media/{id}")
    public void deleteMedia(@PathVariable String id) {
        service.deleteMedia(id);
    }
}

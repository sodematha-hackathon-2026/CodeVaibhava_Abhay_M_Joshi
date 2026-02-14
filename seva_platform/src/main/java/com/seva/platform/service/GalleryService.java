package com.seva.platform.service;


import com.seva.platform.dto.GalleryDto;
import com.seva.platform.model.GalleryAlbum;
import com.seva.platform.model.GalleryMedia;
import com.seva.platform.repository.GalleryAlbumRepository;
import com.seva.platform.repository.GalleryMediaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class GalleryService {

    private final GalleryAlbumRepository albumRepo;
    private final GalleryMediaRepository mediaRepo;

    public GalleryService(GalleryAlbumRepository albumRepo, GalleryMediaRepository mediaRepo) {
        this.albumRepo = albumRepo;
        this.mediaRepo = mediaRepo;
    }

    public List<GalleryDto.AlbumSummary> listAlbums() {
        return albumRepo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(a -> new GalleryDto.AlbumSummary(
                        a.getId(),
                        a.getTitle(),
                        a.getCoverImageUrl(),
                        a.isActive(),
                        a.getCreatedAt().toString()
                ))
                .toList();
    }

    public GalleryDto.AlbumDetail getAlbum(String albumId) {
        GalleryAlbum a = albumRepo.findById(albumId).orElseThrow();
        List<GalleryMedia> media = mediaRepo.findByAlbumIdOrderByCreatedAtDesc(albumId);

        return new GalleryDto.AlbumDetail(
                a.getId(),
                a.getTitle(),
                a.getDescription(),
                a.getCoverImageUrl(),
                a.isActive(),
                a.getCreatedAt().toString(),
                media.stream().map(m -> new GalleryDto.MediaItem(
                        m.getId(),
                        m.getAlbumId(),
                        m.getType().name(),
                        m.getTitle(),
                        m.getUrl(),
                        m.getThumbnailUrl(),
                        m.getCreatedAt().toString()
                )).toList()
        );
    }

    public List<GalleryDto.AlbumSummary> listAlbumsAdmin() {
        return albumRepo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(a -> new GalleryDto.AlbumSummary(
                        a.getId(),
                        a.getTitle(),
                        a.getCoverImageUrl(),
                        a.isActive(),
                        a.getCreatedAt().toString()
                ))
                .toList();
    }

    @Transactional
    public GalleryDto.AlbumSummary createAlbum(GalleryDto.CreateAlbum req) {
        GalleryAlbum a = GalleryAlbum.builder()
                .title(req.title())
                .description(req.description())
                .coverImageUrl(req.coverImageUrl())
                .active(req.active())
                .createdAt(Instant.now())
                .build();

        a = albumRepo.save(a);

        return new GalleryDto.AlbumSummary(
                a.getId(), a.getTitle(), a.getCoverImageUrl(), a.isActive(), a.getCreatedAt().toString()
        );
    }

    @Transactional
    public GalleryDto.AlbumSummary updateAlbum(String id, GalleryDto.CreateAlbum req) {
        GalleryAlbum a = albumRepo.findById(id).orElseThrow();

        a.setTitle(req.title());
        a.setDescription(req.description());
        a.setCoverImageUrl(req.coverImageUrl());
        a.setActive(req.active());

        a = albumRepo.save(a);

        return new GalleryDto.AlbumSummary(
                a.getId(), a.getTitle(), a.getCoverImageUrl(), a.isActive(), a.getCreatedAt().toString()
        );
    }

    @Transactional
    public GalleryDto.MediaItem addMedia(GalleryDto.CreateMedia req) {
        // ensure album exists
        albumRepo.findById(req.albumId()).orElseThrow();

        GalleryMedia m = GalleryMedia.builder()
                .albumId(req.albumId())
                .type(req.type())
                .title(req.title())
                .url(req.url())
                .thumbnailUrl(req.thumbnailUrl())
                .createdAt(Instant.now())
                .build();

        m = mediaRepo.save(m);

        return new GalleryDto.MediaItem(
                m.getId(), m.getAlbumId(), m.getType().name(), m.getTitle(),
                m.getUrl(), m.getThumbnailUrl(), m.getCreatedAt().toString()
        );
    }

    @Transactional
    public void deleteMedia(String mediaId) {
        mediaRepo.deleteById(mediaId);
    }

    @Transactional
    public void deleteAlbum(String albumId) {
        albumRepo.findById(albumId).orElseThrow();
        mediaRepo.deleteByAlbumId(albumId);
        albumRepo.deleteById(albumId);
    }
}

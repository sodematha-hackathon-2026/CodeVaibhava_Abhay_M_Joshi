package com.seva.platform.repository;

import com.seva.platform.model.GalleryMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryMediaRepository extends JpaRepository<GalleryMedia, String> {
    List<GalleryMedia> findByAlbumIdOrderByCreatedAtDesc(String albumId);

    void deleteByAlbumId(String albumId);
}

package com.seva.platform.repository;

import com.seva.platform.model.GalleryAlbum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryAlbumRepository extends JpaRepository<GalleryAlbum, String> {
    List<GalleryAlbum> findAllByOrderByCreatedAtDesc();
}

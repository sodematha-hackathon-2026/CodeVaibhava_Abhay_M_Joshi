package com.seva.platform.dto;

import com.seva.platform.model.MediaType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class GalleryDto {

    public record AlbumSummary(
            String id,
            String title,
            String coverImageUrl,
            boolean active,
            String createdAt
    ) {}

    public record MediaItem(
            String id,
            String albumId,
            String type,
            String title,
            String url,
            String thumbnailUrl,
            String createdAt
    ) {}

    public record AlbumDetail(
            String id,
            String title,
            String description,
            String coverImageUrl,
            boolean active,
            String createdAt,
            List<MediaItem> media
    ) {}

    public record CreateAlbum(
            @NotBlank String title,
            String description,
            String coverImageUrl,
            @NotNull Boolean active
    ) {}

    public record CreateMedia(
            @NotBlank String albumId,
            @NotNull MediaType type,
            String title,
            @NotBlank String url,
            String thumbnailUrl
    ) {}
}

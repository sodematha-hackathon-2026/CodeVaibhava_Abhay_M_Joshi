import { api } from "./backend";

export type AlbumSummary = {
  id: string;
  title: string;
  coverImageUrl?: string;
  active: boolean;
  createdAt: string;
};

export type MediaItem = {
  id: string;
  albumId: string;
  type: "IMAGE" | "VIDEO";
  title?: string;
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
};

export type AlbumDetail = {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  active: boolean;
  createdAt: string;
  media: MediaItem[];
};

export async function fetchAlbums(): Promise<AlbumSummary[]> {
  return api<AlbumSummary[]>("/api/gallery/albums", "GET");
}

export async function fetchAlbum(id: string): Promise<AlbumDetail> {
  return api<AlbumDetail>(`/api/gallery/albums/${id}`, "GET");
}

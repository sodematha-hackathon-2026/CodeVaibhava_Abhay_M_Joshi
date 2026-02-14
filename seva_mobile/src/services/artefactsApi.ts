import { api } from "./backend";

export type Artefact = {
  id: string;
  title: string;
  category: string;
  type: "PDF" | "AUDIO" | string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  active: boolean;
  createdAt: string;
};

export async function fetchArtefacts(params?: { category?: string; type?: string }) {
  const q = new URLSearchParams();
  if (params?.category) q.set("category", params.category);
  if (params?.type) q.set("type", params.type);

  const suffix = q.toString() ? `?${q.toString()}` : "";
  return api<Artefact[]>(`/api/artefacts${suffix}`, "GET");
}

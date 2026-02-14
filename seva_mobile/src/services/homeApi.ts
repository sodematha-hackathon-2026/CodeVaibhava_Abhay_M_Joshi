import { api } from "./backend";

export type Flash = { id: string; text: string; active: boolean; createdAt: string };
export type News = { id: string; title: string; imageUrl: string; body?: string; createdAt: string };
export type TempleInfo = { id: string; morningDarshan: string; morningPrasada: string; eveningDarshan: string; eveningPrasada: string; updatedAt: string };
export type SocialLink = { id: string; platform: string; url: string; active: boolean; createdAt: string };

export type HomePayload = {
  flashUpdates: Flash[];
  topNews: News[];
  templeInfo: TempleInfo;
  socialLinks: SocialLink[];
};

export async function fetchHome(): Promise<HomePayload> {
  return await api<HomePayload>("/api/home", "GET");
}

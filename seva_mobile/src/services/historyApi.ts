import { api } from "./backend";

export type HistoryItem = {
  id: string;
  title: string;
  subtitle?: string;
  period?: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
};

export async function fetchHistory() {
  return api<HistoryItem[]>("/api/history", "GET");
}

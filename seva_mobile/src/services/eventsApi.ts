import { api } from "./backend";

export type EventItem = {
  id: string;
  title: string;
  description?: string;
  date: string;        weekday: string;
  tithi: string;
  location?: string;
  type: "ARADHANA" | "PARYAYA" | "UTSAVA" | "GENERAL";
  scope: "LOCAL" | "NATIONAL";
  notifyUsers: boolean;
  imageUrl?: string;
};

export async function fetchEvents(params?: {
  from?: string;
  to?: string;
  type?: string;
  scope?: string;
}): Promise<EventItem[]> {
  const qs = new URLSearchParams();
  if (params?.from) qs.set("from", params.from);
  if (params?.to) qs.set("to", params.to);
  if (params?.type) qs.set("type", params.type);
  if (params?.scope) qs.set("scope", params.scope);

  const url = qs.toString() ? `/api/events?${qs.toString()}` : "/api/events";
  return api<EventItem[]>(url, "GET");
}

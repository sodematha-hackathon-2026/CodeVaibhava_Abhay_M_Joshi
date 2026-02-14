import { apiPublic } from "./backend";

export type AppConfig = {
  enableEvents: boolean;
  enableGallery: boolean;
  enableArtefacts: boolean;
  enableHistory: boolean;
  enableRoomBooking: boolean;
  enableSeva: boolean;
  enableQuiz: boolean;
};

export async function fetchConfig() {
  return apiPublic("/api/config", "GET");
}

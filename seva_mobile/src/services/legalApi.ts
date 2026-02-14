import { apiPublic } from "./backend";

export type LegalPayload = {
  privacyPolicy: string;
  termsAndConditions: string;
  consentText: string;
  updatedAt: string;
};

export async function fetchLegal() {
  return apiPublic("/api/legal", "GET");
}

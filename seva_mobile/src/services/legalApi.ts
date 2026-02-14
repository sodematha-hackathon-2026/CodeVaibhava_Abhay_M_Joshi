import { apiPublic } from "./backend";

export type LegalPayload = {
  privacyPolicy: string;
  termsAndConditions: string;
  consentText: string;
  updatedAt: string;
  sevaConsent: string; 
  devoteeConsent: string;
};

export async function fetchLegal(): Promise<LegalPayload> {
  return apiPublic<LegalPayload>("/api/legal", "GET");
}
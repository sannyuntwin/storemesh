import { fetchJson } from "@/services/fetcher";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

export interface GoogleRegistrationPayload {
  googleId?: string;
  providerAccountId?: string;
  email: string;
  username: string;
  address?: string;
}

export interface BuyerProfile {
  id: number;
  username: string;
  email: string;
  address: string | null;
  role: string;
  googleId: string | null;
  createdAt: string;
}

export interface GoogleRegistrationSyncResult {
  message: string;
  user: BuyerProfile;
  profileCompleted: boolean;
}

export interface SellerRegistrationSyncResult {
  message: string;
  user: BuyerProfile;
}

export const syncGoogleRegistration = async (
  payload: GoogleRegistrationPayload
): Promise<GoogleRegistrationSyncResult> => {
  const response = await fetchJson<ApiEnvelope<GoogleRegistrationSyncResult>>("/auth/google/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return response.data;
};

export const syncSellerRegistration = async (
  payload: Omit<GoogleRegistrationPayload, "googleId" | "providerAccountId">
): Promise<SellerRegistrationSyncResult> => {
  const response = await fetchJson<ApiEnvelope<SellerRegistrationSyncResult>>("/auth/seller/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return response.data;
};

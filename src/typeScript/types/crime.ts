export const crimeTypes = [
  "harassment",
  "theft",
  "stalking",
  "assault",
  "domestic_violence",
  "kidnapping",
  "other",
] as const;

export type CrimeType = (typeof crimeTypes)[number];

export interface CrimeReport {
  id: string;
  user_id: string | null;
  type: CrimeType;
  description: string;
  lat: number;
  lng: number;
  photo_url?: string | null;
  is_anonymous: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface SubmitCrimePayload {
  userId: string | null;
  type: string;
  description: string;
  lat: number;
  lng: number;
  photo?: File;
  is_anonymous: boolean;
}

export interface ReportData {
  id: string;
  type: CrimeType;
  description: string;
  lat: number;
  lng: number;
  photo_url?: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

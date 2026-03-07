import { z } from "zod";

export const crimeReportSchema = z.object({
  type: z.enum([
    "harassment",
    "theft",
    "stalking",
    "assault",
    "domestic_violence",
    "kidnapping",
    "other",
  ]),
  description: z.string().min(10).max(500),
  latitude: z.number({ message: "Location is required" }),
  longitude: z.number({ message: "Location is required" }),
  photo: z.any().optional(),
  is_anonymous: z.boolean(),
});

export type CrimeReportSchema = z.infer<typeof crimeReportSchema>;

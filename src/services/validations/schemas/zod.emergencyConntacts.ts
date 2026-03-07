import { z } from "zod";

export const emergencyContactSchema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),
  email:z.email().optional(),
  relationship: z.string().optional(),
});

export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;
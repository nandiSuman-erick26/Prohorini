import { z } from "zod";

export const userProfileSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  full_name: z.string().min(2, "Name required")
});

export type UserProfileSchema = z.infer<typeof userProfileSchema>;

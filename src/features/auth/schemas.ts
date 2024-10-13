import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim().min(1, "Required").email(),
    password: z.string().min(1, "Required").max(256, "Maximum 256 characters allowed"),
})

export const registerSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    email: z.string().trim().min(1, "Required").email(),
    password: z.string().min(8, "Minimum 8 character Required").max(256, "Maximum 256 characters allowed"),
})

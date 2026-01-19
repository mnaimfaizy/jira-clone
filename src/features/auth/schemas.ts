import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Required").email(),
  password: z
    .string()
    .min(1, "Required")
    .max(256, "Maximum 256 characters allowed"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  email: z.string().trim().min(1, "Required").email(),
  password: z
    .string()
    .min(8, "Minimum 8 character Required")
    .max(256, "Maximum 256 characters allowed"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Required").email(),
});

export const resetPasswordSchema = z
  .object({
    userId: z.string().min(1, "Required"),
    secret: z.string().min(1, "Required"),
    password: z
      .string()
      .min(8, "Minimum 8 characters required")
      .max(256, "Maximum 256 characters allowed"),
    confirmPassword: z
      .string()
      .min(8, "Minimum 8 characters required")
      .max(256, "Maximum 256 characters allowed"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  userId: z.string().min(1, "Required"),
  secret: z.string().min(1, "Required"),
});

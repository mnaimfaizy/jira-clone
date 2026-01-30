import { z } from "zod";

const MAX_WORKSPACE_IMAGE_SIZE_BYTES = 1024 * 1024; // 1MB

const imageSchema = z
  .union([
    z.instanceof(File),
    z.string().transform((value) => (value === "" ? undefined : value)),
  ])
  .optional()
  .superRefine((value, ctx) => {
    if (value instanceof File && value.size > MAX_WORKSPACE_IMAGE_SIZE_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Workspace icon must be 1MB or smaller",
      });
    }
  });

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: imageSchema,
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Must be 1 or more characters").optional(),
  image: imageSchema,
});

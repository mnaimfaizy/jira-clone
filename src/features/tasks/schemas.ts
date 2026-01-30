import { z } from "zod";

const optionalTrimmedString = z
  .string()
  .transform((value) => value.trim())
  .transform((value) => (value === "" ? undefined : value))
  .optional();

export const createTaskSchema = z.object({
  workspaceId: z.string().min(1),
  statusId: z.string().min(1),
  title: z.string().trim().min(1, "Required"),
  description: optionalTrimmedString,
  assigneeId: optionalTrimmedString,
});

export const updateTaskSchema = z
  .object({
    statusId: z.string().min(1).optional(),
    title: z.string().trim().min(1, "Required").optional(),
    description: z
      .string()
      .transform((value) => value.trim())
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
    assigneeId: z
      .string()
      .transform((value) => value.trim())
      .transform((value) => (value === "" ? undefined : value))
      .optional(),
    archivedAt: z.string().datetime().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const createTaskStatusSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().trim().min(1, "Required"),
  position: z.number().int().min(0).optional(),
});

export const updateTaskStatusSchema = z
  .object({
    name: z.string().trim().min(1, "Required").optional(),
    position: z.number().int().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const getTaskBoardQuerySchema = z.object({
  workspaceId: z.string().min(1),
  includeArchived: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

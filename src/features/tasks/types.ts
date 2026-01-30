import type { Models } from "node-appwrite";

export type TaskStatus = Models.Document & {
  workspaceId: string;
  name: string;
  position: number;
};

export type Task = Models.Document & {
  taskId: string;
  workspaceId: string;
  statusId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  archivedAt?: string | null;
};

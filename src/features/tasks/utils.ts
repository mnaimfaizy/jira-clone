import { ID, Query } from "node-appwrite";

import { DATABASE_ID, TASK_STATUSES_ID } from "@/config";
import { DEFAULT_TASK_STATUSES } from "./constants";

export const seedDefaultTaskStatuses = async ({
  databases,
  workspaceId,
}: {
  databases: {
    listDocuments: typeof import("node-appwrite").Databases.prototype.listDocuments;
    createDocument: typeof import("node-appwrite").Databases.prototype.createDocument;
  };
  workspaceId: string;
}) => {
  const existing = await databases.listDocuments(
    DATABASE_ID,
    TASK_STATUSES_ID,
    [Query.equal("workspaceId", workspaceId), Query.limit(1)],
  );

  if (existing.total > 0) return;

  await Promise.all(
    DEFAULT_TASK_STATUSES.map((status) =>
      databases.createDocument(DATABASE_ID, TASK_STATUSES_ID, ID.unique(), {
        workspaceId,
        name: status.name,
        position: status.position,
      }),
    ),
  );
};

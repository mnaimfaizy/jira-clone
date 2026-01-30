import { zValidator } from "@hono/zod-validator";
import { Hono, type Context } from "hono";
import { z } from "zod";
import { ID, Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, TASKS_ID, TASK_STATUSES_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { MembersRole } from "@/features/members/types";

import {
  createTaskSchema,
  createTaskStatusSchema,
  getTaskBoardQuerySchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../schemas";
import type { Task, TaskStatus } from "../types";

const ensureTasksCollectionsConfigured = (c: Context) => {
  if (!TASKS_ID || TASKS_ID === "CHANGE_ME") {
    return c.json(
      {
        error:
          "Misconfigured Appwrite: set NEXT_PUBLIC_APPWRITE_TASKS_ID to your Tasks collection ID.",
      },
      500,
    );
  }

  if (!TASK_STATUSES_ID || TASK_STATUSES_ID === "CHANGE_ME") {
    return c.json(
      {
        error:
          "Misconfigured Appwrite: set NEXT_PUBLIC_APPWRITE_TASK_STATUSES_ID to your Task Statuses collection ID.",
      },
      500,
    );
  }
};

const app = new Hono()
  .get(
    "/board",
    sessionMiddleware,
    zValidator("query", getTaskBoardQuerySchema),
    async (c) => {
      const configError = ensureTasksCollectionsConfigured(c);
      if (configError) return configError;

      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId, includeArchived } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const statuses = await databases.listDocuments<TaskStatus>(
        DATABASE_ID,
        TASK_STATUSES_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.orderAsc("$createdAt"),
        ],
      );

      const taskQueries = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (!includeArchived) {
        taskQueries.push(Query.isNull("archivedAt"));
      }

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskQueries,
      );

      return c.json({ data: { statuses, tasks } });
    },
  )
  .get(
    "/statuses",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string().min(1) })),
    async (c) => {
      const configError = ensureTasksCollectionsConfigured(c);
      if (configError) return configError;

      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const statuses = await databases.listDocuments<TaskStatus>(
        DATABASE_ID,
        TASK_STATUSES_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.orderAsc("$createdAt"),
        ],
      );

      return c.json({ data: statuses });
    },
  )
  .post(
    "/statuses",
    sessionMiddleware,
    zValidator("json", createTaskStatusSchema),
    async (c) => {
      const configError = ensureTasksCollectionsConfigured(c);
      if (configError) return configError;

      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId, name, position } = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MembersRole.Admin) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let nextPosition = position;

      if (typeof nextPosition !== "number") {
        const last = await databases.listDocuments<TaskStatus>(
          DATABASE_ID,
          TASK_STATUSES_ID,
          [
            Query.equal("workspaceId", workspaceId),
            Query.orderDesc("position"),
            Query.limit(1),
          ],
        );

        nextPosition = (last.documents[0]?.position ?? -1) + 1;
      }

      const status = await databases.createDocument<TaskStatus>(
        DATABASE_ID,
        TASK_STATUSES_ID,
        ID.unique(),
        { workspaceId, name, position: nextPosition },
      );

      return c.json({ data: status });
    },
  )
  .patch(
    "/statuses/:statusId",
    sessionMiddleware,
    zValidator("json", updateTaskStatusSchema),
    async (c) => {
      const configError = ensureTasksCollectionsConfigured(c);
      if (configError) return configError;

      const databases = c.get("databases");
      const user = c.get("user");
      const { statusId } = c.req.param();
      const values = c.req.valid("json");

      const existing = await databases.getDocument<TaskStatus>(
        DATABASE_ID,
        TASK_STATUSES_ID,
        statusId,
      );

      const member = await getMember({
        databases,
        workspaceId: existing.workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MembersRole.Admin) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updated = await databases.updateDocument<TaskStatus>(
        DATABASE_ID,
        TASK_STATUSES_ID,
        statusId,
        values,
      );

      return c.json({ data: updated });
    },
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const configError = ensureTasksCollectionsConfigured(c);
      if (configError) return configError;

      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId, statusId, title, description, assigneeId } =
        c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const status = await databases.getDocument<TaskStatus>(
        DATABASE_ID,
        TASK_STATUSES_ID,
        statusId,
      );

      if (status.workspaceId !== workspaceId) {
        return c.json({ error: "Invalid status" }, 400);
      }

      const task = await databases.createDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          workspaceId,
          statusId,
          title,
          description,
          assigneeId,
          archivedAt: null,
        },
      );

      return c.json({ data: task });
    },
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const configError = ensureTasksCollectionsConfigured(c);
    if (configError) return configError;

    const databases = c.get("databases");
    const user = c.get("user");

    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId,
    );

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ data: task });
  })
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", updateTaskSchema),
    async (c) => {
      const configError = ensureTasksCollectionsConfigured(c);
      if (configError) return configError;

      const databases = c.get("databases");
      const user = c.get("user");

      const { taskId } = c.req.param();
      const values = c.req.valid("json");

      const existing = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
      );

      const member = await getMember({
        databases,
        workspaceId: existing.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (values.statusId) {
        const status = await databases.getDocument<TaskStatus>(
          DATABASE_ID,
          TASK_STATUSES_ID,
          values.statusId,
        );

        if (status.workspaceId !== existing.workspaceId) {
          return c.json({ error: "Invalid status" }, 400);
        }
      }

      const updated = await databases.updateDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        values,
      );

      return c.json({ data: updated });
    },
  )
  .post("/:taskId/archive", sessionMiddleware, async (c) => {
    const configError = ensureTasksCollectionsConfigured(c);
    if (configError) return configError;

    const databases = c.get("databases");
    const user = c.get("user");

    const { taskId } = c.req.param();

    const existing = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId,
    );

    const member = await getMember({
      databases,
      workspaceId: existing.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const updated = await databases.updateDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId,
      { archivedAt: new Date().toISOString() },
    );

    return c.json({ data: updated });
  })
  .post("/:taskId/unarchive", sessionMiddleware, async (c) => {
    const configError = ensureTasksCollectionsConfigured(c);
    if (configError) return configError;

    const databases = c.get("databases");
    const user = c.get("user");

    const { taskId } = c.req.param();

    const existing = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId,
    );

    const member = await getMember({
      databases,
      workspaceId: existing.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const updated = await databases.updateDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId,
      { archivedAt: null },
    );

    return c.json({ data: updated });
  });

export default app;

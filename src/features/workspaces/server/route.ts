import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
  TASKS_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { MembersRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";
import { z } from "zod";
import { Workspace } from "../types";
import { seedDefaultTaskStatuses } from "@/features/tasks/utils";

const toPublicAppwriteError = (error: unknown) => {
  if (typeof error !== "object" || error === null) return null;

  const maybe = error as {
    code?: unknown;
    type?: unknown;
    message?: unknown;
  };

  const status = typeof maybe.code === "number" ? maybe.code : 400;
  const type = typeof maybe.type === "string" ? maybe.type : undefined;
  const message = typeof maybe.message === "string" ? maybe.message : undefined;

  if (!type && !message) return null;

  if (type === "storage_invalid_file_size") {
    return {
      status,
      message:
        message ?? "File size not allowed. Please upload a smaller image.",
    };
  }

  if (type === "storage_invalid_file_type") {
    return {
      status,
      message: message ?? "File type not allowed.",
    };
  }

  return {
    status,
    message: message ?? "Request failed.",
  };
};

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)],
    );

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        const { name, image } = c.req.valid("form");

        let uploadedImageUrl: string | undefined;

        if (image instanceof File) {
          const file = await storage.createFile(
            IMAGES_BUCKET_ID,
            ID.unique(),
            image,
          );

          // Use getFileView instead of getFilePreview (works on free tier)
          // This returns a URL to view the file directly
          uploadedImageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
        }

        const workspace = await databases.createDocument<Workspace>(
          DATABASE_ID,
          WORKSPACES_ID,
          ID.unique(),
          {
            name,
            userId: user.$id,
            imageUrl: uploadedImageUrl,
            inviteCode: generateInviteCode(6),
          },
        );

        await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: MembersRole.Admin,
        });

        await seedDefaultTaskStatuses({
          databases,
          workspaceId: workspace.$id,
        });

        return c.json<{ data: Workspace }>({ data: workspace });
      } catch (error) {
        const appwriteError = toPublicAppwriteError(error);
        if (appwriteError) {
          return c.json({ error: appwriteError.message }, 400);
        }

        console.error(error);
        return c.json({ error: "Failed to create workspace" }, 500);
      }
    },
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      try {
        const databases = c.get("databases");
        const storage = c.get("storage");
        const user = c.get("user");

        const { workspaceId } = c.req.param();
        const { name, image } = c.req.valid("form");

        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member || member.role !== MembersRole.Admin) {
          return c.json({ error: "Unauthorized" }, 401);
        }

        let uploadedImageUrl: string | undefined;

        if (image instanceof File) {
          const file = await storage.createFile(
            IMAGES_BUCKET_ID,
            ID.unique(),
            image,
          );

          // Use getFileView instead of getFilePreview (works on free tier)
          // This returns a URL to view the file directly
          uploadedImageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
        } else {
          uploadedImageUrl = image;
        }

        const workspace = await databases.updateDocument<Workspace>(
          DATABASE_ID,
          WORKSPACES_ID,
          workspaceId,
          {
            name,
            imageUrl: uploadedImageUrl,
          },
        );

        return c.json<{ data: Workspace }>({ data: workspace });
      } catch (error) {
        const appwriteError = toPublicAppwriteError(error);
        if (appwriteError) {
          return c.json({ error: appwriteError.message }, 400);
        }

        console.error(error);
        return c.json({ error: "Failed to update workspace" }, 500);
      }
    },
  )
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all tasks for this workspace
    const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.isNull("archivedAt"),
    ]);

    // Get all members for this workspace
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", workspaceId),
    ]);

    // Count tasks by status
    const completedTasks = tasks.documents.filter(
      (task) =>
        task.statusId &&
        (task as any).status?.name?.toLowerCase().includes("done"),
    ).length;

    const inProgressTasks = tasks.documents.filter(
      (task) =>
        task.statusId &&
        !(task as any).status?.name?.toLowerCase().includes("done"),
    ).length;

    return c.json({
      data: {
        totalTasks: tasks.total,
        completedTasks,
        inProgressTasks,
        totalMembers: members.total,
      },
    });
  })
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MembersRole.Admin) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MembersRole.Admin) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      { inviteCode: generateInviteCode(6) },
    );

    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member) {
        return c.json({ error: "Already a member" }, 400);
      }

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
      );

      if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId,
        role: MembersRole.Member,
      });

      return c.json({ data: workspace });
    },
  );

export default app;

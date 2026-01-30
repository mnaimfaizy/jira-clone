"use client";

import { useEffect, useMemo, useState } from "react";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { useArchiveTask } from "../api/use-archive-task";
import { useGetTask } from "../api/use-get-task";
import { useUnarchiveTask } from "../api/use-unarchive-task";
import { useUpdateTask } from "../api/use-update-task";
import { useGetMembers } from "@/features/members/api/use-get-members";

import type { TaskStatus } from "../types";

type MemberOption = {
  $id: string;
  name?: string;
};

interface TaskDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId?: string;
  workspaceId: string;
  statuses: TaskStatus[];
}

export const TaskDetailsModal = ({
  open,
  onOpenChange,
  taskId,
  workspaceId,
  statuses,
}: TaskDetailsModalProps) => {
  const taskQuery = useGetTask({ taskId: open ? taskId : undefined });
  const membersQuery = useGetMembers({ workspaceId });

  const updateTask = useUpdateTask();
  const archiveTask = useArchiveTask();
  const unarchiveTask = useUnarchiveTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusId, setStatusId] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!taskQuery.data) return;

    setTitle(taskQuery.data.title ?? "");
    setDescription(taskQuery.data.description ?? "");
    setStatusId(taskQuery.data.statusId ?? "");
    setAssigneeId(taskQuery.data.assigneeId ?? undefined);
  }, [taskQuery.data]);

  const memberOptions = useMemo(() => {
    return (membersQuery.data?.documents ?? []) as unknown as MemberOption[];
  }, [membersQuery.data]);

  const isArchived = !!taskQuery.data?.archivedAt;

  const isBusy =
    updateTask.isPending || archiveTask.isPending || unarchiveTask.isPending;

  const canSave =
    !!taskQuery.data && title.trim().length > 0 && statusId.length > 0;

  const handleSave = async () => {
    if (!taskId || !canSave) return;

    await updateTask.mutateAsync({
      param: { taskId },
      json: {
        title: title.trim(),
        description: description.trim() || undefined,
        statusId,
        assigneeId: assigneeId || undefined,
      },
    });

    onOpenChange(false);
  };

  const handleArchiveToggle = async () => {
    if (!taskId) return;

    if (isArchived) {
      await unarchiveTask.mutateAsync({ param: { taskId } });
    } else {
      await archiveTask.mutateAsync({ param: { taskId } });
    }

    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(next) => !isBusy && onOpenChange(next)}
    >
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Task</h2>
          <p className="text-sm text-neutral-500">
            View and edit task details.
          </p>
        </div>

        {taskQuery.isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : taskQuery.isError ? (
          <div className="text-sm text-red-600">Failed to load task.</div>
        ) : !taskQuery.data ? (
          <div className="text-sm text-neutral-600">No task selected.</div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Optional"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusId} onValueChange={setStatusId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s.$id} value={s.$id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select
                  value={assigneeId ?? "unassigned"}
                  onValueChange={(value) =>
                    setAssigneeId(value === "unassigned" ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {memberOptions.map((m) => (
                      <SelectItem key={m.$id} value={m.$id}>
                        {m.name ?? "Member"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant={isArchived ? "outline" : "destructive"}
                onClick={handleArchiveToggle}
                disabled={isBusy}
              >
                {isArchived ? "Restore" : "Archive"}
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isBusy}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave || isBusy}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResponsiveModal>
  );
};

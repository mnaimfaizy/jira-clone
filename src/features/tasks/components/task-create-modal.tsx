"use client";

import { useMemo, useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";

import { useCreateTask } from "../api/use-create-task";
import { useGetMembers } from "@/features/members/api/use-get-members";
import type { TaskStatus } from "../types";

type MemberOption = {
  $id: string;
  name?: string;
};

interface TaskCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  statuses: TaskStatus[];
  defaultStatusId?: string;
}

export const TaskCreateModal = ({
  open,
  onOpenChange,
  workspaceId,
  statuses,
  defaultStatusId,
}: TaskCreateModalProps) => {
  const createTask = useCreateTask();
  const membersQuery = useGetMembers({ workspaceId });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusId, setStatusId] = useState<string>(() => {
    return defaultStatusId ?? statuses[0]?.$id ?? "";
  });
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined);

  const memberOptions = useMemo(() => {
    return (membersQuery.data?.documents ?? []) as unknown as MemberOption[];
  }, [membersQuery.data]);

  const canSubmit = title.trim().length > 0 && statusId.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    await createTask.mutateAsync({
      json: {
        workspaceId,
        statusId,
        title: title.trim(),
        description: description.trim() || undefined,
        assigneeId: assigneeId || undefined,
      },
    });

    setTitle("");
    setDescription("");
    setAssigneeId(undefined);
    onOpenChange(false);
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(nextOpen) => {
        if (!createTask.isPending) onOpenChange(nextOpen);
      }}
    >
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">New task</h2>
          <p className="text-sm text-neutral-500">
            Create a task in this workspace.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fix login bug"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
              rows={4}
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
                value={assigneeId ?? ""}
                onValueChange={(value) => setAssigneeId(value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {memberOptions.map((m) => (
                    <SelectItem key={m.$id} value={m.$id}>
                      {m.name ?? "Member"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createTask.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || createTask.isPending}
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
};

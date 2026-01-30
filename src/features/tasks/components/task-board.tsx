"use client";

import { useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-ids";

import { useGetTaskBoard } from "../api/use-get-task-board";
import type { Task, TaskStatus } from "../types";
import { TaskColumn } from "./task-column";
import { TaskCreateModal } from "./task-create-modal";
import { TaskDetailsModal } from "./task-details-modal";

export const TaskBoard = () => {
  const workspaceId = useWorkspaceId();

  const [includeArchived, setIncludeArchived] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDefaultStatusId, setCreateDefaultStatusId] = useState<
    string | undefined
  >(undefined);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(
    undefined,
  );

  const boardQuery = useGetTaskBoard({ workspaceId, includeArchived });

  const statuses: TaskStatus[] = useMemo(() => {
    return boardQuery.data?.statuses?.documents ?? [];
  }, [boardQuery.data]);

  const tasks: Task[] = useMemo(() => {
    return boardQuery.data?.tasks?.documents ?? [];
  }, [boardQuery.data]);

  const tasksByStatusId = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      const list = map.get(task.statusId) ?? [];
      list.push(task);
      map.set(task.statusId, list);
    }
    return map;
  }, [tasks]);

  const openCreate = (statusId?: string) => {
    setCreateDefaultStatusId(statusId);
    setCreateOpen(true);
  };

  const openDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDetailsOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Tasks</h1>
          <p className="text-sm text-neutral-500">
            Minimal board view for this workspace.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-archived"
              checked={includeArchived}
              onCheckedChange={(checked) => setIncludeArchived(checked === true)}
            />
            <Label htmlFor="show-archived" className="text-sm">
              Show archived
            </Label>
          </div>

          <Button type="button" onClick={() => openCreate(statuses[0]?.$id)}>
            New task
          </Button>
        </div>
      </div>

      {boardQuery.isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-[320px] shrink-0 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      ) : boardQuery.isError ? (
        <div className="text-sm text-red-600">Failed to load task board.</div>
      ) : statuses.length === 0 ? (
        <div className="text-sm text-neutral-600">
          No statuses found. Create a workspace again to auto-seed statuses.
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {statuses.map((status) => (
            <TaskColumn
              key={status.$id}
              status={status}
              tasks={tasksByStatusId.get(status.$id) ?? []}
              onTaskClick={openDetails}
              onCreateClick={(statusId) => openCreate(statusId)}
            />
          ))}
        </div>
      )}

      <TaskCreateModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        workspaceId={workspaceId}
        statuses={statuses}
        defaultStatusId={createDefaultStatusId}
      />

      <TaskDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        taskId={selectedTaskId}
        workspaceId={workspaceId}
        statuses={statuses}
      />
    </div>
  );
};

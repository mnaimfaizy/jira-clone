"use client";

import { cn } from "@/lib/utils";

import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const isArchived = !!task.archivedAt;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-md border bg-white p-3 shadow-sm hover:bg-neutral-50 transition",
        isArchived && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-sm text-neutral-900 truncate">
            {task.title}
          </p>
          {isArchived ? (
            <p className="text-xs text-neutral-500 mt-1">Archived</p>
          ) : null}
        </div>
      </div>
    </button>
  );
};

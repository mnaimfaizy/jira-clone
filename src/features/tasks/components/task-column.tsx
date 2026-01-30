"use client";

import { Button } from "@/components/ui/button";

import type { Task, TaskStatus } from "../types";
import { TaskCard } from "./task-card";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onCreateClick: (statusId: string) => void;
}

export const TaskColumn = ({
  status,
  tasks,
  onTaskClick,
  onCreateClick,
}: TaskColumnProps) => {
  return (
    <div className="w-[320px] shrink-0">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{status.name}</p>
          <p className="text-xs text-neutral-500">{tasks.length} tasks</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onCreateClick(status.$id)}
        >
          Add
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.$id}
            task={task}
            onClick={() => onTaskClick(task.$id)}
          />
        ))}

        {tasks.length === 0 ? (
          <div className="rounded-md border border-dashed bg-white p-4 text-xs text-neutral-500">
            No tasks
          </div>
        ) : null}
      </div>
    </div>
  );
};

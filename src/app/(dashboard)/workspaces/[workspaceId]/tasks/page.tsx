import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

import { TaskBoard } from "@/features/tasks/components/task-board";

export const dynamic = "force-dynamic";

const WorkspaceIdTasksPage = async () => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return (
    <div className="w-full">
      <TaskBoard />
    </div>
  );
};

export default WorkspaceIdTasksPage;

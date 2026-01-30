import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { getWorkspace } from "@/features/workspaces/queries";
import { WorkspaceAnalytics } from "@/features/workspaces/components/workspace-analytics";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";

interface WorkspaceIdPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdPage = async ({ params }: WorkspaceIdPageProps) => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  const workspace = await getWorkspace({ workspaceId: params.workspaceId });

  if (!workspace) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">
            Here's what's happening in {workspace.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/workspaces/${params.workspaceId}/members`}>
              <Users className="size-4 mr-2" />
              Members
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/workspaces/${params.workspaceId}/tasks`}>
              <PlusCircle className="size-4 mr-2" />
              View Tasks
            </Link>
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <WorkspaceAnalytics workspaceId={params.workspaceId} />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Link
          href={`/workspaces/${params.workspaceId}/tasks`}
          className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-card"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PlusCircle className="size-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Manage Tasks</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create, organize, and track your team's tasks
              </p>
            </div>
          </div>
        </Link>

        <Link
          href={`/workspaces/${params.workspaceId}/members`}
          className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-card"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="size-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Team Members</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Invite and manage workspace members
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default WorkspaceIdPage;

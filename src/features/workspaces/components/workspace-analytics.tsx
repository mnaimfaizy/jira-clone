"use client";

import { useGetWorkspaceAnalytics } from "../api/use-get-workspace-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ListTodo, Users, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkspaceAnalyticsProps {
  workspaceId: string;
}

export const WorkspaceAnalytics = ({
  workspaceId,
}: WorkspaceAnalyticsProps) => {
  const { data: analytics, isLoading } = useGetWorkspaceAnalytics({
    workspaceId,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Tasks",
      value: analytics?.totalTasks || 0,
      icon: ListTodo,
      description: "Active tasks in workspace",
      color: "text-blue-600",
    },
    {
      title: "Completed",
      value: analytics?.completedTasks || 0,
      icon: CheckCircle,
      description: "Tasks completed",
      color: "text-green-600",
    },
    {
      title: "In Progress",
      value: analytics?.inProgressTasks || 0,
      icon: TrendingUp,
      description: "Currently being worked on",
      color: "text-orange-600",
    },
    {
      title: "Team Members",
      value: analytics?.totalMembers || 0,
      icon: Users,
      description: "Active workspace members",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

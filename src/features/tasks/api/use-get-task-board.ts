import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetTaskBoard = ({
  workspaceId,
  includeArchived,
}: {
  workspaceId: string;
  includeArchived?: boolean;
}) => {
  return useQuery({
    queryKey: ["task-board", workspaceId, includeArchived ?? false],
    queryFn: async () => {
      const response = await client.api.tasks.board.$get({
        query: {
          workspaceId,
          ...(includeArchived ? { includeArchived: "true" } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task board");
      }

      const { data } = await response.json();
      return data;
    },
  });
};

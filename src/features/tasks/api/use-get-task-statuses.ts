import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetTaskStatuses = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  return useQuery({
    queryKey: ["task-statuses", workspaceId],
    queryFn: async () => {
      const response = await client.api.tasks.statuses.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch statuses");
      }

      const { data } = await response.json();
      return data;
    },
  });
};

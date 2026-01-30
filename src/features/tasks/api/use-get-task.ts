import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetTask = ({ taskId }: { taskId?: string }) => {
  return useQuery({
    queryKey: ["task", taskId],
    enabled: !!taskId,
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"].$get({
        param: { taskId: taskId! },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      const { data } = await response.json();
      return data;
    },
  });
};

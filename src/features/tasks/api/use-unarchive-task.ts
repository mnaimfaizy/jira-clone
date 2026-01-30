import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["unarchive"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["unarchive"]["$post"]
>;

export const useUnarchiveTask = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[":taskId"]["unarchive"]["$post"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to unarchive task");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task restored");
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
      queryClient.invalidateQueries({
        queryKey: ["task-board", data.workspaceId],
        exact: false,
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to restore task");
    },
  });
};

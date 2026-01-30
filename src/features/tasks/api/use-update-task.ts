import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.tasks[":taskId"]["$patch"]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task updated");
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
      queryClient.invalidateQueries({
        queryKey: ["task-board", data.workspaceId],
        exact: false,
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update task");
    },
  });
};

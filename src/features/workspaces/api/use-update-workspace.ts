import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$patch"]({
        form,
        param,
      });

      if (!response.ok) {
        let message = "Failed to update workspace";

        try {
          const body = await response.json();
          if (body && typeof body === "object" && "error" in body) {
            const maybeMessage = (body as { error?: unknown }).error;
            if (typeof maybeMessage === "string" && maybeMessage.length > 0) {
              message = maybeMessage;
            }
          }
        } catch {
          // ignore non-json
        }

        throw new Error(message);
      }

      return await response.json();
    },
    onSuccess: (_result, variables) => {
      toast.success("Workspace updated successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspaces", variables.param.workspaceId],
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Failed to update workspace");
    },
  });

  return mutation;
};

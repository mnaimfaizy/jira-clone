import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type ResponseType = InferResponseType<
  (typeof client.api.workspaces)["$post"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces["$post"]({ form });

      if (!response.ok) {
        let message = "Failed to create workspace";

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
    onSuccess: () => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "Failed to create workspace");
    },
  });

  return mutation;
};

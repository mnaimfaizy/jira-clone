import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>;
type RequestType = InferRequestType<(typeof client.api.auth.register)["$post"]>;

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      // Show the message from the server (different for email sent vs not sent)
      const response = data as { success?: boolean; message?: string };
      toast.success(response.message || "Registration successful!");

      queryClient.invalidateQueries({ queryKey: ["current"] });
      router.push("/");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to register. Please try again.");
    },
  });

  return mutation;
};

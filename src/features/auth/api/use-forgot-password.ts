import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["forgot-password"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["forgot-password"]["$post"]
>;

export const useForgotPassword = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["forgot-password"]["$post"]({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to send password reset email");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Password reset email sent! Check your inbox.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to send password reset email. Please try again.");
    },
  });

  return mutation;
};

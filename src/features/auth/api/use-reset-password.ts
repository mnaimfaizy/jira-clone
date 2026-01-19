import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["reset-password"]["$put"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["reset-password"]["$put"]
>;

export const useResetPassword = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["reset-password"]["$put"]({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success(
        "Password reset successful! You can now sign in with your new password.",
      );
      router.push("/sign-in");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to reset password. The link may have expired.");
    },
  });

  return mutation;
};

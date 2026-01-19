import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["verify-email"]["$put"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["verify-email"]["$put"]
>;

export const useVerifyEmail = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["verify-email"]["$put"]({ json });

      if (!response.ok) {
        throw new Error("Email verification failed");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Email verified successfully! You can now sign in.");
      router.push("/sign-in");
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        "Email verification failed. The link may be invalid or expired.",
      );
    },
  });

  return mutation;
};

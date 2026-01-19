import { useMutation } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.auth["resend-verification"]["$post"]>;

export const useResendVerification = () => {
    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.auth["resend-verification"]["$post"]();

            if(!response.ok) {
                throw new Error("Failed to resend verification email");
            }
            
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Verification email sent! Please check your inbox.");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to send verification email. Please make sure you're logged in.");
        }
    })

    return mutation;
}

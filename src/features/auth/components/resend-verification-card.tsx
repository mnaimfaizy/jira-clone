"use client";

import { DottedSeparator } from "@/components/dotted-separater";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useResendVerification } from "../api/use-resend-verification";
import { Mail } from "lucide-react";
import { useCurrent } from "../api/user-current";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const ResendVerificationCard = () => {
  const { mutate, isPending } = useResendVerification();
  const { data: user, isLoading } = useCurrent();
  const router = useRouter();

  useEffect(() => {
    // If user is not logged in, redirect to sign-in
    if (!isLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, isLoading, router]);

  const handleResend = () => {
    mutate();
  };

  if (isLoading) {
    return (
      <Card className="w-full h-full md:w-[487px] border-none shadow-none">
        <CardContent className="p-7">
          <p className="text-center">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <div className="flex items-center justify-center mb-2">
          <Mail className="h-12 w-12 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Resend Verification Email</CardTitle>
        <CardDescription>
          Click the button below to receive a new verification link
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Button
          onClick={handleResend}
          disabled={isPending}
          size="lg"
          className="w-full"
        >
          {isPending ? "Sending..." : "Send Verification Email"}
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <p className="text-sm text-center text-muted-foreground">
          Remember to check your spam folder if you don&apos;t see the email.
        </p>
        <p className="text-sm text-center">
          Back to{" "}
          <Link href="/sign-in">
            <span className="text-blue-700">Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

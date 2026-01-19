"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVerifyEmail } from "@/features/auth/api/use-verify-email";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const VerifyEmailCard = () => {
  const searchParams = useSearchParams();
  const { mutate, isPending, isSuccess, isError } = useVerifyEmail();
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    if (!hasAttempted) {
      const userId = searchParams.get("userId");
      const secret = searchParams.get("secret");

      if (userId && secret) {
        mutate({ json: { userId, secret } });
        setHasAttempted(true);
      }
    }
  }, [searchParams, mutate, hasAttempted]);

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Email Verification</CardTitle>
        <CardDescription>Verifying your email address</CardDescription>
      </CardHeader>
      <CardContent className="p-7">
        <div className="flex flex-col items-center justify-center space-y-4">
          {isPending && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-sm text-muted-foreground">
                Verifying your email...
              </p>
            </>
          )}

          {isSuccess && (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-600" />
              <p className="text-sm font-medium text-center">
                Your email has been verified successfully!
              </p>
              <p className="text-sm text-muted-foreground text-center">
                You can now sign in to your account.
              </p>
              <Button asChild className="w-full">
                <Link href="/sign-in">Go to Sign In</Link>
              </Button>
            </>
          )}

          {isError && !isPending && (
            <>
              <XCircle className="h-12 w-12 text-red-600" />
              <p className="text-sm font-medium text-center">
                Email verification failed
              </p>
              <p className="text-sm text-muted-foreground text-center">
                The verification link may be invalid or expired.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-up">Back to Sign Up</Link>
              </Button>
            </>
          )}

          {!hasAttempted && !isPending && (
            <>
              <XCircle className="h-12 w-12 text-yellow-600" />
              <p className="text-sm font-medium text-center">
                Invalid verification link
              </p>
              <p className="text-sm text-muted-foreground text-center">
                The verification link appears to be incomplete.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-up">Back to Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

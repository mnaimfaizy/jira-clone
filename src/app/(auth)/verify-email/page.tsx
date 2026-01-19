import { VerifyEmailCard } from "@/features/auth/components/verify-email-card";
import { Suspense } from "react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to activate your Jira Clone account.",
  robots: {
    index: false,
    follow: false,
  },
};

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailCard />
    </Suspense>
  );
};

export default VerifyEmailPage;

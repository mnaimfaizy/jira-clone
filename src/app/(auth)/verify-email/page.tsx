import { VerifyEmailCard } from "@/features/auth/components/verify-email-card";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailCard />
    </Suspense>
  );
};

export default VerifyEmailPage;

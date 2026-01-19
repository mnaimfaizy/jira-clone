import { ResendVerificationCard } from "@/features/auth/components/resend-verification-card";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resend Verification",
  description: "Resend your email verification link to activate your account.",
  robots: {
    index: false,
    follow: false,
  },
};

const ResendVerificationPage = () => {
  return <ResendVerificationCard />;
};

export default ResendVerificationPage;

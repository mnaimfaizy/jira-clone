import { getCurrent } from "@/features/auth/queries";
import { ResetPasswordCard } from "@/features/auth/components/reset-password-card";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    userId?: string;
    secret?: string;
  }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const user = await getCurrent();

  if (user) redirect("/");

  const params = await searchParams;
  const { userId, secret } = params;

  if (!userId || !secret) {
    redirect("/sign-in");
  }

  return <ResetPasswordCard userId={userId} secret={secret} />;
};

export default ResetPasswordPage;

import { getCurrent } from "@/features/auth/queries";
import { ForgotPasswordCard } from "@/features/auth/components/forgot-password-card";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

const ForgotPasswordPage = async () => {
  const user = await getCurrent();

  if (user) redirect("/");

  return <ForgotPasswordCard />;
};

export default ForgotPasswordPage;

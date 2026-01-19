import { getCurrent } from "@/features/auth/queries";
import { ForgotPasswordCard } from "@/features/auth/components/forgot-password-card";
import { redirect } from "next/navigation";
import React from "react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Jira Clone account password.",
  robots: {
    index: false,
    follow: false,
  },
};

const ForgotPasswordPage = async () => {
  const user = await getCurrent();

  if (user) redirect("/");

  return <ForgotPasswordCard />;
};

export default ForgotPasswordPage;

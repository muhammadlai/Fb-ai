import React, { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth, facebookConfigured } from "@/auth";
import { AuthForm } from "@/components/auth/AuthForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;

  if (session?.user) {
    redirect(callbackUrl || "/dashboard");
  }

  return (
    <Suspense>
      <AuthForm
        mode="register"
        facebookEnabled={facebookConfigured}
        callbackUrl={callbackUrl || "/dashboard"}
        initialError={error}
      />
    </Suspense>
  );
}

import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthHeader } from "../components/AuthHeader";
import { createMetadata } from "../../lib/seo";
import { ForgotPasswordForm } from "./reset-form";

export const metadata: Metadata = createMetadata({
  title: "Forgot Password | LaunchMind AI",
  description: "Reset your LaunchMind AI password with a secure email verification code.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-foreground">
      <AuthHeader />
      <section className="flex min-h-[calc(100vh-72px)] items-center px-4 py-8 sm:py-12">
        <div className="container-page flex w-full justify-center">
          <Card className="mx-auto w-full max-w-md border-border/90 bg-card/95">
            <CardHeader className="p-6 pb-3 text-center sm:p-7 sm:pb-3">
              <CardTitle className="text-3xl">Reset your password</CardTitle>
              <CardDescription>
                Request a code by email, then set a new password for your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 sm:p-7 sm:pt-0">
              <ForgotPasswordForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

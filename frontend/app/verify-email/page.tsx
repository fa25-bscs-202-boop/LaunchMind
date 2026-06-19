import type { Metadata } from "next";
import { Suspense } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { VerifyEmailForm } from "./verify-form";
import { createMetadata } from "../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Verify Your LaunchMind AI Email",
  description:
    "Verify your email address to finish setting up your LaunchMind AI workspace.",
  path: "/verify-email",
  noIndex: true,
});

function VerifyEmailLoadingFallback() {
  return (
    <main className="flex min-h-screen items-center bg-background px-4 py-8 text-foreground sm:py-12">
      <section className="container-page">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="items-center p-7 pb-3">
            <div className="size-12 animate-pulse rounded-full bg-white/10" />
            <div className="mt-3 h-8 w-3/4 animate-pulse rounded bg-white/10" />
          </CardHeader>
          <CardContent className="p-7 pt-0">
            <div className="h-12 w-full animate-pulse rounded-lg bg-white/10" />
            <div className="mt-4 h-11 w-full animate-pulse rounded-full bg-white/10" />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoadingFallback />}>
      <VerifyEmailForm />
    </Suspense>
  );
}

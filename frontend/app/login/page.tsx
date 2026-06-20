import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthHeader } from "../components/AuthHeader";
import { LoginForm } from "./LoginForm";
import { createMetadata } from "../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Log In to LaunchMind AI",
  description:
    "Log in to your LaunchMind AI account.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-foreground">
      <AuthHeader />
      <section className="flex min-h-[calc(100vh-72px)] items-center px-4 py-8 sm:py-12">
        <div className="container-page flex w-full justify-center">
          <Card className="mx-auto w-full max-w-md border-border/90 bg-card/95">
            <CardHeader className="p-6 pb-3 text-center sm:p-7 sm:pb-3">
              <CardTitle className="text-3xl">Welcome back</CardTitle>
              <CardDescription>
                Log in to access your LaunchMind account.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 sm:p-7 sm:pt-0">
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

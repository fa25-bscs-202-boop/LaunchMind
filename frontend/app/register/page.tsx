import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthHeader } from "../components/AuthHeader";
import { RegisterForm } from "./RegisterForm";
import { createMetadata } from "../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Create a LaunchMind AI Account",
  description:
    "Create a LaunchMind AI account to stay connected with the product.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-foreground">
      <AuthHeader />
      <section className="flex min-h-[calc(100vh-72px)] items-center px-4 py-8 sm:py-12">
        <div className="container-page flex w-full justify-center">
          <Card className="mx-auto w-full max-w-md border-border/90 bg-card/95">
            <CardHeader className="p-6 pb-3 text-center sm:p-7 sm:pb-3">
              <CardTitle className="text-3xl">Create your workspace</CardTitle>
              <CardDescription>
                Create your account to get started with LaunchMind.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 sm:p-7 sm:pt-0">
              <RegisterForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

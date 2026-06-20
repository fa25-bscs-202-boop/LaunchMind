"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { saveToken } from "../../../lib/auth";

export default function OAuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      router.replace("/oauth/error?message=Authentication failed");
      return;
    }

    saveToken(token);
    const nextPath = params.get("next");
    router.replace(
      nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
        ? nextPath
        : "/dashboard",
    );
  }, [router]);

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] px-4 py-20 text-[var(--text)] sm:py-28">
      <section className="container-page">
        <div className="animate-fade-up hover-lift mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-8 text-center shadow-xl shadow-black/20">
          <p className="text-sm font-medium text-[var(--accent)]">LaunchMind AI</p>
          <h1 className="mt-4 text-2xl font-bold tracking-[-0.03em]">Signing you in...</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Please wait while we prepare your workspace.
          </p>
        </div>
      </section>
    </main>
  );
}


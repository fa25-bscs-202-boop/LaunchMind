import { Suspense } from "react";
import { VerifyEmailForm } from "./verify-form";

function VerifyEmailLoadingFallback() {
  return (
    <main className="animate-fade-up flex min-h-screen items-center bg-[var(--background)] px-4 py-6 text-[var(--text)] sm:py-8">
      <section className="container-page">
        <div className="animate-fade-up hover-lift mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-xl shadow-black/20 sm:p-7">
          <div className="h-6 w-24 animate-pulse rounded bg-[var(--muted)]" />
          <div className="mt-6 h-8 w-3/4 animate-pulse rounded bg-[var(--muted)]" />
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-[var(--muted)]" />
        </div>
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






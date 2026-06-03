"use client";

import Link from "next/link";

export default function OAuthErrorPage() {
  const message = "Authentication failed. Please try again.";

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] px-4 py-20 text-[var(--text)] sm:py-28">
      <section className="container-page">
        <div className="animate-fade-up hover-lift mx-auto max-w-md rounded-2xl border border-red-500/20 bg-[var(--surface-soft)] p-8 text-center shadow-xl shadow-black/20">
          <p className="text-sm font-medium text-red-200">Sign-in issue</p>
          <h1 className="mt-4 text-2xl font-bold tracking-[-0.03em]">{message}</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Your Google or GitHub sign-in could not be completed.
          </p>
          <Link href="/login" className="btn-primary mt-7 w-full">
            Back to login
          </Link>
        </div>
      </section>
    </main>
  );
}






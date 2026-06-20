import type { Metadata } from "next";

import { createMetadata } from "../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service | LaunchMind AI",
  description: "Review the terms for using LaunchMind AI and its startup planning tools.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-16 text-[var(--text)] sm:py-24">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold sm:text-5xl">Terms of Service</h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-[var(--muted)] sm:text-base">
          <p>
            LaunchMind AI provides planning and drafting tools to support idea validation, startup planning, and related workflows. You are responsible for reviewing generated outputs before using them in business, academic, legal, or financial contexts.
          </p>
          <p>
            You agree not to misuse the service, attempt unauthorized access, or submit unlawful content. We may limit or suspend access to protect the platform and other users.
          </p>
          <p>
            The service is provided on an as-available basis. We work to keep it reliable, but we cannot guarantee uninterrupted access or error-free outputs.
          </p>
          <p>
            Continued use of LaunchMind AI means you accept these terms and any future updates posted on this page.
          </p>
        </div>
      </div>
    </main>
  );
}

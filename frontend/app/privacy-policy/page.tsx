import type { Metadata } from "next";

import { createMetadata } from "../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy | LaunchMind AI",
  description: "Read how LaunchMind AI handles account data, generated content, and website usage information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-16 text-[var(--text)] sm:py-24">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-[var(--muted)] sm:text-base">
          <p>
            LaunchMind AI collects the information needed to create your account, keep you signed in, and generate
            startup planning outputs you request inside the product.
          </p>
          <p>
            We may store your name, email address, login activity, and the content you submit for idea analysis,
            reports, pitch decks, SWOT analysis, competitor research, and MVP planning.
          </p>
          <p>
            We use this information to operate the service, improve reliability, respond to support requests, and keep
            accounts secure. We do not sell your personal information.
          </p>
          <p>
            If you need your account data removed or have privacy questions, contact the LaunchMind team through the
            website contact page.
          </p>
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";

import { createMetadata } from "../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "FAQ | LaunchMind AI",
  description: "Read common questions about LaunchMind AI accounts, planning tools, and support.",
  path: "/faq",
});

const faqs = [
  {
    question: "What does LaunchMind help me create?",
    answer:
      "LaunchMind helps you turn an early startup idea into structured planning outputs such as analysis summaries, feasibility reports, pitch direction, competitor research, SWOT analysis, and MVP planning.",
  },
  {
    question: "Do I need an account to use the workspace?",
    answer:
      "Yes. The protected workspace requires an account so your idea analyses and generated planning documents stay tied to your own history.",
  },
  {
    question: "Can I start with one idea and reuse it everywhere?",
    answer:
      "Yes. The workspace is designed so a single saved idea analysis can be reused across the later planning steps instead of rewriting the same context every time.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Use the Forgot password link on the login page. LaunchMind will send a verification code so you can set a new password securely.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-16 text-[var(--text)] sm:py-24">
      <div className="container-page max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">FAQ</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Common questions, answered clearly.</h1>
        <div className="mt-10 grid gap-4">
          {faqs.map((faq) => (
            <section key={faq.question} className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-6">
              <h2 className="text-lg font-semibold text-[var(--text)]">{faq.question}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)] sm:text-base">{faq.answer}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

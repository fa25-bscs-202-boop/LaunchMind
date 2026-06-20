import type { Metadata } from "next";

import { JsonLd } from "../components/JsonLd";
import { createMetadata } from "../../lib/seo";
import { breadcrumbSchema } from "../../lib/structured-data";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = createMetadata({
  title: "Contact LaunchMind AI | Support and Company Contact",
  description: "Contact LaunchMind AI for support, product questions, feedback, or partnership inquiries.",
  path: "/contact",
  keywords: ["contact LaunchMind AI", "LaunchMind support", "product contact"],
});

export default function ContactPage() {
  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <p className="text-sm font-semibold uppercase text-[var(--accent)]">Contact</p>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Talk to the LaunchMind team.</h1>
            <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
              Send a question, partnership note, or feedback request.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}

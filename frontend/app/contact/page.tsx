"use client";

import { type FormEvent, useState } from "react";
// Navbar is provided globally in layout

export default function ContactPage() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Contact form is not connected yet.");
  }

  return (
    <main className="animate-fade-up min-h-screen bg-[var(--background)] text-[var(--text)]">
      <section className="px-4 py-20 sm:py-28">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Contact
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
              Talk to the LaunchMind team.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Send a question, partnership note, or feedback request.
            </p>
          </div>

          <form
            className="animate-fade-up hover-lift rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-7 shadow-xl shadow-black/20 sm:p-9"
            onSubmit={handleSubmit}
          >
            <label className="block text-sm font-medium text-[var(--text)]" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
            />

            <label className="mt-5 block text-sm font-medium text-[var(--text)]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
            />

            <label className="mt-5 block text-sm font-medium text-[var(--text)]" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="mt-2 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
            />

            {message ? (
              <div className="mt-6 rounded-2xl border border-[rgba(212,175,55,0.2)] bg-[var(--surface)] p-4 text-sm text-[var(--accent)]">
                {message}
              </div>
            ) : null}

            <button type="submit" className="btn-primary mt-7 w-full">
              Send message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}








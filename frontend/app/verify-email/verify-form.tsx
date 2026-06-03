"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { resendVerificationCode, verifyEmail } from "../../lib/auth";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") ?? "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("Invalid code. Enter the 6 digit verification code.");
      return;
    }

    try {
      setIsVerifying(true);
      await verifyEmail(email, code);
      setMessage("Email verified successfully.");
      window.setTimeout(() => router.push("/login"), 700);
    } catch (err) {
      const message = err instanceof Error ? err.message.toLowerCase() : "";

      if (message.includes("expired")) {
        setError("Code expired. Please request a new code.");
      } else if (message.includes("invalid")) {
        setError("Invalid code. Please check the code and try again.");
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    try {
      setIsResending(true);
      const response = await resendVerificationCode(email);
      setMessage(response.message);
    } catch {
      setError("We could not resend the code right now. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <main className="animate-fade-up flex min-h-screen items-center bg-[var(--background)] px-4 py-6 text-[var(--text)] sm:py-8">
      <section className="container-page">
        <div className="animate-fade-up hover-lift mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 shadow-xl shadow-black/20 sm:p-7">
          <Link href="/" className="text-sm font-semibold text-[var(--text)]">
            LaunchMind AI
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-[-0.04em]">
            Verify your email.
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Enter the 6 digit code sent to {email ? <span className="text-[var(--text)]">{email}</span> : "your Gmail address"}.
          </p>

          <form className="mt-6" onSubmit={handleVerify} noValidate>
            <label className="block text-sm font-medium text-[var(--text)]" htmlFor="code">
              Verification code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-center text-2xl font-semibold text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[rgba(212,175,55,0.55)] focus:ring-2 focus:ring-[rgba(212,175,55,0.18)]"
            />

            {error ? (
              <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="mt-4 rounded-2xl border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.08)] px-4 py-3 text-sm text-[var(--text)]">
                {message}
              </p>
            ) : null}

            <button type="submit" className="btn-primary mt-5 w-full" disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify email"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleResend}
            className="btn-secondary mt-3 w-full"
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>

          <p className="mt-5 text-center text-sm text-[var(--muted)]">
            Already verified?{" "}
            <Link href="/login" className="font-medium text-[var(--accent)] transition hover:text-[#e0c35a]">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { API_BASE_URL } from "../../lib/api";
import { registerUser } from "../../lib/auth";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function redirectToOAuth(provider: "google" | "github") {
    window.location.href = `${API_BASE_URL}/auth/${provider}/login`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await registerUser(name, email, password);
      router.push(`/verify-email?email=${encodeURIComponent(response.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => redirectToOAuth("google")}
          className="btn-secondary w-full gap-2"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => redirectToOAuth("github")}
          className="btn-secondary w-full gap-2"
        >
          Continue with GitHub
        </button>
      </div>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
        <span className="h-px flex-1 bg-[var(--border)]" />
        <span>Email signup</span>
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <label className="block text-sm font-medium text-[var(--text)]" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
        />

        <label className="mt-4 block text-sm font-medium text-[var(--text)]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
        />

        <label className="mt-4 block text-sm font-medium text-[var(--text)]" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[rgba(212,175,55,0.45)]"
        />

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn-primary mt-5 w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-5 text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[var(--accent)] transition hover:text-[#e0c35a]">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}






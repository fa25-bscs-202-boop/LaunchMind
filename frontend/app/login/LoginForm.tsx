"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Globe, Lock, Mail } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { loginUser } from "../../lib/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function redirectToOAuth(provider: "google") {
    window.location.href = `/auth/${provider}/login`;
  }

  function validateForm() {
    const nextErrors = { email: "", password: "" };
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setFieldErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await loginUser(email.trim(), password);
      const nextPath = searchParams.get("next");
      router.push(nextPath && nextPath.startsWith("/") ? nextPath : "/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setError(message === "Email already registered" ? "This email is already registered. Try logging in instead." : message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-7">
      <div className="grid gap-3">
        <Button
          type="button"
          onClick={() => redirectToOAuth("google")}
          variant="secondary"
          className="w-full"
        >
          <Globe className="size-4" aria-hidden="true" />
          Continue with Google
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase text-muted-foreground">
        <Separator className="flex-1" />
        <span>Email login</span>
        <Separator className="flex-1" />
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldErrors((current) => ({ ...current, email: "" }));
              }}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              autoComplete="email"
              placeholder="you@example.com"
              className="pl-10"
            />
          </div>
          {fieldErrors.email ? (
            <p id="email-error" className="text-sm leading-5 text-red-200">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setFieldErrors((current) => ({ ...current, password: "" }));
              }}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="pl-10"
            />
          </div>
          {fieldErrors.password ? (
            <p id="password-error" className="text-sm leading-5 text-red-200">
              {fieldErrors.password}
            </p>
          ) : null}
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" className="mt-1 w-full" isLoading={isLoading} loadingText="Continuing...">
          Continue
        </Button>

        <div className="text-center text-sm">
          <Link
            href="/forgot-password"
            className="inline-flex min-h-11 items-center justify-center rounded-full px-4 font-medium text-primary transition hover:text-primary/85"
          >
            Forgot password?
          </Link>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          New to LaunchMind?{" "}
          <Link
            href="/register"
            className="inline-flex min-h-11 items-center justify-center rounded-full px-2 font-medium text-primary transition hover:text-primary/85"
          >
            Create an account
          </Link>
        </p>

        <p className="text-center text-xs leading-5 text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="font-medium text-primary transition hover:text-primary/85">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-primary transition hover:text-primary/85">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Globe, Lock, Mail, UserRound } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { API_BASE_URL } from "../../lib/api";
import { registerUser } from "../../lib/auth";

type FieldErrors = {
  name: string;
  email: string;
  password: string;
};

const emptyFieldErrors: FieldErrors = {
  name: "",
  email: "",
  password: "",
};

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(emptyFieldErrors);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function redirectToOAuth(provider: "google") {
    window.location.href = `${API_BASE_URL}/auth/${provider}/login`;
  }

  function validateForm() {
    const nextErrors: FieldErrors = { ...emptyFieldErrors };
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if (!normalizedName) {
      nextErrors.name = "Name is required.";
    } else if (normalizedName.length < 2) {
      nextErrors.name = "Enter at least 2 characters.";
    }

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
    return !nextErrors.name && !nextErrors.email && !nextErrors.password;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await registerUser(name.trim(), email.trim(), password);
      router.push(`/verify-email?email=${encodeURIComponent(response.email)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed.";
      setError(
        message === "Email already registered"
          ? "An account may already exist for this email. Try logging in or use a different email."
          : message,
      );
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
        <span>Email signup</span>
        <Separator className="flex-1" />
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <UserRound
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setFieldErrors((current) => ({ ...current, name: "" }));
              }}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              autoComplete="name"
              placeholder="Your name"
              className="pl-10"
            />
          </div>
          {fieldErrors.name ? (
            <p id="name-error" className="text-sm leading-5 text-red-200">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

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
              aria-describedby={fieldErrors.password ? "password-error" : "password-help"}
              autoComplete="new-password"
              placeholder="Create a password"
              className="pl-10"
            />
          </div>
          {fieldErrors.password ? (
            <p id="password-error" className="text-sm leading-5 text-red-200">
              {fieldErrors.password}
            </p>
          ) : (
            <p id="password-help" className="text-sm leading-5 text-muted-foreground">
              Use at least 8 characters.
            </p>
          )}
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" className="mt-1 w-full" isLoading={isLoading} loadingText="Creating account...">
          Create account
        </Button>

        <p className="text-center text-xs leading-5 text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="font-medium text-primary transition hover:text-primary/85">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-primary transition hover:text-primary/85">
            Privacy Policy
          </Link>
          .
        </p>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-full px-2 font-medium text-primary transition hover:text-primary/85"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

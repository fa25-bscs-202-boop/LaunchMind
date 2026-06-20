"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword, resetPassword } from "../../lib/auth";

type FieldErrors = {
  email: string;
  code: string;
  password: string;
};

const emptyFieldErrors: FieldErrors = {
  email: "",
  code: "",
  password: "",
};

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(emptyFieldErrors);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  function validateEmailOnly() {
    const nextErrors = { ...emptyFieldErrors };

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    setFieldErrors((current) => ({ ...current, email: nextErrors.email }));
    return !nextErrors.email;
  }

  function validateReset() {
    const nextErrors = { ...emptyFieldErrors };

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!/^\d{6}$/.test(code)) {
      nextErrors.code = "Enter the 6 digit code sent to your email.";
    }

    if (!password) {
      nextErrors.password = "New password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(nextErrors);
    return !nextErrors.email && !nextErrors.code && !nextErrors.password;
  }

  async function handleSendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!validateEmailOnly()) {
      return;
    }

    try {
      setIsSending(true);
      const response = await forgotPassword(email.trim());
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not send a reset code right now.");
    } finally {
      setIsSending(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!validateReset()) {
      return;
    }

    try {
      setIsResetting(true);
      const response = await resetPassword(email.trim(), code, password);
      setMessage(response.message);
      setCode("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset failed. Please try again.");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <form className="grid gap-4" onSubmit={handleSendCode} noValidate>
        <div className="grid gap-2">
          <Label htmlFor="reset-email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldErrors((current) => ({ ...current, email: "" }));
              }}
              placeholder="you@gmail.com"
              className="pl-10"
              aria-invalid={Boolean(fieldErrors.email)}
            />
          </div>
          {fieldErrors.email ? <p className="text-sm leading-5 text-red-200">{fieldErrors.email}</p> : null}
        </div>

        <Button type="submit" variant="secondary" className="w-full" isLoading={isSending} loadingText="Sending code...">
          Send reset code
        </Button>
      </form>

      <form className="grid gap-4 border-t border-border pt-6" onSubmit={handleResetPassword} noValidate>
        <div className="grid gap-2">
          <Label htmlFor="reset-code">Reset code</Label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="reset-code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                setFieldErrors((current) => ({ ...current, code: "" }));
              }}
              placeholder="123456"
              inputMode="numeric"
              maxLength={6}
              className="pl-10"
              aria-invalid={Boolean(fieldErrors.code)}
            />
          </div>
          {fieldErrors.code ? <p className="text-sm leading-5 text-red-200">{fieldErrors.code}</p> : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="new-password">New password</Label>
          <div className="relative">
            <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setFieldErrors((current) => ({ ...current, password: "" }));
              }}
              placeholder="Create a new password"
              className="pl-10"
              aria-invalid={Boolean(fieldErrors.password)}
            />
          </div>
          {fieldErrors.password ? (
            <p className="text-sm leading-5 text-red-200">{fieldErrors.password}</p>
          ) : (
            <p className="text-sm leading-5 text-muted-foreground">Use at least 6 characters.</p>
          )}
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {message ? (
          <Alert variant="success">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" className="w-full" isLoading={isResetting} loadingText="Updating password...">
          Update password
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-primary transition hover:text-primary/85">
          Back to login
        </Link>
      </p>
    </div>
  );
}

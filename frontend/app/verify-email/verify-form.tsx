"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { KeyRound, MailCheck, Send } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <main className="flex min-h-screen items-center bg-background px-4 py-8 text-foreground sm:py-12">
      <section className="container-page">
        <Card className="mx-auto w-full max-w-md border-border/90 bg-card/95">
          <CardHeader className="p-6 pb-3 text-center sm:p-7 sm:pb-3">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
              <MailCheck className="size-5" aria-hidden="true" />
            </div>
            <CardTitle className="text-3xl">Verify your email</CardTitle>
            <CardDescription>
              Enter the 6 digit code sent to{" "}
              {email ? <span className="text-foreground">{email}</span> : "your email address"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 sm:p-7 sm:pt-0">
            <form className="grid gap-4" onSubmit={handleVerify} noValidate>
              <div className="grid gap-2">
                <Label htmlFor="code">Verification code</Label>
                <div className="relative">
                  <KeyRound
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    aria-invalid={Boolean(error)}
                    className="pl-10 text-center text-xl font-semibold tracking-normal"
                  />
                </div>
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

              <Button type="submit" className="w-full" isLoading={isVerifying} loadingText="Verifying...">
                Verify email
              </Button>
            </form>

            <Button
              type="button"
              onClick={handleResend}
              variant="secondary"
              className="mt-3 w-full"
              isLoading={isResending}
              loadingText="Sending..."
            >
              <Send className="size-4" aria-hidden="true" />
              Resend code
            </Button>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already verified?{" "}
              <Link href="/login" className="font-medium text-primary transition hover:text-primary/85">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

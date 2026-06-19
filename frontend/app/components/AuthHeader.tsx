import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AuthHeader() {
  return (
    <header className="border-b border-border bg-background/88 backdrop-blur-xl">
      <nav className="container-page flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="text-base font-bold text-foreground sm:text-lg">
          LaunchMind AI
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}

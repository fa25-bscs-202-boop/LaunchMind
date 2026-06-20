"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HomeStickyNav() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  function toggleMenu() {
    setIsOpen((current) => !current);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgba(8,8,8,0.86)] backdrop-blur-xl">
      <nav className="container-page flex min-h-[72px] items-center justify-between gap-3 py-3">
        <Link
          href="/"
          className="min-w-0 truncate text-lg font-bold leading-none text-[var(--text)] sm:text-lg"
          onClick={closeMenu}
        >
          <span className="sm:hidden">LaunchMind</span>
          <span className="hidden sm:inline">LaunchMind AI</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          <Link href="#features" className="nav-link">
            Features
          </Link>
          <Link href="/pricing" className="nav-link">
            Pricing
          </Link>
          <Link href="/login" className="nav-link">
            Login
          </Link>
          <Link href="/register" className="btn-primary">
            Get Started
          </Link>
        </div>

        <div className="shrink-0 md:hidden">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-11"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close homepage menu" : "Open homepage menu"}
          >
            {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </Button>
        </div>
      </nav>

      {isOpen ? (
        <div className="border-t border-[var(--border)] bg-[rgba(8,8,8,0.96)] px-4 pb-5 pt-4 md:hidden">
          <div className="container-page flex flex-col gap-2">
            <Link
              href="#features"
              className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-[rgba(212,175,55,0.08)]"
              onClick={closeMenu}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-[rgba(212,175,55,0.08)]"
              onClick={closeMenu}
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-[rgba(212,175,55,0.08)]"
              onClick={closeMenu}
            >
              Login
            </Link>
            <Link href="/register" className="btn-primary mt-2 w-full text-center" onClick={closeMenu}>
              Get Started
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const siteLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  function toggleMenu() {
    setIsOpen((current) => !current);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-xl">
      <nav className="container-page flex min-h-[72px] items-center justify-between gap-4 py-3">
        <Link href="/" className="text-lg font-bold text-foreground" onClick={closeMenu}>
          LaunchMind AI
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition",
                pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-11"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </Button>
        </div>
      </nav>

      {isOpen ? (
        <div className="border-t border-border bg-background/98 px-4 pb-5 pt-4 md:hidden">
          <div className="container-page flex flex-col gap-2">
            {siteLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium transition",
                  pathname === link.href
                    ? "bg-primary/10 text-foreground"
                    : "text-foreground hover:bg-primary/10",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={closeMenu} className="rounded-lg px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary/10">
              Login
            </Link>
            <Link href="/register" onClick={closeMenu} className="btn-primary mt-2 w-full text-center">
              Get Started
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

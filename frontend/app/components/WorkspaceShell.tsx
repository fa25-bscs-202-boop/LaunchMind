"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const workspaceLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analyze", label: "Analyze" },
  { href: "/feasibility", label: "Feasibility" },
  { href: "/pitch-deck", label: "Pitch Deck" },
  { href: "/swot", label: "SWOT" },
  { href: "/competitor", label: "Competitor" },
  { href: "/mvp-planner", label: "MVP Planner" },
];

export function WorkspaceShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-foreground sm:py-10">
      <div className="container-page">
        <div className="mb-6 flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 w-fit items-center text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            ← Dashboard
          </Link>
          <div className="flex flex-wrap gap-2">
            {workspaceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-sm font-medium transition",
                  pathname === link.href
                    ? "border-primary/45 bg-primary/12 text-foreground"
                    : "border-border bg-card/70 text-muted-foreground hover:border-primary/35 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}

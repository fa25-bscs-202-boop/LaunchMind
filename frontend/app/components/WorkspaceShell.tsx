"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Boxes, FileText, LayoutDashboard, LogOut, Presentation, Radar, ShieldCheck } from "lucide-react";

import { getCurrentUser, logoutUser, type User } from "@/lib/auth";
import { cn } from "@/lib/utils";

const workspaceLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyze", label: "Analyze", icon: Radar },
  { href: "/feasibility", label: "Feasibility", icon: FileText },
  { href: "/pitch-deck", label: "Pitch Deck", icon: Presentation },
  { href: "/swot", label: "SWOT", icon: BarChart3 },
  { href: "/competitor", label: "Competitor", icon: ShieldCheck },
  { href: "/mvp-planner", label: "MVP Planner", icon: Boxes },
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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const initials = useMemo(() => {
    const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "U";
    return displayName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [user]);

  function handleLogout() {
    logoutUser();
    router.replace("/login");
  }

  function renderAccountBox() {
    return (
      <div className="rounded-lg border border-border bg-card/80 p-4 shadow-sm shadow-black/10">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/12 text-sm font-bold text-primary">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{user?.name || "Account"}</p>
            <p className="truncate text-xs leading-5 text-muted-foreground">{user?.email || "Signed in"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background/40 px-3 text-sm font-semibold text-muted-foreground transition hover:border-primary/35 hover:bg-primary/10 hover:text-foreground"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border bg-background/96 px-5 py-6 backdrop-blur-xl lg:flex lg:flex-col">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight text-foreground">
          LaunchMind AI
        </Link>

        <nav className="mt-9 grid gap-2" aria-label="Workspace navigation">
          {workspaceLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-lg border px-4 text-sm font-semibold transition",
                  isActive
                    ? "border-primary/35 bg-primary/12 text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-card/70 hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">{renderAccountBox()}</div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/92 px-4 py-3 backdrop-blur-xl lg:hidden">
          <Link href="/dashboard" className="text-lg font-bold text-foreground">
            LaunchMind AI
          </Link>
          <nav className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1" aria-label="Workspace navigation">
            {workspaceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border px-4 text-sm font-medium transition",
                  pathname === link.href
                    ? "border-primary/45 bg-primary/12 text-foreground"
                    : "border-border bg-card/70 text-muted-foreground hover:border-primary/35 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3">{renderAccountBox()}</div>
        </header>

        <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10 xl:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

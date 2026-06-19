"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isUnauthorizedError } from "../../lib/api";
import { getCurrentUser, hasStoredUserToken, logoutUser, type User } from "../../lib/auth";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "AI Tools", href: "/ai-tools" },
  { label: "Startup Ideas", href: "/startup-idea-generator" },
  { label: "Resume Builder", href: "/ai-resume-builder" },
  { label: "Blog", href: "/blog" },
  { label: "Jobs", href: "/jobs" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/login" },
];

const appLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analyses", href: "/dashboard/analyses" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "Pitch", href: "/dashboard/pitch" },
  { label: "SWOT", href: "/dashboard/swot" },
  { label: "MVP", href: "/dashboard/mvp" },
  { label: "Competitors", href: "/dashboard/competitors" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      if (!hasStoredUserToken()) {
        setHasToken(false);
        setUser(null);
        return;
      }

      setHasToken(true);

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        if (isUnauthorizedError(error)) {
          logoutUser();
          setHasToken(false);
          setUser(null);
          return;
        }

        setUser(null);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  useEffect(() => {
    return () => {
      document.body.classList.remove("sidebar-open");
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [isMobileMenuOpen]);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen((current) => !current);
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    setHasToken(false);
    closeMobileMenu();
    router.push("/login");
  }

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const links = hasToken || isDashboardRoute ? appLinks : publicLinks;

  function isActiveLink(href: string) {
    if (!hasToken && !isDashboardRoute) {
      return pathname === href;
    }

    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const displayName = user?.name || "Account";
  const initial = displayName.charAt(0).toUpperCase() || "A";

  const navList = (
    <nav className="space-y-1 text-sm font-medium" aria-label="Primary">
      {links.map((link) => {
        const isActive = isActiveLink(link.href);

        return (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "block rounded-lg px-4 py-3 transition duration-200",
              isActive
                ? "bg-primary/15 text-foreground"
                : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  const accountPanel = hasToken ? (
    <div className="space-y-3 rounded-lg border border-border bg-secondary p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
          {user?.email ? <p className="truncate text-xs text-muted-foreground">{user.email}</p> : null}
        </div>
      </div>

      <Button type="button" variant="destructive" className="w-full" onClick={handleLogout}>
        <LogOut className="size-4" aria-hidden="true" />
        Logout
      </Button>
    </div>
  ) : (
    <div className="grid gap-3">
      <Button asChild variant="secondary" className="w-full">
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild className="w-full">
        <Link href="/register">Register</Link>
      </Button>
    </div>
  );

  return (
    <>
      <aside className="fixed bottom-4 left-0 top-4 z-50 hidden w-[280px] flex-col gap-6 overflow-y-auto border-r border-border bg-background/96 px-5 py-6 text-foreground backdrop-blur-xl lg:flex">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={hasToken || isDashboardRoute ? "/dashboard" : "/"}
            className="text-lg font-semibold text-foreground transition-colors duration-200 hover:text-white"
          >
            LaunchMind AI
          </Link>
        </div>

        {navList}

        <div className="mt-auto">{accountPanel}</div>
      </aside>

      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 border-b border-border bg-background/92 px-4 py-4 text-foreground backdrop-blur-xl lg:hidden">
        <Link
          href={hasToken || isDashboardRoute ? "/dashboard" : "/"}
          className="text-base font-semibold text-foreground"
        >
          LaunchMind AI
        </Link>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </Button>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={toggleMobileMenu}
            aria-label="Close sidebar"
          />
          <aside className="relative z-10 flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-6 overflow-y-auto border-r border-border bg-background/96 px-5 py-6 text-foreground backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <Link
                href={hasToken || isDashboardRoute ? "/dashboard" : "/"}
                className="text-lg font-semibold text-foreground"
              >
                LaunchMind AI
              </Link>
              <Button type="button" variant="secondary" size="icon" onClick={toggleMobileMenu} aria-label="Close sidebar">
                <X className="size-5" aria-hidden="true" />
              </Button>
            </div>

            {navList}

            <div className="mt-auto">{accountPanel}</div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

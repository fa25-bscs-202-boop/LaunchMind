"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isUnauthorizedError } from "../../lib/api";
import { getCurrentUser, getToken, logoutUser, type User } from "../../lib/auth";

const publicLinks = [
  { label: "Home", href: "/" },
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

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 text-[var(--muted)] transition-transform duration-[180ms] ease-out ${
        isOpen ? "rotate-180" : "rotate-0"
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const token = getToken();

      if (!token) {
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
    closeProfileMenu();
    closeMobileMenu();
  }, [pathname]);

  function closeProfileMenu() {
    setIsProfileOpen(false);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function toggleProfileMenu() {
    setIsProfileOpen((current) => !current);
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen((current) => !current);
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    setHasToken(false);
    closeProfileMenu();
    closeMobileMenu();
    router.push("/login");
  }

  const links = hasToken ? appLinks : publicLinks;

  function isActiveLink(href: string) {
    if (!hasToken) {
      return pathname === href;
    }

    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const displayName = user?.name || "Account";
  const initial = displayName.charAt(0).toUpperCase() || "A";

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

  return (
    <>
      <aside className="fixed top-4 bottom-4 left-0 z-50 hidden w-[280px] flex-col gap-6 overflow-y-auto border-r border-[var(--border)] bg-[rgba(8,8,8,0.96)] px-5 py-6 text-[var(--text)] backdrop-blur-xl lg:flex">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={hasToken ? "/dashboard" : "/"}
            className="text-lg font-semibold tracking-[-0.02em] text-[var(--text)] transition-colors duration-[180ms] ease-out hover:text-[#f8f8f8]"
          >
            LaunchMind AI
          </Link>
        </div>

        <div className="space-y-1 text-sm font-medium">
          {links.map((link) => {
            const isActive = isActiveLink(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`block rounded-2xl px-4 py-3 transition duration-[180ms] ease-out ${
                  isActive
                    ? "bg-[rgba(212,175,55,0.14)] text-[var(--text)]"
                    : "text-[var(--muted)] hover:bg-[rgba(212,175,55,0.08)] hover:text-[var(--text)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto space-y-4">
          {hasToken ? (
            <div className="space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-[#080808]">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text)]">{displayName}</p>
                  {user?.email ? (
                    <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-full border border-transparent bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100 transition duration-[180ms] ease-out hover:bg-red-500/20"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/login"
                className="block rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--text)] transition duration-[180ms] ease-out hover:bg-[rgba(212,175,55,0.08)] hover:text-[var(--text)]"
              >
                Login
              </Link>
              <Link href="/register" className="btn-primary block rounded-full px-4 py-3 text-center text-sm font-semibold">
                Register
              </Link>
            </div>
          )}
        </div>
      </aside>

      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[rgba(8,8,8,0.92)] px-4 py-4 text-[var(--text)] lg:hidden">
        <Link
          href={hasToken ? "/dashboard" : "/"}
          className="text-base font-semibold tracking-[-0.02em] text-[var(--text)]"
        >
          LaunchMind AI
        </Link>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition duration-[180ms] ease-out hover:border-[rgba(212,175,55,0.35)] hover:bg-[var(--surface-soft)]"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isMobileMenuOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={toggleMobileMenu}
            aria-label="Close sidebar"
          />
          <aside className="relative z-10 flex w-72 flex-col gap-6 overflow-y-auto border-r border-[var(--border)] bg-[rgba(8,8,8,0.96)] px-5 py-6 text-[var(--text)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <Link
                href={hasToken ? "/dashboard" : "/"}
                className="text-lg font-semibold tracking-[-0.02em] text-[var(--text)]"
              >
                LaunchMind AI
              </Link>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition duration-[180ms] ease-out hover:border-[rgba(212,175,55,0.35)] hover:bg-[var(--surface-soft)]"
                onClick={toggleMobileMenu}
                aria-label="Close sidebar"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="space-y-1 text-sm font-medium">
              {links.map((link) => {
                const isActive = isActiveLink(link.href);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`block rounded-2xl px-4 py-3 transition duration-[180ms] ease-out ${
                      isActive
                        ? "bg-[rgba(212,175,55,0.14)] text-[var(--text)]"
                        : "text-[var(--muted)] hover:bg-[rgba(212,175,55,0.08)] hover:text-[var(--text)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto space-y-4">
              {hasToken ? (
                <div className="space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-[#080808]">
                      {initial}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--text)]">{displayName}</p>
                      {user?.email ? (
                        <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-full border border-transparent bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100 transition duration-[180ms] ease-out hover:bg-red-500/20"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--text)] transition duration-[180ms] ease-out hover:bg-[rgba(212,175,55,0.08)] hover:text-[var(--text)]"
                  >
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary block rounded-full px-4 py-3 text-center text-sm font-semibold">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}





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
  const [shouldRenderProfileMenu, setShouldRenderProfileMenu] = useState(false);

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
  }, [pathname]);

  useEffect(() => {
    if (isProfileOpen) {
      setShouldRenderProfileMenu(true);
      return;
    }

    const timeout = window.setTimeout(() => setShouldRenderProfileMenu(false), 180);
    return () => window.clearTimeout(timeout);
  }, [isProfileOpen]);

  function closeProfileMenu() {
    setIsProfileOpen(false);
  }

  function toggleProfileMenu() {
    setIsProfileOpen((current) => !current);
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    setHasToken(false);
    closeProfileMenu();
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

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(8,8,8,0.82)] backdrop-blur-md">
      <nav className="container-page flex h-[72px] items-center justify-between">
        <Link
          href={hasToken ? "/dashboard" : "/"}
          className="text-[1.05rem] font-bold tracking-[-0.02em] text-[var(--text)] transition-colors duration-[180ms] ease-out hover:text-[#f8f8f8]"
        >
          LaunchMind AI
        </Link>

        <div className="hidden items-center gap-3 text-sm font-medium lg:flex xl:gap-5">
          {links.map((link) => {
            const isActive = isActiveLink(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`group relative pb-1.5 transition-colors duration-[180ms] ease-out ${
                  isActive ? "text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-center rounded-full bg-[var(--accent)] transition-all duration-[180ms] ease-out ${
                    isActive
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0 group-hover:scale-x-75 group-hover:opacity-45"
                  }`}
                />
              </Link>
            );
          })}

          {hasToken ? (
            <div className="relative flex items-center">
              <button
                type="button"
                className="group flex h-11 items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-sm text-[var(--text)] transition-[background-color,border-color,transform] duration-[180ms] ease-out hover:-translate-y-px hover:border-[rgba(212,175,55,0.35)] hover:bg-[var(--surface-soft)] active:translate-y-0 active:scale-[0.99]"
                onClick={toggleProfileMenu}
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-[#080808] transition duration-[180ms] ease-out group-hover:brightness-110">
                  {initial}
                </span>
                <span className="max-w-28 truncate font-medium leading-none">
                  {displayName}
                </span>
                <ChevronDownIcon isOpen={isProfileOpen} />
              </button>

              {shouldRenderProfileMenu ? (
                <div
                  className={`absolute right-0 top-[calc(100%+12px)] w-[280px] origin-top-right rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 shadow-xl shadow-black/25 ${
                    isProfileOpen
                      ? "profile-menu-open"
                      : "pointer-events-none profile-menu-closed"
                  }`}
                  role="menu"
                >
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                      Account
                    </p>
                    <p className="mt-3 truncate text-sm font-semibold text-[var(--text)]">
                      {displayName}
                    </p>
                    {user?.email ? (
                      <p className="mt-1 truncate text-xs leading-5 text-[var(--muted)]">
                        {user.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="my-4 h-px bg-[var(--border)]" />

                  <button
                    type="button"
                    className="flex w-full items-center justify-center rounded-full border border-transparent px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition-[background-color,border-color,color,transform] duration-[180ms] ease-out hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-100 active:scale-[0.98]"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link href="/register" className="btn-secondary px-4 py-2">
              Register
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}






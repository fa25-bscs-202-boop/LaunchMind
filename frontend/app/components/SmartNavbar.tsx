"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";

export function SmartNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWorkspacePage = [
    "/dashboard",
    "/analyze",
    "/feasibility",
    "/pitch-deck",
    "/swot",
    "/competitor",
    "/mvp-planner",
  ].some((prefix) => pathname.startsWith(prefix));
  const isHeaderlessPage =
    ["/login", "/register", "/verify-email", "/forgot-password"].includes(
      pathname,
    ) || pathname.startsWith("/oauth") || isWorkspacePage;

  return (
    <>
      {!isHeaderlessPage ? <SiteHeader /> : null}
      <div id="main-content">{children}</div>
    </>
  );
}

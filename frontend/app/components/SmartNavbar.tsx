"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "./Navbar";

export function SmartNavbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNoSidebarPage =
    ["/", "/login", "/register", "/verify-email", "/forgot-password", "/privacy-policy", "/terms-of-service"].includes(
      pathname,
    ) || pathname.startsWith("/oauth");

  useEffect(() => {
    if (isNoSidebarPage) {
      document.body.classList.add("no-sidebar-page");
    } else {
      document.body.classList.remove("no-sidebar-page");
    }

    return () => {
      document.body.classList.remove("no-sidebar-page");
    };
  }, [isNoSidebarPage]);

  return (
    <div className="flex min-h-screen">
      {!isNoSidebarPage && <Navbar />}
      <main className={`flex-1 ${isNoSidebarPage ? "" : "lg:pl-[280px]"}`}>{children}</main>
    </div>
  );
}

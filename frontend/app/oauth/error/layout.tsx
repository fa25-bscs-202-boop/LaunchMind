import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "OAuth Error | LaunchMind AI",
  description: "LaunchMind AI authentication callback error page.",
  path: "/oauth/error",
  noIndex: true,
});

export default function OAuthErrorLayout({ children }: { children: ReactNode }) {
  return children;
}

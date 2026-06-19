import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createMetadata } from "../../../lib/seo";

export const metadata: Metadata = createMetadata({
  title: "OAuth Success | LaunchMind AI",
  description: "LaunchMind AI authentication callback success page.",
  path: "/oauth/success",
  noIndex: true,
});

export default function OAuthSuccessLayout({ children }: { children: ReactNode }) {
  return children;
}

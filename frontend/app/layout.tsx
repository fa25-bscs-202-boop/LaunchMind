import type { Metadata } from "next";
import "./globals.css";
import { defaultMetadata } from "../lib/seo";
import { organizationSchema, websiteSchema } from "../lib/structured-data";
import { JsonLd } from "./components/JsonLd";
import { SmartNavbar } from "./components/SmartNavbar";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <a
          href="#main-content"
          className="skip-link absolute left-4 top-4 z-[100] -translate-y-20 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:translate-y-0"
        >
          Skip to content
        </a>
        <JsonLd data={[websiteSchema(), organizationSchema()]} />
        <SmartNavbar>{children}</SmartNavbar>
      </body>
    </html>
  );
}


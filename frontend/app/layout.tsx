import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { defaultMetadata } from "../lib/seo";
import {
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from "../lib/structured-data";
import { JsonLd } from "./components/JsonLd";
import { SmartNavbar } from "./components/SmartNavbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <JsonLd
          data={[websiteSchema(), organizationSchema(), softwareApplicationSchema()]}
        />
        <SmartNavbar>{children}</SmartNavbar>
      </body>
    </html>
  );
}





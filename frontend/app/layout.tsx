import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmartNavbar } from "./components/SmartNavbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LaunchMind AI",
  description: "Turn raw ideas into startup-ready plans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SmartNavbar>{children}</SmartNavbar>
      </body>
    </html>
  );
}






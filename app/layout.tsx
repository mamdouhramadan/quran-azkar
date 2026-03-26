import type { Metadata } from "next";
import { Amiri_Quran } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { SITE_CONFIG } from "@/config/siteConfig";
import { Providers } from "./providers";

const amiriQuran = Amiri_Quran({
  weight: "400",
  subsets: ["arabic"],
  variable: "--font-amiri-quran",
});

export const metadata: Metadata = {
  title: SITE_CONFIG.siteName,
  description: SITE_CONFIG.description,
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: SITE_CONFIG.siteName,
    description: SITE_CONFIG.description,
    type: "website",
  },
};

// RootLayout attaches fonts and the shared app shell around every route.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${amiriQuran.variable}`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

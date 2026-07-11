import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { AppProviders } from "@/providers/AppProviders";
import { SiteShell } from "@/features/layout/SiteShell";
import { siteConfig } from "@/config/site";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full`}>
      <body className={`${vazirmatn.className} min-h-full antialiased`}>
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}

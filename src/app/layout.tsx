import type { Metadata } from "next";
import { Geist, Noto_Sans_Arabic } from "next/font/google";
import { AuthProvider } from "@/components/auth";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-geist",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  preload: false,
  variable: "--font-noto-arabic",
});

export const metadata: Metadata = {
  title: "TimberLink - Global Timber Marketplace",
  description: "B2B and B2C platform for the timber industry. Connect with suppliers, manufacturers, designers, and buyers worldwide.",
  keywords: ["timber", "wood", "lumber", "marketplace", "B2B", "wholesale", "hardwood", "softwood"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${notoArabic.variable} antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Noto_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/components/auth";
import { LanguageProvider } from "@/lib/i18n";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
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
  title: "WoodSouq - Global Wood Marketplace",
  description: "B2B and B2C platform for the timber industry. Connect with suppliers, manufacturers, designers, and buyers worldwide.",
  keywords: ["timber", "wood", "lumber", "marketplace", "B2B", "wholesale", "hardwood", "softwood"],
  manifest: "/manifest.json",
  themeColor: "#2E7D32",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WoodSouq",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WHB52EQNWF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WHB52EQNWF');
          `}
        </Script>
      </head>
      <body className={`${geist.variable} ${notoArabic.variable} antialiased`}>
        <ServiceWorkerRegistration />
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

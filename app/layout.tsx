import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SHOWROOM JR",
  description: "Catálogo online con consultas rápidas por WhatsApp. Encontrá lo que buscás de forma simple y directa.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SHOWROOM JR",
    statusBarStyle: "black-translucent",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await prisma.siteConfig.findFirst().catch(() => null);
  const iconUrl = config?.appIconUrl || config?.faviconUrl || config?.logoUrl || '/icon-192.png';
  const favicon = config?.faviconUrl || config?.logoUrl || '/favicon.ico';

  return (
    <html lang="es-AR" className={inter.variable}>
      <head>
        {/* Favicon */}
        <link rel="icon" href={favicon} sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href={iconUrl} />
        {/* iOS PWA icons */}
        <link rel="apple-touch-icon" sizes="192x192" href={iconUrl} />
        <link rel="apple-touch-icon" sizes="512x512" href={iconUrl} />
        {/* iOS splash screen color */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}

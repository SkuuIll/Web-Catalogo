import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SHOWROOM JR",
  description: "WhatsApp E-commerce Web App — Catálogo online con consultas rápidas",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SHOWROOM JR",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}

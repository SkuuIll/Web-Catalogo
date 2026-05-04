import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SHOWROOM JR",
  description: "WhatsApp E-commerce Web App",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SHOWROOM JR",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#C8952A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body className={inter.className}>
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}

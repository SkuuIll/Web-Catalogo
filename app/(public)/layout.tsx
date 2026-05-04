import React from 'react';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/shop/Navbar';
import { MobileNav } from '@/components/shop/MobileNav';
import { WhatsAppButton } from '@/components/shop/WhatsAppButton';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await prisma.siteConfig.findFirst();
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar config={config} />
      <main className="flex-grow pb-16 md:pb-0">{children}</main>
      <footer className="bg-card border-t border-border py-8 md:py-12 pb-24 md:pb-12 text-center text-text-secondary text-sm">
        <div className="container mx-auto px-4">
          <p>{config?.footerText || `© ${new Date().getFullYear()} ${config?.siteName || 'SHOWROOM JR'}. Todos los derechos reservados.`}</p>
        </div>
      </footer>
      <MobileNav />
      {config?.whatsappButtonEnabled && <WhatsAppButton number={config.whatsappNumber} message={config.whatsappMessage} />}
    </div>
  );
}

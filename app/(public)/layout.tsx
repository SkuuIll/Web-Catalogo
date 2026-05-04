import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/shop/Navbar';
import { MobileNavbar } from '@/components/shop/MobileNavbar';
import { MobileNav } from '@/components/shop/MobileNav';
import { WhatsAppButton } from '@/components/shop/WhatsAppButton';
import { StoreAssurance } from '@/components/shop/StoreAssurance';
import { MaintenanceScreen } from '@/components/shop/MaintenanceScreen';

export async function generateMetadata(): Promise<Metadata> {
  const config = await prisma.siteConfig.findFirst();
  const siteName = config?.siteName || 'SHOWROOM JR';
  const title = config?.metaTitle || `${siteName} - Catálogo online`;
  const description = config?.metaDescription || config?.siteSlogan || 'Catálogo de productos con consultas rápidas por WhatsApp.';
  const images = config?.bannerImageUrl || config?.heroImageUrl ? [config.bannerImageUrl || config.heroImageUrl || ''] : undefined;

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: config?.metaKeywords || undefined,
    openGraph: {
      title,
      description,
      siteName,
      locale: 'es_AR',
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await prisma.siteConfig.findFirst();
  if (config?.maintenanceMode) {
    return <MaintenanceScreen config={config} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      {/* Desktop navbar */}
      <Navbar config={config} />
      {/* Mobile top bar */}
      <MobileNavbar config={config} />
      <main className="flex-grow pb-20 md:pb-0">{children}</main>
      <StoreAssurance />
      <footer className="bg-card border-t border-white/5 py-8 md:py-12 pb-24 md:pb-12 text-center text-text-secondary text-sm">
        <div className="container mx-auto px-4 space-y-5">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/sobre-nosotros" className="hover:text-accent transition-colors">Sobre nosotros</Link>
            <Link href="/contacto" className="hover:text-accent transition-colors">Contacto</Link>
            <Link href="/preguntas-frecuentes" className="hover:text-accent transition-colors">Preguntas frecuentes</Link>
            <Link href="/terminos" className="hover:text-accent transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-accent transition-colors">Privacidad</Link>
          </div>
          <p>{config?.footerText || `© ${new Date().getFullYear()} ${config?.siteName || 'SHOWROOM JR'}. Todos los derechos reservados.`}</p>
        </div>
      </footer>
      <MobileNav />
      {config?.whatsappButtonEnabled && <WhatsAppButton number={config.whatsappNumber} message={config.whatsappMessage} />}
    </div>
  );
}

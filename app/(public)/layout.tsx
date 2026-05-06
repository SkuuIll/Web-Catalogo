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
import { Zap } from 'lucide-react';

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
  const config = await prisma.siteConfig.findFirst().catch(() => null);
  if (config?.maintenanceMode) {
    return <MaintenanceScreen config={config} />;
  }

  const currentYear = new Date().getFullYear();
  const siteName = config?.siteName || 'SHOWROOM JR';

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      {/* Desktop navbar */}
      <Navbar config={config} />
      {/* Mobile top bar */}
      <MobileNavbar config={config} />
      <main className="flex-grow pb-20 md:pb-0">{children}</main>
      <StoreAssurance />

      {/* Footer */}
      <footer className="bg-card/40 border-t border-white/[0.04] pt-10 pb-28 md:pb-12">
        <div className="container mx-auto px-4">
          {/* Footer top */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-amber-400 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-black fill-black" />
                </div>
                <span className="text-base font-black text-white tracking-tight">{siteName}</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Catálogo online con consultas rápidas por WhatsApp. Encontrá lo que buscás de forma simple y directa.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Tienda</span>
                <Link href="/catalogo" className="text-sm text-text-secondary hover:text-accent transition-colors duration-200">Catálogo</Link>
                <Link href="/categorias" className="text-sm text-text-secondary hover:text-accent transition-colors duration-200">Categorías</Link>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Info</span>
                <Link href="/sobre-nosotros" className="text-sm text-text-secondary hover:text-accent transition-colors duration-200">Sobre nosotros</Link>
                <Link href="/contacto" className="text-sm text-text-secondary hover:text-accent transition-colors duration-200">Contacto</Link>
                <Link href="/preguntas-frecuentes" className="text-sm text-text-secondary hover:text-accent transition-colors duration-200">Preguntas frecuentes</Link>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">Legal</span>
                <Link href="/terminos" className="text-sm text-text-secondary hover:text-accent transition-colors duration-200">Términos</Link>
                <Link href="/privacidad" className="text-sm text-text-secondary hover:text-accent transition-colors duration-200">Privacidad</Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.04] pt-6">
            <p className="text-center text-xs text-text-secondary">
              {config?.footerText || `© ${currentYear} ${siteName}. Todos los derechos reservados.`}
            </p>
          </div>
        </div>
      </footer>

      <MobileNav />
      {config?.whatsappButtonEnabled && <WhatsAppButton number={config.whatsappNumber} message={config.whatsappMessage} />}
    </div>
  );
}

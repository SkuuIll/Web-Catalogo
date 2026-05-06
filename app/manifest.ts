import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const config = await prisma.siteConfig.findFirst().catch(() => null);
  const iconUrl = config?.appIconUrl || config?.faviconUrl || config?.logoUrl || '/icon-192.png';

  return {
    name: config?.siteName ? `${config.siteName} — Catálogo Premium` : 'SHOWROOM JR — Catálogo Premium',
    short_name: config?.siteName || 'SHOWROOM JR',
    description: config?.metaDescription || 'Catálogo de productos con consultas rápidas por WhatsApp. Encontrá lo que buscás de forma simple.',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    background_color: config?.primaryColor || '#0a0a0a',
    theme_color: config?.primaryColor || '#0a0a0a',
    orientation: 'portrait-primary',
    categories: ['shopping', 'lifestyle'],
    lang: 'es-AR',
    dir: 'ltr',
    prefer_related_applications: false,
    icons: [
      {
        src: iconUrl,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: iconUrl,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: iconUrl,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: iconUrl,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}

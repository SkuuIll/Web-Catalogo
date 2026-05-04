import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SHOWROOM JR — Catálogo Premium',
    short_name: 'SHOWROOM JR',
    description: 'Catálogo de productos con consultas rápidas por WhatsApp. Encontrá lo que buscás de forma simple.',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    orientation: 'portrait-primary',
    categories: ['shopping', 'lifestyle'],
    lang: 'es-AR',
    dir: 'ltr',
    prefer_related_applications: false,
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}

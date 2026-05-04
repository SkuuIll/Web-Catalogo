import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SHOWROOM JR',
    short_name: 'SHOWROOM JR',
    description: 'Catálogo de productos con consultas por WhatsApp.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0d0d0d',
    theme_color: '#C8952A',
    orientation: 'portrait',
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
    ],
  }
}

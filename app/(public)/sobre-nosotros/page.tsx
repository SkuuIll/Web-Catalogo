import React from 'react'
import { prisma } from '@/lib/prisma'
import { StaticInfoPage } from '@/components/shop/StaticInfoPage'

export const revalidate = 60

export default async function SobreNosotrosPage() {
  const config = await prisma.siteConfig.findFirst()
  return (
    <StaticInfoPage
      eyebrow="Tienda"
      title={config?.aboutTitle || 'Sobre nosotros'}
      content={config?.aboutContent}
      fallback={[
        'Somos un catálogo online pensado para mostrar productos de forma clara, rápida y ordenada.',
        'Trabajamos con artículos de distintas categorías, desde indumentaria y accesorios hasta herramientas, tecnología y productos de uso diario.',
        'Nuestro objetivo es que puedas consultar rápido por WhatsApp y recibir información concreta antes de comprar.',
      ]}
    />
  )
}

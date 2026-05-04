import React from 'react'
import { prisma } from '@/lib/prisma'
import { StaticInfoPage } from '@/components/shop/StaticInfoPage'

export const revalidate = 60

export default async function ContactoPage() {
  const config = await prisma.siteConfig.findFirst()
  const fallback = [
    config?.whatsappNumber ? `WhatsApp: ${config.whatsappNumber}` : 'Consultas por WhatsApp desde cada producto.',
    config?.instagramHandle ? `Instagram: ${config.instagramHandle}` : 'También podés consultar por redes sociales si están disponibles.',
    'Los horarios, entregas, retiros y condiciones se coordinan directamente al momento de la consulta.',
  ]

  return (
    <StaticInfoPage
      eyebrow="Atención"
      title={config?.contactTitle || 'Contacto'}
      content={config?.contactContent}
      fallback={fallback}
    />
  )
}

import React from 'react'
import { prisma } from '@/lib/prisma'
import { StaticInfoPage } from '@/components/shop/StaticInfoPage'

export const revalidate = 60

export default async function PrivacidadPage() {
  const config = await prisma.siteConfig.findFirst()
  return (
    <StaticInfoPage
      eyebrow="Privacidad"
      title={config?.privacyTitle || 'Política de privacidad'}
      content={config?.privacyContent}
      fallback={[
        'Esta web puede utilizar datos de contacto que el cliente comparte voluntariamente al consultar por WhatsApp o redes sociales.',
        'La información se usa únicamente para responder consultas, coordinar ventas, entregas, cambios o soporte relacionado con productos.',
        'No compartimos datos personales con terceros salvo que sea necesario para coordinar una operación solicitada por el cliente.',
      ]}
    />
  )
}

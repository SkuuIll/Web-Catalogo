import React from 'react'
import { prisma } from '@/lib/prisma'
import { StaticInfoPage } from '@/components/shop/StaticInfoPage'

export const revalidate = 60

export default async function PreguntasFrecuentesPage() {
  const config = await prisma.siteConfig.findFirst()
  return (
    <StaticInfoPage
      eyebrow="Ayuda"
      title={config?.faqTitle || 'Preguntas frecuentes'}
      content={config?.faqContent}
      fallback={[
        '¿Cómo consulto por un producto? Entrá a la ficha del producto y tocá el botón de WhatsApp para enviar la consulta con el nombre y precio.',
        '¿El stock está actualizado? Intentamos mantenerlo al día, pero la disponibilidad se confirma por WhatsApp antes de cerrar la compra.',
        '¿Hay cambios o garantía? Depende del tipo de producto. Consultá las condiciones específicas antes de confirmar.',
      ]}
    />
  )
}

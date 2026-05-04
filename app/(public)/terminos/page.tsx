import React from 'react'
import { prisma } from '@/lib/prisma'
import { StaticInfoPage } from '@/components/shop/StaticInfoPage'

export const revalidate = 60

export default async function TerminosPage() {
  const config = await prisma.siteConfig.findFirst()
  return (
    <StaticInfoPage
      eyebrow="Legal"
      title={config?.termsTitle || 'Términos y condiciones'}
      content={config?.termsContent}
      fallback={[
        'Los precios, promociones y disponibilidad publicados pueden variar sin previo aviso hasta la confirmación final por WhatsApp.',
        'La compra o reserva de productos se coordina directamente con el vendedor. Recomendamos consultar stock, medios de pago, entrega y garantía antes de confirmar.',
        'Las imágenes son ilustrativas y pueden variar según disponibilidad, talle, color, versión o lote del producto.',
      ]}
    />
  )
}

'use client'

import React from 'react'
import { MessageCircle } from 'lucide-react'

export function WhatsAppTrackedLink({
  href,
  productId,
}: {
  href: string
  productId: string
}) {
  const track = () => {
    fetch('/api/analytics/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, source: 'PRODUCT' }),
    }).catch(() => undefined)
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={track}
      className="group relative w-full flex items-center justify-center gap-3 bg-accent hover:bg-accent-hover text-primary font-black py-5 px-8 rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(200,149,42,0.3)]"
    >
      <MessageCircle className="w-6 h-6 relative z-10 transition-transform group-hover:scale-110" />
      <span className="relative z-10 text-lg">Consultar Disponibilidad</span>
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
    </a>
  )
}

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
      className="group relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-accent to-amber-500 hover:from-accent-hover hover:to-amber-400 text-black font-black py-5 px-8 rounded-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(200,149,42,0.30)]"
    >
      <MessageCircle className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-110" />
      <span className="relative z-10 text-lg">Consultar Disponibilidad</span>
      {/* Shine sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </a>
  )
}

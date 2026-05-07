'use client'
import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export function WhatsAppButton({ number, message }: { number?: string | null, message?: string | null }) {
  const { info } = useToast()

  if (!number) return null;

  const handleWA = () => {
    info('Abriendo WhatsApp...')
    fetch('/api/analytics/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'FLOATING' }),
    }).catch(() => undefined);
    const cleanNumber = number.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message || 'Hola!');
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };
  return (
    <button
      onClick={handleWA}
      className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 group"
      aria-label="Consultar por WhatsApp"
    >
      <div className="relative">
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping" style={{ animationDuration: '2s' }} />
        {/* Button */}
        <div className="relative bg-gradient-to-br from-accent to-amber-500 text-white p-3.5 rounded-full shadow-xl shadow-accent/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_rgba(200,149,42,0.35)] group-hover:scale-105">
          <MessageCircle className="h-6 w-6" />
        </div>
      </div>
    </button>
  )
}

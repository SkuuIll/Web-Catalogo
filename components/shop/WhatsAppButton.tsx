'use client'
import React from 'react'
import { MessageCircle } from 'lucide-react'

export function WhatsAppButton({ number, message }: { number?: string | null, message?: string | null }) {
  if (!number) return null;
  const handleWA = () => {
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
    <button onClick={handleWA} className="fixed bottom-24 right-4 md:bottom-6 md:right-6 bg-accent hover:bg-accent-hover text-primary p-4 rounded-full shadow-lg z-50 transition-colors hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(200,149,42,0.3)]" aria-label="Consultar por WhatsApp">
      <MessageCircle className="h-6 w-6 text-white" />
    </button>
  )
}

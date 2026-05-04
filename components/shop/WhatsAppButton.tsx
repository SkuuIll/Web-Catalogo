'use client'
import React from 'react'

export function WhatsAppButton({ number, message }: { number?: string | null, message?: string | null }) {
  if (!number) return null;
  const handleWA = () => {
    const cleanNumber = number.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message || 'Hola!');
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };
  return (
    <button onClick={handleWA} className="fixed bottom-6 right-6 bg-accent hover:bg-accent-hover text-primary p-4 rounded-full shadow-lg z-50 animate-pulse transition-colors" aria-label="Consultar por WhatsApp">
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
      </svg>
    </button>
  )
}

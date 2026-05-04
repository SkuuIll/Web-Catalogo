import React from 'react'
import Link from 'next/link'
import { MessageCircle, ShieldCheck, Wrench } from 'lucide-react'

export function MaintenanceScreen({ config }: { config: any }) {
  const title = config?.maintenanceTitle || 'Estamos realizando mejoras'
  const message = config?.maintenanceMessage || 'La tienda está temporalmente en mantenimiento. Volvemos pronto con una experiencia más completa.'
  const cleanNumber = config?.whatsappNumber?.replace(/\D/g, '')
  const waUrl = cleanNumber ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hola! Quería hacer una consulta mientras la tienda está en mantenimiento.')}` : null

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-10 text-text-primary">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center text-center">
        <div className="mb-6 rounded-lg border border-accent/25 bg-accent/10 p-4 text-accent">
          <Wrench className="h-10 w-10" />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">{config?.siteName || 'SHOWROOM JR'}</p>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">{message}</p>

        <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-card/70 p-4">
            <ShieldCheck className="mx-auto mb-3 h-5 w-5 text-accent" />
            <p className="font-bold text-white">Tus consultas siguen activas</p>
            <p className="mt-1 text-sm text-text-secondary">Podés contactarnos si necesitás información de un producto.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-card/70 p-4">
            <Wrench className="mx-auto mb-3 h-5 w-5 text-accent" />
            <p className="font-bold text-white">Mejoras en progreso</p>
            <p className="mt-1 text-sm text-text-secondary">Estamos ajustando catálogo, precios o contenido.</p>
          </div>
        </div>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-black text-black hover:bg-accent-hover">
              <MessageCircle className="h-4 w-4" />
              Consultar por WhatsApp
            </a>
          )}
          <Link href="/admin/login" className="inline-flex items-center justify-center rounded-lg border border-white/10 px-5 py-3 text-sm font-bold text-text-secondary hover:border-accent/40 hover:text-accent">
            Acceso admin
          </Link>
        </div>
      </div>
    </div>
  )
}

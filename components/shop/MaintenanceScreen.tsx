import React from 'react'
import Link from 'next/link'
import { MessageCircle, ShieldCheck, Wrench, Zap } from 'lucide-react'

export function MaintenanceScreen({ config }: { config: any }) {
  const title = config?.maintenanceTitle || 'Estamos realizando mejoras'
  const message = config?.maintenanceMessage || 'La tienda está temporalmente en mantenimiento. Volvemos pronto con una experiencia más completa.'
  const cleanNumber = config?.whatsappNumber?.replace(/\D/g, '')
  const waUrl = cleanNumber ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hola! Quería hacer una consulta mientras la tienda está en mantenimiento.')}` : null

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-10 text-text-primary overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-20" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center text-center fade-up">
        {/* Logo */}
        <div className="mb-6 relative group">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-amber-400 flex items-center justify-center shadow-xl shadow-accent/20">
            <Zap className="h-8 w-8 text-black fill-black" />
          </div>
          <div className="absolute -inset-3 rounded-2xl bg-accent/15 blur-xl -z-10 opacity-60" />
        </div>

        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-accent">{config?.siteName || 'SHOWROOM JR'}</p>
        <h1 className="text-3xl font-black tracking-tight text-gradient sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">{message}</p>

        <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-card/40 p-5 transition-colors duration-300 hover:bg-card/60">
            <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="font-bold text-white">Tus consultas siguen activas</p>
            <p className="mt-1 text-sm text-text-secondary">Podés contactarnos si necesitás información de un producto.</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-card/40 p-5 transition-colors duration-300 hover:bg-card/60">
            <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-orange-400" />
            </div>
            <p className="font-bold text-white">Mejoras en progreso</p>
            <p className="mt-1 text-sm text-text-secondary">Estamos ajustando catálogo, precios o contenido.</p>
          </div>
        </div>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-black text-black hover:bg-accent-hover transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(200,149,42,0.25)]">
              <MessageCircle className="h-4 w-4" />
              Consultar por WhatsApp
            </a>
          )}
          <Link href="/admin/login" className="inline-flex items-center justify-center rounded-xl border border-white/[0.06] px-6 py-3.5 text-sm font-bold text-text-secondary hover:border-accent/30 hover:text-accent transition-all duration-300">
            Acceso admin
          </Link>
        </div>
      </div>
    </div>
  )
}

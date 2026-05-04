'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { Home, RefreshCcw, XOctagon } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="es-AR">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4 py-20 text-text-primary">
          <div className="w-full max-w-2xl text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-lg border border-red-500/20 bg-card text-red-400 shadow-2xl shadow-black/30">
              <XOctagon className="h-12 w-12" />
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-red-400">Error crítico</p>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">Algo salió mal</h1>
            <p className="mx-auto mt-5 max-w-xl text-text-secondary">La aplicación encontró un problema inesperado. Podés intentar recargar o volver al inicio.</p>
            <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={() => reset()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-black text-black hover:bg-accent-hover">
                <RefreshCcw className="h-4 w-4" />
                Reintentar
              </button>
              <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-5 py-3 text-sm font-bold text-text-secondary hover:text-white">
                <Home className="h-4 w-4" />
                Ir al inicio
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

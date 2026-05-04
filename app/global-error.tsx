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
      <body style={{ margin: 0, backgroundColor: '#0a0a0a', fontFamily: 'Inter, -apple-system, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', color: '#f5f5f5' }}>
          <div style={{ width: '100%', maxWidth: '32rem', textAlign: 'center' }}>
            <div style={{ margin: '0 auto 2rem', width: '5rem', height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(22,22,22,0.6)' }}>
              <XOctagon style={{ width: '2.5rem', height: '2.5rem', color: '#ef4444' }} />
            </div>
            <p style={{ marginBottom: '0.75rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#ef4444' }}>Error crítico</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', marginBottom: '0' }}>Algo salió mal</h1>
            <p style={{ marginTop: '1.25rem', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto', color: '#7a7a7a', lineHeight: 1.6 }}>La aplicación encontró un problema inesperado. Podés intentar recargar o volver al inicio.</p>
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={() => reset()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '0.75rem', background: '#C8952A', color: '#000', fontWeight: 900, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
              >
                <RefreshCcw style={{ width: '1rem', height: '1rem' }} />
                Reintentar
              </button>
              <a
                href="/"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 1.75rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', color: '#7a7a7a', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', background: 'transparent' }}
              >
                <Home style={{ width: '1rem', height: '1rem' }} />
                Ir al inicio
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

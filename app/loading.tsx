import React from 'react'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-card p-6 text-center shadow-2xl shadow-black/30">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="font-bold text-white">Cargando</p>
        <p className="mt-1 text-sm text-text-secondary">Preparando la información...</p>
      </div>
    </div>
  )
}

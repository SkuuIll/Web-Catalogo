'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

type ConfirmTone = 'danger' | 'warning' | 'info'

type ConfirmOptions = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: ConfirmTone
}

type PendingConfirm = ConfirmOptions & {
  resolve: (value: boolean) => void
}

const ConfirmContext = createContext<((options: ConfirmOptions) => Promise<boolean>) | null>(null)

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null)

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve })
    })
  }, [])

  const close = (value: boolean) => {
    pending?.resolve(value)
    setPending(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-card shadow-2xl shadow-black/50">
            <div className="flex items-start gap-4 p-5">
              <div className={`rounded-lg p-2 ${pending.tone === 'danger' ? 'bg-red-500/10 text-red-400' : pending.tone === 'warning' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-accent/10 text-accent'}`}>
                {pending.tone === 'danger' ? <Trash2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-white">{pending.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary whitespace-pre-line">{pending.message}</p>
              </div>
              <button onClick={() => close(false)} className="rounded-lg p-1 text-text-secondary transition-colors hover:bg-white/5 hover:text-white" aria-label="Cerrar">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-white/10 p-4 sm:flex-row sm:justify-end">
              <button onClick={() => close(false)} className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-bold text-text-secondary transition-colors hover:text-white">
                {pending.cancelLabel || 'Cancelar'}
              </button>
              <button onClick={() => close(true)} className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-colors ${pending.tone === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-accent text-black hover:bg-accent-hover'}`}>
                {pending.confirmLabel || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmDialogProvider')
  return ctx
}

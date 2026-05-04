'use client'

import React, { useEffect, useState } from 'react'
import { Download, X, Zap } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined)
    }

    const dismissed = window.localStorage.getItem('pwa-install-dismissed') === 'true'
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      if (!dismissed) setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const install = async () => {
    if (!installEvent) return
    await installEvent.prompt()
    await installEvent.userChoice
    setInstallEvent(null)
    setVisible(false)
  }

  const dismiss = () => {
    window.localStorage.setItem('pwa-install-dismissed', 'true')
    setVisible(false)
  }

  if (!visible || !installEvent) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-accent/20 bg-card/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl md:bottom-6 slide-up">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 p-2.5 text-accent border border-accent/20">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-white text-sm">Instalar catálogo</p>
          <p className="mt-1 text-xs text-text-secondary leading-relaxed">Agregalo al inicio del celular para abrirlo como app.</p>
          <button onClick={install} className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-black transition-all duration-300 hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20">
            Instalar
          </button>
        </div>
        <button onClick={dismiss} className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-white" aria-label="Cerrar">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

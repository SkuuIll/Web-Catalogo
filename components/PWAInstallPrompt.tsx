'use client'

import React, { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

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
    <div className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-md rounded-lg border border-accent/25 bg-card/95 p-4 shadow-2xl shadow-black/40 backdrop-blur md:bottom-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-accent/15 p-2 text-accent">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-white">Instalar catálogo</p>
          <p className="mt-1 text-sm text-text-secondary">Agregalo al inicio del celular para abrirlo como app.</p>
          <button onClick={install} className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-accent-hover">
            Instalar
          </button>
        </div>
        <button onClick={dismiss} className="rounded-lg p-1 text-text-secondary transition-colors hover:bg-white/5 hover:text-white" aria-label="Cerrar">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

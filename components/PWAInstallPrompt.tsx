'use client'

import React, { useEffect, useState } from 'react'
import { Download, X, Share, PlusSquare } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined)
    }

    // Check if app is already installed
    const _isStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && (window.navigator as any).standalone === true)
    setIsStandalone(_isStandalone)

    // Check if device is iOS
    const _isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(_isIOS)

    // Check if device is mobile
    const _isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    const dismissed = window.localStorage.getItem('pwa-install-dismissed') === 'true'
    
    // For Android/Chrome
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      // Solo mostrar en móviles, si no está standalone y si no se descartó antes
      if (!dismissed && !_isStandalone && _isMobile) {
        setVisible(true)
        window.localStorage.setItem('pwa-install-dismissed', 'true')
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // For iOS, show custom prompt if not dismissed and not already installed
    if (_isIOS && !dismissed && !_isStandalone && _isMobile) {
      // Delay to not be too aggressive
      setTimeout(() => {
        setVisible(true)
        window.localStorage.setItem('pwa-install-dismissed', 'true')
      }, 3000)
    }

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

  if (!visible || isStandalone) return null

  return (
    <div className="fixed bottom-[88px] md:bottom-6 left-4 right-4 z-[60] mx-auto max-w-sm rounded-2xl border border-white/[0.08] bg-black/80 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl slide-up">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 p-2.5 text-accent border border-accent/20 shrink-0">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-black tracking-tight text-white text-sm mb-1">Instalar Catálogo App</p>
          
          {isIOS ? (
            <div className="text-[11px] text-text-secondary leading-relaxed">
              Instalá la app para un acceso más rápido. Tocá <Share className="inline w-3 h-3 mx-0.5 align-text-bottom" /> y luego <span className="font-bold text-white">&quot;Agregar a inicio&quot;</span> <PlusSquare className="inline w-3 h-3 mx-0.5 align-text-bottom" />
            </div>
          ) : (
            <>
              <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
                Agregalo al inicio del celular para consultar productos más rápido y sin conexión.
              </p>
              <button 
                onClick={install} 
                className="w-full justify-center rounded-lg bg-gradient-to-r from-accent to-amber-500 px-4 py-2 text-xs font-black text-black transition-all duration-300 hover:from-accent-hover hover:to-amber-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
              >
                Instalar ahora
              </button>
            </>
          )}
        </div>
        <button 
          onClick={dismiss} 
          className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/[0.1] hover:text-white shrink-0" 
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

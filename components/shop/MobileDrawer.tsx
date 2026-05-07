'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Home, Compass, Search, MessageCircle, Info, HelpCircle, Shield, FileText, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/categorias', label: 'Categorías', icon: Compass },
  { href: '/catalogo', label: 'Catálogo', icon: Search },
  { href: '/contacto', label: 'Contacto', icon: MessageCircle },
  { href: '/sobre-nosotros', label: 'Sobre Nosotros', icon: Info },
  { href: '/preguntas-frecuentes', label: 'FAQ', icon: HelpCircle },
  { href: '/terminos', label: 'Términos', icon: FileText },
  { href: '/privacidad', label: 'Privacidad', icon: Shield },
]

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  config?: { siteName?: string; siteSlogan?: string; logoUrl?: string } | null
}

export function MobileDrawer({ open, onClose, config }: MobileDrawerProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[80vw] glass-strong border-r border-white/[0.06] shadow-2xl flex flex-col animate-drawer-in">
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent via-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-accent/20">
              <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-white leading-none block">
                {config?.siteName || 'SHOWROOM JR'}
              </span>
              <span className="text-[9px] text-text-secondary font-medium leading-none mt-0.5 tracking-wider uppercase">
                {config?.siteSlogan || 'Catálogo premium'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-white/[0.06] flex items-center justify-center text-text-secondary hover:text-white hover:border-white/[0.12] transition-smooth active:scale-[0.95]"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="stagger">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl transition-smooth',
                    isActive
                      ? 'bg-accent/10 text-accent font-bold'
                      : 'text-text-secondary hover:text-white hover:bg-white/[0.03]'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive && 'text-accent')} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <p className="text-[11px] text-text-secondary text-center">
            © {new Date().getFullYear()} {config?.siteName || 'SHOWROOM JR'}
          </p>
        </div>
      </div>
    </>
  )
}

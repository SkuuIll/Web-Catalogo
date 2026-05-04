import React from 'react'
import Link from 'next/link'
import { Search, Zap } from 'lucide-react'

export function MobileNavbar({ config }: { config: any }) {
  return (
    <header className="md:hidden w-full bg-bg-primary/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 h-16">
        <Link href="/" className="flex items-center gap-2.5">
          {config?.logoUrl ? (
            <img src={config.logoUrl} alt={config.siteName} className="h-8" />
          ) : (
            <>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center shadow-lg shadow-accent/20">
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-white leading-none">
                  {config?.siteName || 'SHOWROOM JR'}
                </span>
                <span className="text-[10px] text-text-secondary font-medium leading-none mt-0.5">
                  {config?.siteSlogan || 'Premium product catalog'}
                </span>
              </div>
            </>
          )}
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/catalogo" className="p-2 rounded-lg bg-white/5 text-text-secondary hover:text-accent transition-colors" aria-label="Buscar productos">
            <Search className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}

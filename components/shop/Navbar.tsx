'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Zap } from 'lucide-react'

export function Navbar({ config }: { config: any }) {
  const pathname = usePathname()
  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/categorias', label: 'Categorías' },
    { href: '/catalogo', label: 'Catálogo' },
  ]
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="w-full bg-bg-primary/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 hidden md:block">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {config?.logoUrl ? (
            <img src={config.logoUrl} alt={config.siteName} className="h-10 group-hover:scale-105 transition-transform" />
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-shadow">
                <Zap className="w-5 h-5 text-black fill-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white leading-none">
                  {config?.siteName || 'SHOWROOM JR'}
                </span>
                <span className="text-[11px] text-text-secondary font-medium leading-none mt-0.5">
                  {config?.siteSlogan || 'Premium product catalog'}
                </span>
              </div>
            </>
          )}
        </Link>
        <nav className="flex items-center gap-1 rounded-lg border border-white/5 bg-white/5 px-2 py-1.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${isActive(item.href) ? 'bg-white/10 text-white shadow-inner' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/catalogo" className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-text-secondary hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all" aria-label="Buscar productos">
            <Search className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}

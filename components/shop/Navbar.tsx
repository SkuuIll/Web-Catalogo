import React from 'react'
import Link from 'next/link'
export function Navbar({ config }: { config: any }) {
  return (
    <header className="w-full bg-bg-primary/90 backdrop-blur border-b border-border sticky top-0 z-40 hidden md:block">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {config?.logoUrl ? <img src={config.logoUrl} alt={config.siteName} className="h-8" /> : <span className="text-xl font-bold tracking-tighter text-accent">{config?.siteName || 'SHOWROOM JR'}</span>}
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Inicio</Link>
          <Link href="/catalogo" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Catálogo</Link>
          <Link href="/categorias" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Categorías</Link>
        </nav>
        <div className="flex items-center">
          <Link href="/catalogo" className="text-text-secondary hover:text-text-primary transition-colors">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </Link>
        </div>
      </div>
    </header>
  )
}

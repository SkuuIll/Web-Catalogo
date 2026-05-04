import React from 'react'
import Link from 'next/link'
export function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-40 pb-safe">
      <Link href="/" className="flex flex-col items-center justify-center text-text-secondary hover:text-accent gap-1">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span className="text-[10px] font-medium">Inicio</span>
      </Link>
      <Link href="/categorias" className="flex flex-col items-center justify-center text-text-secondary hover:text-accent gap-1">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        <span className="text-[10px] font-medium">Explorar</span>
      </Link>
      <Link href="/catalogo" className="flex flex-col items-center justify-center text-text-secondary hover:text-accent gap-1">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <span className="text-[10px] font-medium">Buscar</span>
      </Link>
      <Link href="/admin" className="flex flex-col items-center justify-center text-text-secondary hover:text-accent gap-1">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span className="text-[10px] font-medium">Admin</span>
      </Link>
    </div>
  )
}

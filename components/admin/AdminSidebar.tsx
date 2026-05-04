'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/productos', label: 'Productos', icon: '📦' },
  { href: '/admin/categorias', label: 'Categorías', icon: '🏷️' },
  { href: '/admin/precios', label: 'Precios', icon: '💲' },
  { href: '/admin/imagenes', label: 'Imágenes', icon: '🖼️' },
  { href: '/admin/banners', label: 'Banners', icon: '🖼️' },
  { href: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <>
      <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="text-xl font-bold text-accent tracking-tighter">SHOWROOM JR</Link>
          <div className="text-xs text-text-secondary mt-1 uppercase tracking-widest">Admin Panel</div>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-accent/10 text-accent font-medium' : 'text-text-secondary hover:bg-secondary hover:text-text-primary'}`}>
                <span>{item.icon}</span>{item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-secondary hover:text-red-400 transition-colors w-full text-left">
            <span>🚪</span>Cerrar Sesión
          </button>
        </div>
      </aside>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 flex overflow-x-auto pb-safe">
        {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center py-3 px-4 min-w-[80px] text-xs gap-1 ${isActive ? 'text-accent' : 'text-text-secondary'}`}>
                <span className="text-lg">{item.icon}</span><span className="truncate">{item.label}</span>
              </Link>
            )
        })}
      </div>
    </>
  )
}

'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Package, Tag, DollarSign,
  ImageIcon, Megaphone, Settings, LogOut
  , UploadCloud
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Tag },
  { href: '/admin/precios', label: 'Precios', icon: DollarSign },
  { href: '/admin/imagenes', label: 'Imágenes', icon: ImageIcon },
  { href: '/admin/banners', label: 'Banners', icon: Megaphone },
  { href: '/admin/importar-exportar', label: 'Importar', icon: UploadCloud },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="text-xl font-bold text-accent tracking-tighter">SHOWROOM JR</Link>
          <div className="text-xs text-text-secondary mt-1 uppercase tracking-widest">Panel Admin</div>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-secondary hover:bg-secondary hover:text-red-400 transition-colors w-full text-left text-sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50 overflow-x-auto no-scrollbar pb-safe shadow-[0_-14px_40px_rgba(0,0,0,0.4)]">
        <div className="flex min-w-max px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`my-2 flex min-w-[78px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-[10px] transition-colors ${
                isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-secondary hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
        </div>
      </div>
    </>
  )
}

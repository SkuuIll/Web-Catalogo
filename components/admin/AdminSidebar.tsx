'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Package, Tag, DollarSign,
  ImageIcon, Megaphone, Settings, LogOut,
  UploadCloud, Zap
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
      <aside className="w-64 bg-card/80 backdrop-blur-md border-r border-white/[0.06] h-screen sticky top-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/[0.06]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-amber-400 flex items-center justify-center shadow-lg shadow-accent/15">
              <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <div>
              <span className="text-base font-black text-accent tracking-tight block leading-none">SHOWROOM JR</span>
              <span className="text-[10px] text-text-secondary uppercase tracking-widest">Panel Admin</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-0.5 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm ${
                  isActive
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-accent" />
                )}
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-text-secondary hover:bg-red-500/[0.08] hover:text-red-400 transition-all duration-300 w-full text-left text-sm"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-white/[0.06] z-50 overflow-x-auto no-scrollbar pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
        <div className="flex min-w-max px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative my-2 flex min-w-[78px] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-[10px] transition-all duration-300 ${
                isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-accent" />
              )}
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

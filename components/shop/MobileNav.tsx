'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Search } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/categorias', label: 'Explorar', icon: Compass },
  { href: '/catalogo', label: 'Buscar', icon: Search },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-white/[0.06] flex items-center justify-around z-50 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex flex-col items-center justify-center gap-1 w-1/3 py-3 transition-all duration-300 ${
              isActive ? 'text-accent' : 'text-text-secondary active:text-accent/70'
            }`}
          >
            {/* Active indicator line */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-accent" />
            )}
            <Icon className={`w-[22px] h-[22px] transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
            <span className="text-[10px] font-bold tracking-wider uppercase">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

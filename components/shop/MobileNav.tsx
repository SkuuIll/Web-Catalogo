'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Search } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/categorias', label: 'Explorar', icon: Compass },
  { href: '/catalogo', label: 'Buscar', icon: Search },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-bg-primary/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 w-1/3 h-full transition-colors ${
              isActive ? 'text-accent' : 'text-text-secondary hover:text-accent'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-bold tracking-wider uppercase">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

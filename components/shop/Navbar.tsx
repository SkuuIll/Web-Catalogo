'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import { Search, Zap, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export function Navbar({ config }: { config: any }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { items, setIsOpen } = useCartStore()
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/categorias', label: 'Categorías' },
    { href: '/catalogo', label: 'Catálogo' },
  ]
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className={`w-full sticky top-0 z-40 hidden md:block transition-all duration-500 ${
        scrolled
          ? 'glass-strong border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {config?.logoUrl ? (
            <NextImage src={config.logoUrl} alt={config.siteName} width={40} height={40} className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" unoptimized />
          ) : (
            <>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-accent via-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-accent/25 group-hover:shadow-accent/40 transition-all duration-300 group-hover:scale-105">
                <Zap className="w-5 h-5 text-black fill-black" />
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-black tracking-tight text-white leading-none">
                  {config?.siteName || 'SHOWROOM JR'}
                </span>
                <span className="text-[10px] text-text-secondary font-medium leading-none mt-1 tracking-wide uppercase">
                  {config?.siteSlogan || 'Catálogo premium'}
                </span>
              </div>
            </>
          )}
        </Link>

        {/* Nav Pill */}
        <nav className="flex items-center gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-1.5 py-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-300 ${
                isActive(item.href)
                  ? 'bg-white/[0.08] text-white shadow-inner'
                  : 'text-text-secondary hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-accent" />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/catalogo"
            className="group flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-text-secondary hover:text-accent hover:bg-accent/[0.08] hover:border-accent/25 transition-all duration-300"
            aria-label="Buscar productos"
          >
            <Search className="w-[18px] h-[18px]" />
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className="relative group flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-text-secondary hover:text-accent hover:bg-accent/[0.08] hover:border-accent/25 transition-all duration-300"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="w-[18px] h-[18px]" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

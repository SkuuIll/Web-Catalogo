'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { Search, Zap } from 'lucide-react'

export function MobileNavbar({ config }: { config: any }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`md:hidden w-full sticky top-0 z-40 transition-all duration-400 ${
        scrolled
          ? 'glass-strong border-b border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 h-[60px]">
        <Link href="/" className="flex items-center gap-2.5">
          {config?.logoUrl ? (
            <NextImage src={config.logoUrl} alt={config.siteName} width={32} height={32} className="h-8 w-auto" unoptimized />
          ) : (
            <>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent via-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-accent/20">
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-black tracking-tight text-white leading-none">
                  {config?.siteName || 'SHOWROOM JR'}
                </span>
                <span className="text-[9px] text-text-secondary font-medium leading-none mt-0.5 tracking-wider uppercase">
                  {config?.siteSlogan || 'Catálogo premium'}
                </span>
              </div>
            </>
          )}
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/catalogo"
            className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-text-secondary hover:text-accent transition-all duration-300"
            aria-label="Buscar productos"
          >
            <Search className="w-[18px] h-[18px]" />
          </Link>
        </div>
      </div>
    </header>
  )
}

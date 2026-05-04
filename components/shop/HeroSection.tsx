import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Store } from 'lucide-react'

interface HeroSectionProps {
  title: string | null
  subtitle: string | null
  imageUrl: string | null
  logoUrl?: string | null
  productCount?: number
  categoryCount?: number
}

export function HeroSection({ title, subtitle, imageUrl, logoUrl, productCount = 0, categoryCount = 0 }: HeroSectionProps) {
  const displayTitle = title || 'Todo lo que buscás.'
  const displaySubtitle = subtitle || 'Selección de productos premium, para una experiencia minimalista editorial.'

  return (
    <section className="w-full bg-bg-primary overflow-hidden">
      {/* Banner / Header Image */}
      <div className="relative w-full h-[220px] sm:h-[270px] md:h-[360px] bg-secondary border-b border-white/5">
        {imageUrl ? (
          <Image src={imageUrl} alt="Banner" fill className="object-cover scale-[1.02]" priority />
        ) : (
          <>
            <div className="absolute inset-0 bg-dot-grid opacity-70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(200,149,42,0.20),transparent_34rem)]" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/45 to-transparent pointer-events-none" />
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 sm:px-6 relative pb-12 md:pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 sm:-mt-20 mb-5 gap-4">
          {/* Logo / Profile Picture */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-bg-primary overflow-hidden bg-secondary shadow-2xl shadow-black/40 z-10 shrink-0 float-soft">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent to-amber-200 text-3xl font-black text-black">JR</div>
            )}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-row gap-3 w-full sm:w-auto justify-start sm:justify-end z-10 pt-2 sm:pt-0">
            <Link
              href="/catalogo"
            className="group inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-black font-bold py-3 px-6 rounded-lg text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(200,149,42,0.28)]"
            >
              Explorar catálogo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="max-w-3xl fade-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-accent">
            <Sparkles className="w-3.5 h-3.5" />
            Selección destacada
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-3 text-white tracking-tight text-balance">
            {displayTitle}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary mb-7 font-medium leading-relaxed max-w-xl text-balance">
            {displaySubtitle}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="catalog-surface flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3">
              <Store className="w-4 h-4 text-accent" />
              <span className="text-xl font-bold text-white">{productCount}</span>
              <span className="text-sm text-text-secondary font-medium">Productos</span>
            </div>
            <div className="catalog-surface flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xl font-bold text-white">{categoryCount}</span>
              <span className="text-sm text-text-secondary font-medium">Categorías</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

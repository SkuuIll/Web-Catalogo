import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Store, Star } from 'lucide-react'

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
      <div className="relative w-full h-[200px] sm:h-[260px] md:h-[340px] lg:h-[380px] bg-secondary border-b border-white/5">
        {imageUrl ? (
          <Image src={imageUrl} alt="Banner" fill className="object-cover" priority />
        ) : (
          <>
            <div className="absolute inset-0 bg-dot-grid opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(200,149,42,0.18),transparent)]" />
            {/* Decorative floating orbs */}
            <div className="absolute top-[20%] left-[15%] w-20 h-20 rounded-full bg-accent/10 blur-2xl float-soft" />
            <div className="absolute top-[40%] right-[20%] w-32 h-32 rounded-full bg-blue-500/5 blur-3xl float-soft" style={{ animationDelay: '2s' }} />
          </>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/30 via-transparent to-bg-primary/30 pointer-events-none" />
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 sm:px-6 relative pb-10 md:pb-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 sm:-mt-20 mb-6 gap-5">
          {/* Logo / Profile Picture */}
          <div className="relative group">
            <div className="relative w-[120px] h-[120px] sm:w-[148px] sm:h-[148px] rounded-2xl border-[3px] border-bg-primary overflow-hidden bg-secondary shadow-2xl shadow-black/50 z-10 shrink-0 transition-transform duration-500 group-hover:scale-[1.03]">
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent via-amber-300 to-yellow-500 text-3xl font-black text-black">
                  JR
                </div>
              )}
            </div>
            {/* Glow behind logo */}
            <div className="absolute -inset-2 rounded-2xl bg-accent/15 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-row gap-3 w-full sm:w-auto justify-start sm:justify-end z-10 pt-1 sm:pt-0">
            <Link
              href="/catalogo"
              className="group inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-black font-bold py-3 px-6 rounded-xl text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(200,149,42,0.25)]"
            >
              Explorar catálogo
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="max-w-3xl fade-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.07] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            <Star className="w-3 h-3 fill-accent" />
            Selección destacada
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[3.5rem] lg:text-6xl font-black mb-4 text-gradient tracking-tight text-balance leading-[1.1]">
            {displayTitle}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary mb-8 font-medium leading-relaxed max-w-xl text-balance">
            {displaySubtitle}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="catalog-surface flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Store className="w-4 h-4 text-accent" />
              </div>
              <div>
                <span className="text-xl font-black text-white block leading-none">{productCount}</span>
                <span className="text-[11px] text-text-secondary font-medium">Productos</span>
              </div>
            </div>
            <div className="catalog-surface flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div>
                <span className="text-xl font-black text-white block leading-none">{categoryCount}</span>
                <span className="text-[11px] text-text-secondary font-medium">Categorías</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

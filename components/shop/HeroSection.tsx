import React from 'react'
import Link from 'next/link'

export function HeroSection({ title, subtitle, imageUrl }: { title: string | null; subtitle: string | null; imageUrl: string | null }) {
  const displayTitle = title || "SHOWROOM JR";
  const displaySubtitle = subtitle || "Tu tienda premium online";
  const titleWords = displayTitle.split(' ');
  const firstWord = titleWords.shift();
  const restOfTitle = titleWords.join(' ');

  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center bg-dot-grid py-20 overflow-hidden">
      <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="text-accent">{firstWord}</span> {restOfTitle}
        </h1>
        <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-10">{displaySubtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Link href="/catalogo" className="bg-accent hover:bg-accent-hover text-primary font-bold py-3 px-8 rounded-full text-center transition-all w-full sm:w-auto">Ver Catálogo</Link>
          <Link href="/categorias" className="bg-secondary border border-border hover:border-text-secondary text-text-primary font-bold py-3 px-8 rounded-full text-center transition-all w-full sm:w-auto">Explorar Categorías</Link>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-primary pointer-events-none" />
    </section>
  )
}

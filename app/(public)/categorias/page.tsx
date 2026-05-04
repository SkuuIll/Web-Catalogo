import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Grid2x2, Sparkles } from 'lucide-react';

export const revalidate = 60;

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: { where: { active: true } } } } },
  });

  return (
    <div className="min-h-screen bg-bg-primary py-10 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent mb-8 transition-colors duration-200 group">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Volver al inicio
        </Link>
        <div className="mb-8 md:mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              <Sparkles className="h-3 w-3 fill-accent" />
              Explorar
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-gradient tracking-tight mb-3">Categorías</h1>
            <p className="text-text-secondary text-base md:text-lg max-w-2xl">Encontrá rápido ropa, tecnología, herramientas, accesorios y productos de uso diario.</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-card/50 px-4 py-3 text-sm text-text-secondary">
            <span className="font-black text-white text-lg">{categories.length}</span>
            <span className="block text-xs">categorías activas</span>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 stagger">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="group catalog-surface relative bg-card border border-white/[0.04] rounded-xl overflow-hidden hover:border-accent/30 hover:-translate-y-1.5 transition-all duration-400 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              >
                <div className="relative aspect-[16/10] min-[420px]:aspect-square w-full bg-secondary/30 overflow-hidden">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-[1.08] transition-transform duration-600"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/60 to-secondary/30">
                      <Grid2x2 className="w-12 h-12 text-text-secondary/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </div>
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-white mb-0.5 truncate group-hover:text-accent transition-colors duration-300">{category.name}</h2>
                    <p className="text-[11px] text-text-secondary">{category._count.products} productos</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-text-secondary/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-secondary bg-card/30 backdrop-blur-md rounded-xl border border-white/[0.06]">
            <p className="text-xl">Aún no hay categorías disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Grid2x2 } from 'lucide-react';

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
        <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </Link>
        <div className="mb-8 md:mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Explorar</p>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">Categorías</h1>
            <p className="text-text-secondary text-base md:text-xl max-w-2xl">Encontrá rápido ropa, tecnología, herramientas, accesorios y productos de uso diario.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-card px-4 py-3 text-sm text-text-secondary">
            <span className="font-black text-white">{categories.length}</span> categorías activas
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="group catalog-surface relative bg-card border border-white/5 rounded-lg overflow-hidden hover:border-accent/35 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] min-[420px]:aspect-square w-full bg-secondary/50 overflow-hidden">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/80">
                      <Grid2x2 className="w-12 h-12 text-text-secondary/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-white mb-1 truncate">{category.name}</h2>
                    <p className="text-xs text-text-secondary">{category._count.products} productos</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-text-secondary transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-secondary bg-card/40 backdrop-blur-md rounded-lg border border-white/10">
            <p className="text-xl">Aún no hay categorías disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PackageSearch, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/shop/ProductCard';

export const revalidate = 60;

export default async function CategoriaSlugPage({ params }: { params: { slug: string } }) {
  const config = await prisma.siteConfig.findFirst();
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category || !category.active) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: { active: true, categoryId: category.id },
    include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-bg-primary py-10 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 fade-up">
          <Link href="/categorias" className="text-text-secondary hover:text-accent transition-colors">Categorías</Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-secondary/40" />
          <span className="text-white font-medium">{category.name}</span>
        </nav>

        <div className="mb-8 md:mb-12 fade-up" style={{ animationDelay: '80ms' }}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Categoría</p>
          <h1 className="text-3xl md:text-5xl font-black text-gradient tracking-tight mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-text-secondary text-base md:text-lg max-w-2xl">{category.description}</p>
          )}
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-card/50 px-3.5 py-2 text-sm text-text-secondary">
            <span className="font-black text-white">{products.length}</span> productos encontrados
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 stagger">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} config={config} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-secondary bg-card/30 backdrop-blur-md rounded-xl border border-white/[0.06] px-4">
            <PackageSearch className="mx-auto mb-4 h-12 w-12 text-text-secondary/20" />
            <p className="text-xl font-bold">No hay productos en esta categoría.</p>
            <p className="text-sm mt-2">Probá explorar otras categorías o el catálogo completo.</p>
            <Link href="/catalogo" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-black hover:bg-accent-hover transition-colors">
              Ver catálogo completo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PackageSearch } from 'lucide-react';
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
        <Link href="/categorias" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Volver a categorías
        </Link>
        <div className="mb-8 md:mb-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Categoría</p>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-text-secondary text-base md:text-xl max-w-2xl">{category.description}</p>
          )}
          <p className="text-text-secondary text-sm mt-3">{products.length} productos encontrados</p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} config={config} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-secondary bg-card/40 backdrop-blur-md rounded-lg border border-white/10 px-4">
            <PackageSearch className="mx-auto mb-4 h-12 w-12 text-text-secondary/40" />
            <p className="text-xl">No hay productos en esta categoría.</p>
            <Link href="/catalogo" className="mt-5 inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-black hover:bg-accent-hover">
              Ver catálogo completo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

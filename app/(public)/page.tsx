import React from 'react';
import { prisma } from '@/lib/prisma';
import { HeroSection } from '@/components/shop/HeroSection';
import { TrustBadges } from '@/components/shop/TrustBadges';
import { ProductCard } from '@/components/shop/ProductCard';

export const revalidate = 60;

export default async function HomePage() {
  const config = await prisma.siteConfig.findFirst();
  const featuredProducts = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    take: 8,
  });

  let products = featuredProducts;
  if (products.length < 4) {
    const latestProducts = await prisma.product.findMany({
      where: { active: true, id: { notIn: products.map(p => p.id) } },
      include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { createdAt: 'desc' },
      take: 8 - products.length,
    });
    products = [...products, ...latestProducts];
  }

  return (
    <>
      <HeroSection title={config?.heroTitle || null} subtitle={config?.heroSubtitle || null} imageUrl={config?.heroImageUrl || null} />
      <TrustBadges config={config} />
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Destacados</h2>
            <p className="text-text-secondary">Nuestra selección premium para vos.</p>
          </div>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => <ProductCard key={product.id} product={product} config={config} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-text-secondary bg-card rounded-xl border border-border">
            <p className="text-xl">Aún no hay productos disponibles.</p>
          </div>
        )}
      </section>
    </>
  );
}

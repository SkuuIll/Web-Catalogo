import React from 'react';
import { prisma } from '@/lib/prisma';
import { HeroSection } from '@/components/shop/HeroSection';
import { TrustBadges } from '@/components/shop/TrustBadges';
import { ProductCard } from '@/components/shop/ProductCard';
import { FeaturedProductCard } from '@/components/shop/FeaturedProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Grid2x2, Sparkles, Zap } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [config, productCount, categoryCount, categories] = await Promise.all([
    prisma.siteConfig.findFirst(),
    prisma.product.count({ where: { active: true } }),
    prisma.category.count({ where: { active: true } }),
    prisma.category.findMany({
      where: { active: true },
      include: { _count: { select: { products: { where: { active: true, status: 'PUBLISHED' } } } } },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    }),
  ]);

  const featuredProducts = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    take: 1,
  });

  const regularProducts = await prisma.product.findMany({
    where: {
      active: true,
      id: { notIn: featuredProducts.map(p => p.id) },
    },
    include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  const featured = featuredProducts[0] || null;

  return (
    <>
      <HeroSection
        title={config?.heroTitle || null}
        subtitle={config?.heroSubtitle || null}
        imageUrl={config?.heroImageUrl || null}
        logoUrl={config?.logoUrl || null}
        productCount={productCount}
        categoryCount={categoryCount}
      />
      <TrustBadges config={config} />

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 pt-10 md:pt-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Comprar por rubro</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gradient">Categorías destacadas</h2>
            </div>
            <Link href="/categorias" className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/[0.06] px-4 py-2 text-sm font-bold text-text-secondary transition-all duration-300 hover:border-accent/30 hover:text-accent hover:bg-accent/[0.05]">
              Ver categorías
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 stagger">
            {categories.map((category) => (
              <Link key={category.id} href={`/categorias/${category.slug}`} className="group relative overflow-hidden rounded-xl border border-white/[0.04] bg-card transition-all duration-400 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
                <div className="relative aspect-[4/3] bg-secondary/40">
                  {category.imageUrl ? (
                    <Image src={category.imageUrl} alt={category.name} fill className="object-cover transition-transform duration-600 group-hover:scale-[1.08]" sizes="(max-width: 768px) 50vw, 16vw" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary/80 to-secondary/40">
                      <Grid2x2 className="h-8 w-8 text-text-secondary/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <h3 className="line-clamp-1 text-sm font-black text-white">{category.name}</h3>
                  <p className="text-[11px] font-medium text-text-secondary">{category._count.products} productos</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="py-12 md:py-20 container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Novedades</p>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-gradient">Productos para descubrir</h2>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-text-secondary">Una selección visual para entrar rápido al producto, consultar stock y pedir más información por WhatsApp.</p>
          </div>
          <Link href="/catalogo" className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/[0.06] px-4 py-2 text-sm font-bold text-text-secondary transition-all duration-300 hover:border-accent/30 hover:text-accent hover:bg-accent/[0.05]">
            Ver todo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {/* Featured + regular grid */}
        {(featured || regularProducts.length > 0) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 stagger">
            {/* Featured product takes 2 columns */}
            {featured && <FeaturedProductCard product={featured} />}
            
            {/* Regular products */}
            {regularProducts.map((product) => (
              <ProductCard key={product.id} product={product} config={config} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-secondary bg-card/30 backdrop-blur-md rounded-xl border border-white/[0.06]">
            <p className="text-xl">Aún no hay productos disponibles.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-14 md:pb-20">
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-card/60">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 md:p-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.07] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
                <Sparkles className="h-3 w-3 fill-accent" />
                Atención directa
              </div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-gradient">Encontrá, compará y consultá sin vueltas</h2>
              <p className="mt-3 max-w-xl text-text-secondary text-sm md:text-base leading-relaxed">El catálogo está preparado para muchos rubros: talles, colores, marcas, herramientas, tecnología y productos diarios. Cada ficha puede tener datos claros para decidir mejor.</p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link href="/catalogo" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-black text-black hover:bg-accent-hover transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(200,149,42,0.25)]">
                  Explorar catálogo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/contacto" className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] px-6 py-3 text-sm font-bold text-text-secondary hover:text-white hover:border-white/20 transition-all duration-300">
                  Contacto
                </Link>
              </div>
            </div>
            <div className="min-h-[220px] bg-dot-grid relative hidden md:block">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_40%_40%,rgba(200,149,42,0.15),transparent)]" />
              {/* Decorative floating element */}
              <div className="absolute top-10 right-10 w-20 h-20 rounded-2xl border border-accent/20 bg-accent/5 float-soft opacity-60" />
              <div className="absolute bottom-8 left-8 right-8 rounded-xl border border-white/[0.06] bg-black/40 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 text-accent fill-accent" />
                  </div>
                  <p className="text-sm font-bold text-white">Catálogo flexible</p>
                </div>
                <p className="text-xs text-text-secondary">Ropa, gorras, zapatillas, herramientas, tecnología y más.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

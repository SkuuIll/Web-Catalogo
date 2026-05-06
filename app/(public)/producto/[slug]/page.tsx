import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatPriceARS } from '@/lib/price-formatter';
import { ArrowLeft, ShieldCheck, Truck, Ruler, Palette, BadgeCheck, Wrench, ChevronRight, Share2, Heart } from 'lucide-react';
import { generateProductWhatsAppMessage } from '@/lib/whatsapp';
import { ProductCard } from '@/components/shop/ProductCard';
import { WhatsAppTrackedLink } from '@/components/shop/WhatsAppTrackedLink';
import { ProductGallery } from '@/components/shop/ProductGallery';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!product) return {};
  const primaryImage = product.ogImageUrl || product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url;
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || undefined,
    keywords: product.metaKeywords || undefined,
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.shortDescription || undefined,
      images: primaryImage ? [primaryImage] : undefined,
    },
  };
}

export default async function ProductoPage({ params }: { params: { slug: string } }) {
  const config = await prisma.siteConfig.findFirst();
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!product) {
    notFound();
  }
  if (!product.active || product.status !== 'PUBLISHED') {
    notFound();
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => undefined);

  const relatedProducts = await prisma.product.findMany({
    where: {
      active: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take: 4,
  });

  const price = formatPriceARS(Number(product.price));
  const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage ? primaryImage.url : '/placeholder.png';
  const requestHeaders = headers();
  const protocol = requestHeaders.get('x-forwarded-proto') || 'http';
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || 'localhost:3000';
  const productUrl = `${protocol}://${host}/producto/${product.slug}`;
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${protocol}://${host}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;

  const cleanNumber = config?.whatsappNumber?.replace(/\D/g, '') || '';
  const message = generateProductWhatsAppMessage(product.name, product.price, config?.whatsappMessage ?? undefined, product.whatsappMessageOverride, productUrl);
  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
  const discount = hasDiscount ? Math.round((1 - Number(product.price) / Number(product.compareAtPrice)) * 100) : 0;

  const attributeGroups = [
    { label: 'Marca', value: product.brand, icon: BadgeCheck },
    { label: 'Modelo', value: product.model, icon: BadgeCheck },
    { label: 'Talles / variantes', value: product.sizes, icon: Ruler },
    { label: 'Colores', value: product.colors, icon: Palette },
    { label: 'Detalles', value: product.specs, icon: Wrench },
  ].filter(item => item.value);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.metaDescription || product.shortDescription || product.description || undefined,
    image: imageUrl ? [absoluteImageUrl] : undefined,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    category: product.category.name,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: config?.currencyCode || 'ARS',
      price: Number(product.price),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-3 sm:pt-6 md:pt-10 pb-24 md:pb-20 px-3 sm:px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-3 sm:mb-6 fade-up">
          <Link href="/catalogo" className="text-text-secondary hover:text-accent transition-colors">Catálogo</Link>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-text-secondary/40" />
          <Link href={`/categorias/${product.category.slug}`} className="text-text-secondary hover:text-accent transition-colors truncate max-w-[100px] sm:max-w-none">{product.category.name}</Link>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-text-secondary/40" />
          <span className="text-white font-medium truncate max-w-[120px] sm:max-w-[200px]">{product.name}</span>
        </nav>

        <div className="bg-card/30 backdrop-blur-xl border border-white/[0.06] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/20 fade-up" style={{ animationDelay: '100ms' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Gallery Area */}
            <div className="relative min-w-0 bg-secondary/20 p-0 sm:p-4 md:p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/[0.06]">
              {/* Category badge */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10 flex items-center gap-1.5 sm:gap-2">
                <span className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-accent/15 border border-accent/25 text-accent font-bold text-[10px] sm:text-[11px] uppercase tracking-wider backdrop-blur-sm">
                  {product.category.name}
                </span>
                {hasDiscount && (
                  <span className="px-2.5 py-1.5 rounded-full bg-red-500/80 text-[11px] font-black text-white">
                    -{discount}%
                  </span>
                )}
              </div>
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Product Info Area */}
            <div className="p-4 sm:p-6 lg:p-10 flex flex-col">
              {/* Brand */}
              {product.brand && (
                <span className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">{product.brand}</span>
              )}
              
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-5 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              {/* Price block */}
              <div className="flex flex-wrap items-end gap-2.5 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-2xl sm:text-3xl md:text-4xl font-black text-gradient-accent">{price}</span>
                {product.compareAtPrice && (
                  <div className="flex flex-col">
                    <span className="text-base text-text-secondary line-through font-medium">
                      {formatPriceARS(Number(product.compareAtPrice))}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs font-bold text-emerald-400">Ahorrás {discount}%</span>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-5 sm:mb-7">
                <p className="text-[13px] sm:text-sm md:text-base text-text-secondary leading-relaxed whitespace-pre-line">
                  {product.description || product.shortDescription || 'Sin descripción disponible.'}
                </p>
              </div>

              {/* Attributes */}
              {attributeGroups.length > 0 && (
                <div className="mb-5 sm:mb-7 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 sm:p-4">
                  <h2 className="mb-3 sm:mb-4 text-xs font-bold uppercase tracking-[0.16em] text-accent">Características</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {attributeGroups.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className={`${item.label === 'Detalles' ? 'sm:col-span-2' : ''} rounded-lg bg-secondary/40 p-3 transition-colors duration-300 hover:bg-secondary/60`}>
                          <div className="mb-1 flex items-center gap-2 text-[11px] font-bold text-text-secondary">
                            <Icon className="h-3.5 w-3.5 text-accent" />
                            {item.label}
                          </div>
                          <p className="text-sm font-semibold leading-relaxed text-white whitespace-pre-line">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-5 sm:mb-7">
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] transition-colors duration-300 hover:bg-white/[0.04]">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10 border border-purple-500/15">
                    <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-bold text-white">Envío a todo el país</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] transition-colors duration-300 hover:bg-white/[0.04]">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  </div>
                  <p className="text-[11px] sm:text-xs font-bold text-white">Compra Segura</p>
                </div>
              </div>

              {/* Stock + CTA */}
              <div className="mt-auto pt-6 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm text-text-secondary">Disponibilidad:</span>
                  <div className="flex flex-col items-end gap-1.5">
                    {product.stock > 0 ? (
                      <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
                        En Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-full text-xs font-bold border border-red-500/20">
                        Agotado
                      </span>
                    )}
                    {product.deliveryMode === 'POR_PEDIDO' && (
                      <span className="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-xs font-bold border border-amber-500/20">
                        ⚠️ Por pedido
                      </span>
                    )}
                  </div>
                </div>

                {config?.whatsappNumber ? (
                  <WhatsAppTrackedLink href={waUrl} productId={product.id} />
                ) : (
                  <button disabled className="w-full bg-secondary text-text-secondary font-bold py-5 px-8 rounded-xl cursor-not-allowed border border-white/[0.06]">
                    Ventas pausadas momentáneamente
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 md:mt-18 fade-up" style={{ animationDelay: '200ms' }}>
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">También te puede interesar</p>
                <h2 className="text-2xl md:text-3xl font-black text-gradient">Productos relacionados</h2>
              </div>
              <Link href={`/categorias/${product.category.slug}`} className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/[0.06] px-4 py-2 text-sm font-bold text-text-secondary hover:border-accent/30 hover:text-accent hover:bg-accent/[0.05] transition-all duration-300">
                Ver categoría
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 stagger">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} config={config} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

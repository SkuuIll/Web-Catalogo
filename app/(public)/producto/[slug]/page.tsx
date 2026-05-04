import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatPriceARS } from '@/lib/price-formatter';
import { ArrowLeft, ShieldCheck, Truck, Ruler, Palette, BadgeCheck, Wrench } from 'lucide-react';
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
    <div className="min-h-screen bg-bg-primary pt-20 md:pt-24 pb-24 md:pb-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="container mx-auto max-w-6xl">
        <Link href="/catalogo" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Volver al catálogo
        </Link>

        <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
            {/* Image Gallery Area */}
            <div className="relative min-w-0 bg-secondary/30 p-4 sm:p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="absolute top-6 left-6 z-10">
                <span className="px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent font-bold text-xs uppercase tracking-wider shadow-lg">
                  {product.category.name}
                </span>
              </div>
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Product Info Area */}
            <div className="p-5 sm:p-8 lg:p-12 flex flex-col">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-end gap-3 sm:gap-4 mb-7">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-accent">{price}</span>
                {product.compareAtPrice && (
                  <span className="text-xl text-text-secondary line-through mb-2 font-medium">
                    {formatPriceARS(Number(product.compareAtPrice))}
                  </span>
                )}
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-base sm:text-lg text-text-secondary leading-relaxed whitespace-pre-line">
                  {product.description || product.shortDescription || 'Sin descripción disponible.'}
                </p>
              </div>

              {attributeGroups.length > 0 && (
                <div className="mb-8 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-accent">Características</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {attributeGroups.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className={item.label === 'Detalles' ? 'sm:col-span-2 rounded-lg bg-secondary/70 p-3' : 'rounded-lg bg-secondary/70 p-3'}>
                          <div className="mb-1 flex items-center gap-2 text-xs font-bold text-text-secondary">
                            <Icon className="h-4 w-4 text-accent" />
                            {item.label}
                          </div>
                          <p className="text-sm font-semibold leading-relaxed text-white whitespace-pre-line">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/5">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Truck className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Envío a todo el país</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/5">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Compra Segura</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-text-secondary">Disponibilidad:</span>
                  {product.stock > 0 ? (
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-bold border border-green-500/20">
                      En Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm font-bold border border-red-500/20">
                      Agotado
                    </span>
                  )}
                </div>

                {config?.whatsappNumber ? (
                  <WhatsAppTrackedLink href={waUrl} productId={product.id} />
                ) : (
                  <button disabled className="w-full bg-secondary text-text-secondary font-bold py-5 px-8 rounded-lg cursor-not-allowed border border-white/10">
                    Ventas pausadas momentáneamente
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <section className="mt-12 md:mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">También te puede interesar</p>
                <h2 className="text-2xl md:text-3xl font-black text-white">Productos relacionados</h2>
              </div>
              <Link href={`/categorias/${product.category.slug}`} className="hidden sm:inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-text-secondary hover:border-accent/40 hover:text-accent">
                Ver categoría
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
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

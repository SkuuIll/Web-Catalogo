'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPriceARS } from '@/lib/price-formatter'
import { generateProductWhatsAppMessage } from '@/lib/whatsapp'
import { MessageCircle, Tag, Eye } from 'lucide-react'

export function ProductCard({ product, config }: { product: any, config: any }) {
  const price = formatPriceARS(Number(product.price));
  const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage ? primaryImage.url : '/placeholder.png';
  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
  const discount = hasDiscount ? Math.round((1 - Number(product.price) / Number(product.compareAtPrice)) * 100) : 0;

  const handleWA = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!config?.whatsappNumber) return;
    fetch('/api/analytics/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, source: 'CARD' }),
    }).catch(() => undefined);
    const productUrl = `${window.location.origin}/producto/${product.slug}`;
    const message = generateProductWhatsAppMessage(product.name, product.price, config.whatsappMessage ?? undefined, product.whatsappMessageOverride, productUrl);
    const cleanNumber = config.whatsappNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="group catalog-surface relative border border-white/[0.04] rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-400 flex flex-col h-full hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)] shine-card">
      <Link href={`/producto/${product.slug}`} className="flex-1 flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/5] sm:aspect-square w-full bg-secondary/40 overflow-hidden">
           <Image
             src={imageUrl}
             alt={product.name}
             fill
             className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
             sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
           />
           {/* Overlay gradients */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
           
           {/* Quick View indicator (desktop only) */}
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
             <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
               <Eye className="w-4 h-4 text-white" />
               <span className="text-xs font-bold text-white hidden sm:inline">Ver detalle</span>
             </div>
           </div>

           {/* Badges */}
           <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
             {hasDiscount && (
               <span className="rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-black text-white shadow-lg shadow-red-500/20">
                 -{discount}%
               </span>
             )}
             {product.featured && (
               <span className="rounded-lg border border-accent/30 bg-black/50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-accent backdrop-blur-sm">
                 Top
               </span>
             )}
           </div>

           {/* Stock badge */}
           <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
             <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm ${product.stock > 0 ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/15 text-red-300 border border-red-500/20'}`}>
               {product.stock > 0 ? 'En stock' : 'Agotado'}
             </span>
           </div>
        </div>

        {/* Info */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1">
          <span className="mb-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
            <Tag className="h-2.5 w-2.5 text-accent" />
            {product.brand || product.category?.name || 'Categoría'}
          </span>
          <h3 className="text-[13px] sm:text-sm font-bold text-white line-clamp-2 mb-1.5 flex-1 leading-snug">
            {product.name}
          </h3>
          {(product.sizes || product.colors) && (
            <p className="mb-2 line-clamp-1 text-[10px] font-medium text-text-secondary">
              {[product.sizes && `Talles: ${product.sizes}`, product.colors && `Colores: ${product.colors}`].filter(Boolean).join(' · ')}
            </p>
          )}
          <div className="flex items-baseline gap-2 mt-auto pt-1">
            <span className="text-base sm:text-lg font-black text-gradient-accent">{price}</span>
            {product.compareAtPrice && (
              <span className="text-[11px] font-medium text-text-secondary line-through">
                {formatPriceARS(Number(product.compareAtPrice))}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* WhatsApp CTA */}
      {config?.whatsappNumber && (
        <button
          onClick={handleWA}
          className="mx-3 mb-3 inline-flex items-center justify-center gap-2 rounded-lg border border-accent/20 bg-accent/[0.07] px-3 py-2 text-xs font-bold text-accent opacity-100 transition-all duration-300 hover:bg-accent hover:text-black hover:border-accent md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Consultar
        </button>
      )}
    </div>
  )
}

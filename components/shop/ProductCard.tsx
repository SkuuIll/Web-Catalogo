'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPriceARS } from '@/lib/price-formatter'
import { generateProductWhatsAppMessage } from '@/lib/whatsapp'
import { MessageCircle, Tag } from 'lucide-react'

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
    const message = generateProductWhatsAppMessage(product.name, product.price, config.whatsappMessage ?? undefined, product.whatsappMessageOverride);
    const cleanNumber = config.whatsappNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="group catalog-surface relative border border-white/5 rounded-xl overflow-hidden hover:border-accent/35 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(0,0,0,0.35)] shine-card">
      <Link href={`/producto/${product.slug}`} className="flex-1 flex flex-col">
        {/* Image */}
        <div className="relative aspect-square w-full bg-secondary/50 overflow-hidden">
           <Image
             src={imageUrl}
             alt={product.name}
             fill
             className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
             sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
           />
           <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
           <div className="absolute left-3 top-3 flex flex-col gap-2">
             {hasDiscount && (
               <span className="rounded-lg bg-red-500 px-2 py-1 text-[10px] font-black text-white shadow-lg">
                 -{discount}%
               </span>
             )}
             {product.featured && (
               <span className="rounded-lg border border-accent/30 bg-black/45 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-accent backdrop-blur">
                 Top
               </span>
             )}
           </div>
           <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
             <span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${product.stock > 0 ? 'bg-green-500/15 text-green-300 border border-green-500/20' : 'bg-red-500/15 text-red-300 border border-red-500/20'}`}>
               {product.stock > 0 ? 'Stock disponible' : 'Agotado'}
             </span>
           </div>
        </div>
        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <span className="mb-2 inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary uppercase tracking-wider">
            <Tag className="h-3 w-3 text-accent" />
            {product.brand || product.category?.name || 'Categoría'}
          </span>
          <h3 className="text-sm md:text-base font-bold text-white line-clamp-2 mb-2 flex-1">
            {product.name}
          </h3>
          {(product.sizes || product.colors) && (
            <p className="mb-3 line-clamp-1 text-[11px] font-medium text-text-secondary">
              {[product.sizes && `Talles: ${product.sizes}`, product.colors && `Colores: ${product.colors}`].filter(Boolean).join(' · ')}
            </p>
          )}
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-base md:text-lg font-black text-accent">{price}</span>
            {product.compareAtPrice && (
              <span className="text-xs font-medium text-text-secondary line-through">
                {formatPriceARS(Number(product.compareAtPrice))}
              </span>
            )}
          </div>
        </div>
      </Link>
      {config?.whatsappNumber && (
        <button
          onClick={handleWA}
          className="mx-3 mb-3 inline-flex items-center justify-center gap-2 rounded-lg border border-accent/25 bg-accent/10 px-3 py-2 text-xs font-bold text-accent opacity-100 transition-all hover:bg-accent hover:text-black md:opacity-0 md:group-hover:opacity-100"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Consultar
        </button>
      )}
    </div>
  )
}

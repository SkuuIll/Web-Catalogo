import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPriceARS } from '@/lib/price-formatter'
import { generateProductWhatsAppMessage } from '@/lib/whatsapp'

export function ProductCard({ product, config }: { product: any, config: any }) {
  const price = formatPriceARS(Number(product.price));
  const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage ? primaryImage.url : '/placeholder.png';

  const handleWA = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!config?.whatsappNumber) return;
    const message = generateProductWhatsAppMessage(product.name, product.price, config.whatsappMessage, product.whatsappMessageOverride);
    const cleanNumber = config.whatsappNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-accent transition-colors flex flex-col h-full">
      <Link href={`/producto/${product.slug}`} className="flex-1">
        <div className="relative aspect-square w-full bg-secondary">
           <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <span className="text-xs text-text-secondary mb-1 block uppercase tracking-wider">{product.category?.name}</span>
          <h3 className="text-sm md:text-base font-semibold text-text-primary line-clamp-2 mb-2 flex-1">{product.name}</h3>
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-text-primary">{price}</span>
              {product.compareAtPrice && <span className="text-sm text-text-secondary line-through">{formatPriceARS(Number(product.compareAtPrice))}</span>}
            </div>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button onClick={handleWA} className="w-full bg-accent hover:bg-accent-hover text-primary font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /></svg>
          Consultar
        </button>
      </div>
    </div>
  )
}

'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPriceARS } from '@/lib/price-formatter'

export function FeaturedProductCard({ product }: { product: any }) {
  const price = formatPriceARS(Number(product.price))
  const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0]
  const imageUrl = primaryImage ? primaryImage.url : '/placeholder.png'

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group relative col-span-2 md:col-span-2 rounded-xl overflow-hidden bg-card border border-white/10 hover:border-accent/45 transition-all duration-300 block hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.4)] shine-card"
    >
      <div className="relative aspect-[16/10] md:aspect-[2/1] w-full">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover scale-[1.06] transition-transform duration-700 ease-out group-hover:scale-[1.12]"
          sizes="(max-width: 768px) 100vw, 66vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Featured label */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider">
            Destacado
          </span>
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
            {product.name}
          </h3>
          <span className="text-lg md:text-xl font-black text-accent">
            {price}
          </span>
        </div>
      </div>
    </Link>
  )
}

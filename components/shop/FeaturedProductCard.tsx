'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPriceARS } from '@/lib/price-formatter'
import { Sparkles, ArrowRight } from 'lucide-react'

export function FeaturedProductCard({ product }: { product: any }) {
  const price = formatPriceARS(Number(product.price))
  const primaryImage = product.images?.find((img: any) => img.isPrimary) || product.images?.[0]
  const imageUrl = primaryImage ? primaryImage.url : '/placeholder.png'
  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price)
  const discount = hasDiscount ? Math.round((1 - Number(product.price) / Number(product.compareAtPrice)) * 100) : 0

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group relative col-span-1 sm:col-span-2 rounded-xl overflow-hidden bg-card border border-white/[0.06] hover:border-accent/40 transition-all duration-500 block hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(0,0,0,0.45)] shine-card"
    >
      <div className="relative aspect-[16/10] md:aspect-[2.2/1] w-full">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 768px) 100vw, 66vw"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        {/* Featured label */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/15 backdrop-blur-md border border-accent/25 text-accent text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 fill-accent" />
            Destacado
          </span>
          {hasDiscount && (
            <span className="px-2.5 py-1.5 rounded-full bg-red-500/80 text-[11px] font-black text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-3 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-lg sm:text-xl md:text-2xl font-black text-gradient-accent">
              {price}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm font-medium text-white/50 line-through">
                {formatPriceARS(Number(product.compareAtPrice))}
              </span>
            )}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white/70 group-hover:text-accent transition-colors duration-300">
            Ver producto
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}

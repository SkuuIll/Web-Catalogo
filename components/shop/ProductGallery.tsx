'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ImageIcon, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

type GalleryImage = {
  id: string
  url: string
  altText?: string | null
  isPrimary?: boolean
}

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const orderedImages = images.length > 0 ? images : [{ id: 'placeholder', url: '/placeholder.png', altText: productName }]
  const primary = orderedImages.find((image) => image.isPrimary) || orderedImages[0]
  const [selectedIdx, setSelectedIdx] = useState(() => orderedImages.indexOf(primary))
  const selected = orderedImages[selectedIdx] || primary

  const goNext = () => setSelectedIdx((i) => (i + 1) % orderedImages.length)
  const goPrev = () => setSelectedIdx((i) => (i - 1 + orderedImages.length) % orderedImages.length)

  return (
    <div className="flex h-full w-full min-w-0 flex-col gap-3">
      {/* Main Image */}
      <div className="group relative flex min-h-[300px] w-full flex-1 items-center justify-center overflow-hidden rounded-xl bg-secondary/20 sm:min-h-[440px]">
        <Image
          src={selected.url}
          alt={selected.altText || productName}
          fill
          className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Zoom icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="rounded-full bg-black/50 backdrop-blur-sm p-3 border border-white/10">
            <ZoomIn className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Navigation arrows (shown when multiple images) */}
        {orderedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-sm p-2 border border-white/10 text-white/80 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-sm p-2 border border-white/10 text-white/80 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image counter pill */}
        {orderedImages.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 border border-white/10">
            <span className="text-[11px] font-bold text-white/80">
              {selectedIdx + 1} / {orderedImages.length}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {orderedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {orderedImages.map((image, idx) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-secondary transition-all duration-300 ${
                selectedIdx === idx
                  ? 'border-accent shadow-lg shadow-accent/15 scale-105'
                  : 'border-white/[0.06] hover:border-white/20 opacity-70 hover:opacity-100'
              }`}
              aria-label={`Ver imagen ${idx + 1} de ${productName}`}
            >
              {image.url ? (
                <Image src={image.url} alt={image.altText || productName} fill className="object-cover" sizes="64px" />
              ) : (
                <ImageIcon className="m-auto h-5 w-5 text-text-secondary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

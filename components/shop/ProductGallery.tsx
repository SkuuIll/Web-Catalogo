'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

type GalleryImage = {
  id: string
  url: string
  altText?: string | null
  isPrimary?: boolean
}

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const orderedImages = images.length > 0 ? images : [{ id: 'placeholder', url: '/placeholder.png', altText: productName }]
  const primary = orderedImages.find((image) => image.isPrimary) || orderedImages[0]
  const [selectedId, setSelectedId] = useState(primary.id)
  const selected = orderedImages.find((image) => image.id === selectedId) || primary

  return (
    <div className="flex h-full w-full min-w-0 flex-col gap-4">
      <div className="relative flex min-h-[320px] w-full flex-1 items-center justify-center overflow-hidden rounded-lg bg-secondary/30 sm:min-h-[460px]">
        <Image
          src={selected.url}
          alt={selected.altText || productName}
          fill
          className="object-cover drop-shadow-2xl transition-transform duration-500 ease-out hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {orderedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {orderedImages.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedId(image.id)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-secondary transition-colors ${selected.id === image.id ? 'border-accent' : 'border-white/10 hover:border-white/30'}`}
              aria-label={`Ver imagen de ${productName}`}
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

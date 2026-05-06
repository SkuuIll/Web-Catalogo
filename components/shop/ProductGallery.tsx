'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { ImageIcon, ZoomIn, ChevronLeft, ChevronRight, X } from 'lucide-react'

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

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  const goNext = () => setSelectedIdx((i) => (i + 1) % orderedImages.length)
  const goPrev = () => setSelectedIdx((i) => (i - 1 + orderedImages.length) % orderedImages.length)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > 50) goNext()
    if (distance < -50) goPrev()
  }

  useEffect(() => {
    setMounted(true)
    if (isFullscreen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isFullscreen])

  return (
    <>
      <div className="flex h-full w-full min-w-0 flex-col gap-3">
        {/* Main Image */}
        <div 
          className="group relative flex w-full flex-1 items-center justify-center overflow-hidden bg-secondary/20 aspect-square lg:aspect-auto lg:h-[600px] cursor-pointer sm:rounded-xl"
          onClick={() => setIsFullscreen(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={selected.url}
            alt={selected.altText || productName}
            fill
            className="object-contain lg:object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="rounded-full bg-black/50 backdrop-blur-sm p-3 border border-white/10">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </div>

          {orderedImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-sm p-2 border border-white/10 text-white/80 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-sm p-2 border border-white/10 text-white/80 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

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
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar px-3 sm:px-0">
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

      {/* Fullscreen Modal via Portal */}
      {isFullscreen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-sm tracking-wider drop-shadow-md">
                {selectedIdx + 1} / {orderedImages.length}
              </span>
            </div>
            <button onClick={() => setIsFullscreen(false)} className="p-2.5 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors border border-white/10 backdrop-blur-md">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div 
            className="absolute inset-0 w-full h-full flex items-center justify-center z-10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image 
              src={selected.url} 
              alt={selected.altText || productName} 
              fill 
              className="object-contain" 
              quality={100}
              priority
              sizes="100vw"
            />
            
            {orderedImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 border border-white/10 text-white hover:bg-black/80 transition-all hidden sm:block z-20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goNext() }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 border border-white/10 text-white hover:bg-black/80 transition-all hidden sm:block z-20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  linkText: string | null;
  position: string;
  active: boolean;
}

interface BannerCarouselProps {
  banners: Banner[];
  position: string;
}

export function BannerCarousel({ banners, position }: BannerCarouselProps) {
  const filteredBanners = banners.filter(b => b.position === position && b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredBanners.length);
  }, [filteredBanners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredBanners.length) % filteredBanners.length);
  }, [filteredBanners.length]);

  useEffect(() => {
    if (filteredBanners.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [filteredBanners.length, nextSlide]);

  if (filteredBanners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden group">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {filteredBanners.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0 relative">
            {banner.linkUrl ? (
              <Link href={banner.linkUrl} className="block w-full h-full">
                <BannerImage banner={banner} position={position} />
              </Link>
            ) : (
              <BannerImage banner={banner} position={position} />
            )}
          </div>
        ))}
      </div>

      {filteredBanners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {filteredBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-4 bg-accent' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BannerImage({ banner, position }: { banner: Banner; position: string }) {
  // Ajustar altura dependiendo de la posición
  const heightClasses = position === 'HERO' 
    ? "h-[180px] sm:h-[240px] md:h-[320px] lg:h-[400px]" 
    : "h-[120px] sm:h-[160px] md:h-[200px] lg:h-[240px]";
    
  return (
    <div className={`relative w-full ${heightClasses} bg-secondary/30`}>
      <Image 
        src={banner.imageUrl} 
        alt={banner.title} 
        fill 
        className="object-cover"
        priority={position === 'HERO'}
        unoptimized
      />
      {banner.title && banner.title.toLowerCase() !== 'sin titulo' && banner.title.toLowerCase() !== 'banner' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none flex items-end p-4 sm:p-6">
          <h3 className="text-white font-bold text-lg sm:text-xl drop-shadow-md">{banner.title}</h3>
        </div>
      )}
    </div>
  );
}

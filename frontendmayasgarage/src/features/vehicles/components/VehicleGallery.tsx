'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { VehicleImage } from '@/shared/types';

function resolveUrl(url: string): string {
  if (url.startsWith('http')) return url;
  return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
}

interface VehicleGalleryProps {
  images: VehicleImage[];
  alt: string;
}

export function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
        <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const active = images[activeIndex];

  return (
    <>
      {/* Main image */}
      <div
        className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={resolveUrl(active.image)}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 70vw"
          priority
          loading="eager"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                idx === activeIndex ? 'border-accent' : 'border-transparent'
              }`}
            >
              <Image src={resolveUrl(img.image)} alt={`${alt} ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300"
            onClick={() => setLightboxOpen(false)}
          >
            ×
          </button>
          {/* Prev/Next */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 text-white text-4xl hover:text-gray-300 px-2"
                onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i - 1 + images.length) % images.length); }}
              >
                ‹
              </button>
              <button
                className="absolute right-4 text-white text-4xl hover:text-gray-300 px-2"
                onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i + 1) % images.length); }}
              >
                ›
              </button>
            </>
          )}
          <div className="relative max-w-4xl w-full aspect-video" onClick={(e) => e.stopPropagation()}>
            <Image src={resolveUrl(active.image)} alt={alt} fill className="object-contain" />
          </div>
          <p className="absolute bottom-4 text-white text-sm">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}

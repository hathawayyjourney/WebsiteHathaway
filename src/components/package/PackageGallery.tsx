'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PackageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  if (images.length === 0) return null;

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-4">
      <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-gray-200 cursor-zoom-in" onClick={() => setLightbox(true)}>
        <Image src={images[active]} alt={alt} fill priority className="object-cover" sizes="(min-width: 1024px) 800px, 100vw" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Foto ${i + 1}`}
              className={`relative h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition ${i === active ? 'border-brand-navy' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <button className="absolute top-6 right-6 text-white text-xl font-bold" aria-label="Tutup">&times;</button>
          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image src={images[active]} alt={alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

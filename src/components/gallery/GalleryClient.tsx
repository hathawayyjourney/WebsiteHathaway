'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import type { SiteImage } from '@/src/lib/image-assets';
import { PHOTO_CATEGORIES as DB_PHOTO_CATEGORIES } from '@/src/db/enums';
import Reveal from '@/src/components/ui/Reveal';

const TABS = ['FOTO', 'VIDEO TOUR', 'VIDEO TESTIMONI'];
const PHOTO_CATEGORIES = ['Semua', ...DB_PHOTO_CATEGORIES];

export type GalleryPhoto = { id: number; category: string; url: string; title: string | null };
export type GalleryVideo = { id: number; type: string; title: string; thumb: string; videoUrl: string | null };

/** YouTube watch/short links → embed URL; other URLs are played with <video>. */
function youtubeEmbed(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
}

export default function GalleryClient({
  photos: PHOTOS,
  videos: VIDEOS,
  heroImage,
}: {
  photos: GalleryPhoto[];
  videos: GalleryVideo[];
  heroImage?: SiteImage | null;
}) {
  const [activeTab, setActiveTab] = useState('FOTO');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const filteredPhotos = activeCategory === 'Semua' 
    ? PHOTOS 
    : PHOTOS.filter(p => p.category === activeCategory);

  const filteredVideos = VIDEOS.filter(v => v.type === activeTab);

  return (
    <>
      
      <main className="min-h-screen pt-20 pb-20 bg-brand-light">
        <PageHero
          title="GALLERY"
          subtitle="Kumpulan momen indah perjalanan dan testimoni dari pelanggan Hathaway Journey."
          image={heroImage}
        />

        <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
          <Breadcrumb items={[{ label: 'Gallery' }]} />

          {/* Main Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition ${
                  activeTab === tab 
                    ? 'bg-brand-navy text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Photo Categories (Only show if FOTO tab is active) */}
          {activeTab === 'FOTO' && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {PHOTO_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                    activeCategory === cat 
                      ? 'bg-brand-red text-white' 
                      : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {(activeTab === 'FOTO' ? filteredPhotos.length : filteredVideos.length) === 0 && (
            <p className="text-center text-sm text-brand-muted py-10">Belum ada konten pada kategori ini.</p>
          )}

          {/* Grid Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activeTab === 'FOTO' ? (
              filteredPhotos.map((photo, i) => (
                <Reveal key={photo.id} delay={(i % 3) * 80}>
                <div
                  className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition"
                  onClick={() => setLightboxImg(photo.url)}
                >
                  <Image src={photo.url} alt={photo.title || photo.category} fill className="object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </div>
                </Reveal>
              ))
            ) : (
              filteredVideos.map((video, i) => (
                <Reveal key={video.id} delay={(i % 3) * 80}>
                <div className="relative h-64 rounded-2xl overflow-hidden group shadow-sm cursor-pointer" onClick={() => video.videoUrl && setActiveVideo(video.videoUrl)}>
                  <Image src={video.thumb} alt={video.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-red group-hover:text-white transition">
                      <Play fill="currentColor" className="text-white ml-1" />
                    </div>
                    <p className="text-white font-bold text-center px-4">{video.title}</p>
                  </div>
                </div>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </main>


      {/* Video Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <button className="absolute top-6 right-6 text-white text-xl font-bold" aria-label="Tutup">&times;</button>
          <div className="relative w-full max-w-5xl aspect-video" onClick={(e) => e.stopPropagation()}>
            {youtubeEmbed(activeVideo) ? (
              <iframe src={youtubeEmbed(activeVideo)!} title="Video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="w-full h-full rounded-xl" />
            ) : (
              <video src={activeVideo} controls autoPlay className="w-full h-full rounded-xl bg-black" />
            )}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
          <button className="absolute top-6 right-6 text-white text-xl font-bold">&times;</button>
          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image src={lightboxImg} alt="Fullscreen" fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}

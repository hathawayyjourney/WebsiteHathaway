'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import Header from '@/src/components/layout/Header';
import Footer from '@/src/components/layout/Footer';
import WhatsAppFloating from '@/src/components/ui/WhatsAppFloating';
import Breadcrumb from '@/src/components/ui/Breadcrumb';

const TABS = ['FOTO', 'VIDEO TOUR', 'VIDEO TESTIMONI'];
const PHOTO_CATEGORIES = ['Semua', 'Foto Grup', 'Foto Destinasi', 'Foto Hotel', 'Foto Aktivitas'];

const PHOTOS = [
  { id: 1, category: 'Foto Grup', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop' },
  { id: 2, category: 'Foto Destinasi', url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800&auto=format&fit=crop' },
  { id: 3, category: 'Foto Hotel', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop' },
  { id: 4, category: 'Foto Aktivitas', url: 'https://images.unsplash.com/photo-1533654793924-4fc4949ea7bf?q=80&w=800&auto=format&fit=crop' },
  { id: 5, category: 'Foto Grup', url: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?q=80&w=800&auto=format&fit=crop' },
  { id: 6, category: 'Foto Destinasi', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop' },
];

const VIDEOS = [
  { id: 1, type: 'VIDEO TOUR', title: 'Japan Autumn Tour 2023', thumb: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=800&auto=format&fit=crop' },
  { id: 2, type: 'VIDEO TESTIMONI', title: 'Testimoni Keluarga Bpk. Andi', thumb: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop' },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState('FOTO');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const filteredPhotos = activeCategory === 'Semua' 
    ? PHOTOS 
    : PHOTOS.filter(p => p.category === activeCategory);

  const filteredVideos = VIDEOS.filter(v => v.type === activeTab);

  return (
    <>
      <Header />
      
      <main className="min-h-screen pt-20 pb-20 bg-brand-light">
        {/* Page Hero Area */}
        <div className="bg-brand-navy py-16 lg:py-20 relative overflow-hidden mb-10">
          <div className="container mx-auto px-4 lg:px-8 max-w-[1250px] relative z-10 text-center">
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">GALLERY</h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Kumpulan momen indah perjalanan dan testimoni dari pelanggan Hathaway Journey.
            </p>
          </div>
        </div>

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

          {/* Grid Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activeTab === 'FOTO' ? (
              filteredPhotos.map((photo) => (
                <div 
                  key={photo.id} 
                  className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition"
                  onClick={() => setLightboxImg(photo.url)}
                >
                  <Image src={photo.url} alt={photo.category} fill className="object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </div>
              ))
            ) : (
              filteredVideos.map((video) => (
                <div key={video.id} className="relative h-64 rounded-2xl overflow-hidden group shadow-sm cursor-pointer">
                  <Image src={video.thumb} alt={video.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-red group-hover:text-white transition">
                      <Play fill="currentColor" className="text-white ml-1" />
                    </div>
                    <p className="text-white font-bold text-center px-4">{video.title}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />

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

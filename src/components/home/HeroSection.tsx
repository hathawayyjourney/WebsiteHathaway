import Link from 'next/link';
import Image from 'next/image';
import { Plane, Phone } from 'lucide-react';
import { getImage } from '@/src/lib/images';

export default function HeroSection({ whatsappHref }: { whatsappHref: string }) {
  const background = getImage('homeHero');

  return (
    <section className="relative pt-20 lg:pt-28 pb-32 lg:pb-48 flex items-center min-h-[600px] bg-brand-light">
      {/* Background image (public/images/home/hero.webp, falls back to the original photo) */}
      <div className="absolute inset-0 z-0">
        {background && <Image src={background.src} alt="" fill priority sizes="100vw" className="object-cover object-center" />}
        <div className="absolute inset-0 bg-white/70 lg:bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-[1250px]">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-brand-red font-bold text-sm tracking-widest mb-4">
            TRAVEL THE WORLD <Plane size={16} className="rotate-45" />
          </div>
          
          <h1 className="text-4xl lg:text-[60px] font-black leading-[1.1] mb-6 tracking-tight">
            <span className="text-brand-navy block">EXPLORE MORE,</span>
            <span className="text-brand-red block">CREATE MEMORIES</span>
          </h1>
          
          <p className="text-brand-dark/80 text-lg mb-10 max-w-[450px] leading-relaxed">
            Temukan pengalaman perjalanan terbaik bersama Hathaway Journey. Kami hadir untuk mewujudkan perjalanan impian Anda.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/paket-tour"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-navy text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-navy-sec transition shadow-lg"
            >
              <Plane size={18} className="rotate-45" />
              Lihat Paket
            </Link>
            
            <a 
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-brand-navy border-2 border-brand-navy px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition shadow-sm"
            >
              <Phone size={18} fill="currentColor" className="text-brand-wa" />
              Konsultasi via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

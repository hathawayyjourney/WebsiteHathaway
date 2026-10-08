import Link from 'next/link';
import Image from 'next/image';
import { Plane, Phone } from 'lucide-react';
import { getImage } from '@/src/lib/images';

// Navy shading so white text reads on the busy collage: strong behind the text column on the left,
// fading out so the landmarks in the middle/right stay vivid. On mobile the text spans the full width,
// so the whole photo gets an even tint. Plain rgba() (not Tailwind /opacity) for older Safari.
// #082A63 = brand-navy.
const OVERLAY_DESKTOP =
  'linear-gradient(to right, rgba(8,42,99,0.9) 0%, rgba(8,42,99,0.75) 30%, rgba(8,42,99,0.25) 55%, rgba(8,42,99,0) 70%)';
const OVERLAY_MOBILE = 'linear-gradient(to bottom, rgba(8,42,99,0.75) 0%, rgba(8,42,99,0.6) 60%, rgba(8,42,99,0.35) 100%)';
const TEXT_SHADOW = '0 2px 12px rgba(0,0,0,0.35)';

export default function HeroSection({ whatsappHref }: { whatsappHref: string }) {
  const background = getImage('homeHero');

  return (
    <section className="relative pt-20 lg:pt-28 pb-32 lg:pb-48 flex items-center min-h-[600px] bg-brand-light">
      {/* Background image (public/images/home/hero.webp, falls back to the original photo) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {background && <Image src={background.src} alt="" fill priority sizes="100vw" className="object-cover object-center anim-ken-burns" />}
        <div className="absolute inset-0 hidden lg:block" style={{ backgroundImage: OVERLAY_DESKTOP }}></div>
        <div className="absolute inset-0 lg:hidden" style={{ backgroundImage: OVERLAY_MOBILE }}></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-[1250px]">
        <div className="max-w-2xl">
          <div className="anim-fade-up flex items-center gap-2 text-white font-bold text-sm tracking-widest mb-4" style={{ textShadow: TEXT_SHADOW }}>
            TRAVEL THE WORLD <Plane size={16} className="rotate-45 text-brand-red" />
          </div>
          
          <h1 className="anim-fade-up text-4xl lg:text-[60px] font-black leading-[1.1] mb-6 tracking-tight" style={{ '--anim-delay': '120ms', textShadow: TEXT_SHADOW } as React.CSSProperties}>
            {/* Screen readers and search engines read the brand + main keyword; the visible headline is unchanged. */}
            <span className="sr-only">Hathaway Journey – Paket Tour Luar Negeri: </span>
            <span className="text-white block">EXPLORE MORE,</span>{' '}
            <span className="text-brand-red block">CREATE MEMORIES</span>
          </h1>
          
          <p
            className="anim-fade-up text-lg mb-10 max-w-[450px] leading-relaxed"
            style={{ '--anim-delay': '240ms', color: 'rgba(255,255,255,0.9)', textShadow: TEXT_SHADOW } as React.CSSProperties}
          >
            Temukan pengalaman perjalanan terbaik bersama Hathaway Journey. Kami hadir untuk mewujudkan perjalanan impian Anda.
          </p>

          <div className="anim-fade-up flex flex-col sm:flex-row items-center gap-4" style={{ '--anim-delay': '360ms' } as React.CSSProperties}>
            <Link 
              href="/paket-tour"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-brand-navy px-8 py-3.5 rounded-full font-semibold hover:bg-brand-softblue transition btn-press shadow-lg"
            >
              <Plane size={18} className="rotate-45" />
              Lihat Paket
            </Link>
            
            <a 
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-wa text-white border-brand-wa px-8 py-3.5 rounded-full font-semibold hover:bg-green-600 hover:border-green-600 transition btn-press shadow-md"
            >
              <Phone size={18} fill="currentColor" />
              Konsultasi via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

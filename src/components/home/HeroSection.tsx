import Link from 'next/link';
import { Plane, Phone } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-20 lg:pt-28 pb-32 lg:pb-48 flex items-center min-h-[600px] bg-brand-light">
      {/* Background Image Setup - Using an absolute div with next/image or background image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')",
        }}
      >
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
              href="https://wa.me/628000000000"
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

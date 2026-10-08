import { Phone } from 'lucide-react';
import Image from 'next/image';
import { getImage } from '@/src/lib/images';

export default function FinalCTA({ whatsappHref }: { whatsappHref: string }) {
  const background = getImage('homeCta');

  return (
    <section className="py-16 container mx-auto px-4 lg:px-8 max-w-[1250px]">
      <div className="relative rounded-3xl overflow-hidden bg-brand-softblue flex flex-col md:flex-row items-center justify-between p-8 lg:p-12 min-h-[300px]">
        {/* Background Image Area (Optional or half screen) */}
        {background && (
          <div className="absolute top-0 right-0 bottom-0 w-full md:w-1/2 opacity-20 md:opacity-100 z-0 pointer-events-none">
            <Image
              src={background.src}
              alt={background.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover mask-gradient-to-l"
              style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black)' }}
            />
          </div>
        )}

        <div className="relative z-10 max-w-xl md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0 text-center md:text-left">
          <h2 className="text-3xl lg:text-4xl font-black text-brand-navy mb-4 leading-tight tracking-tight">
            SIAP BERPETUALANG<br />BERSAMA KAMI?
          </h2>
          <p className="text-brand-dark/80 text-lg mb-0 max-w-[400px]">
            Wujudkan perjalanan impian Anda bersama Hathaway Journey, konsultasi gratis sekarang!
          </p>
        </div>

        <div className="relative z-10 w-full md:w-auto flex justify-center md:justify-end">
          <a 
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-wa hover:bg-green-600 text-white px-8 py-5 rounded-full font-bold flex items-center justify-center gap-3 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto"
          >
            <div className="bg-white/20 p-1 rounded-full">
              <Phone size={24} fill="currentColor" className="text-white" />
            </div>
            <div className="text-left leading-tight">
              <span className="block text-sm font-semibold opacity-90 uppercase tracking-wider">Konsultasi Gratis</span>
              <span className="block text-xl">VIA WHATSAPP</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

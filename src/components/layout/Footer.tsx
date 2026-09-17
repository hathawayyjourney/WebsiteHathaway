import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: About */}
          <div>
            <div className="text-white font-black text-xl italic tracking-tighter flex items-center mb-6">
              <span className="text-brand-red mr-1">✈</span> HATHAWAY
              <span className="font-medium ml-1">JOURNEY</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Hathaway Journey adalah partner perjalanan terpercaya Anda. Kami menyediakan berbagai pilihan paket tour domestik dan internasional dengan pelayanan terbaik.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition text-xs font-bold">
                IG
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition text-xs font-bold">
                FB
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition text-xs font-bold">
                YT
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Beranda', href: '/' },
                { name: 'Paket Tour', href: '/paket-tour' },
                { name: 'Destinasi', href: '/destinasi' },
                { name: 'Gallery', href: '/gallery' },
                { name: 'Tentang Kami', href: '/tentang-kami' },
                { name: 'Blog', href: '/blog' },
                { name: 'Kontak', href: '/kontak' },
              ].map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={18} className="text-brand-red shrink-0 mt-0.5" />
                <span>Jl. Travel Agent No. 123, Jakarta Selatan, 12345, Indonesia</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={18} className="text-brand-red shrink-0" />
                <span>+62 800 0000 000</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={18} className="text-brand-red shrink-0" />
                <span>hello@hathawayjourney.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="text-gray-400 hover:text-white transition text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Hathaway Journey. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

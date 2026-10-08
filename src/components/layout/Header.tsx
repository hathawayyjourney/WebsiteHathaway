'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calendar, Menu, Phone, X } from 'lucide-react';
import Image from 'next/image';

const NAV_ITEMS = [
  { name: 'Beranda', href: '/' },
  { name: 'Paket Tour', href: '/paket-tour' },
  { name: 'Destinasi', href: '/destinasi' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Tentang Kami', href: '/tentang-kami' },
  { name: 'Kontak', href: '/kontak' },
];

export default function Header({ whatsappHref }: { whatsappHref: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Stronger shadow once the page is scrolled.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    const frame = requestAnimationFrame(update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
    };
  }, []);
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between max-w-[1250px]">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Hathaway Journey Logo" 
              width={160} 
              height={50} 
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold transition-colors hover:text-brand-red ${
                isActive(item.href) ? 'text-brand-navy border-b-2 border-brand-red pb-1' : 'text-brand-dark'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/booking"
            className="hidden md:flex items-center gap-2 bg-brand-navy text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-navy-sec transition"
          >
            <Calendar size={16} />
            Booking
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="w-10 h-10 bg-brand-wa text-white rounded-full flex items-center justify-center hover:bg-green-600 transition shadow-sm"
          >
            <Phone size={18} fill="currentColor" />
          </a>
          {/* Mobile hamburger (FSD FR-HOME-001) */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-brand-navy hover:bg-gray-100 transition"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="anim-slide-down lg:hidden border-t border-gray-100 bg-white px-4 pb-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 text-sm font-semibold border-b border-gray-100 transition-colors hover:text-brand-red ${
                isActive(item.href) ? 'text-brand-red' : 'text-brand-dark'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setMenuOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 bg-brand-navy text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-brand-navy-sec transition"
          >
            <Calendar size={16} />
            Booking
          </Link>
        </nav>
      )}
    </header>
  );
}

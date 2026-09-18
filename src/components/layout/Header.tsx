'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Phone } from 'lucide-react';
import Image from 'next/image';

const NAV_ITEMS = [
  { name: 'Beranda', href: '/' },
  { name: 'Paket Tour', href: '/paket-tour' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Tentang Kami', href: '/tentang-kami' },
  { name: 'Kontak', href: '/kontak' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
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
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold transition-colors hover:text-brand-red ${
                  isActive ? 'text-brand-navy border-b-2 border-brand-red pb-1' : 'text-brand-dark'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
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
            href="https://wa.me/628000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-brand-wa text-white rounded-full flex items-center justify-center hover:bg-green-600 transition shadow-sm"
          >
            <Phone size={18} fill="currentColor" />
          </a>
        </div>
      </div>
    </header>
  );
}

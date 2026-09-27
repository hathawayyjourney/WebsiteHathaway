'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Building2,
  CircleHelp,
  Images,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  MessageSquareQuote,
  Package,
  Settings,
  Tags,
  Users,
  X,
} from 'lucide-react';

const ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/paket', label: 'Paket & Jadwal', icon: Package },
  { href: '/admin/destinasi', label: 'Destinasi', icon: MapPin },
  { href: '/admin/kategori', label: 'Kategori Trip', icon: Tags },
  { href: '/admin/gallery', label: 'Gallery', icon: Images },
  { href: '/admin/testimoni', label: 'Testimoni', icon: MessageSquareQuote },
  { href: '/admin/faq', label: 'FAQ', icon: CircleHelp },
  { href: '/admin/perusahaan', label: 'Profil Perusahaan', icon: Building2 },
  { href: '/admin/pesan', label: 'Pesan Masuk', icon: Mail },
  { href: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
  { href: '/admin/users', label: 'Users', icon: Users, superOnly: true },
];

export default function AdminNav({ isSuperAdmin, unread }: { isSuperAdmin: boolean; unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="space-y-1">
      {ITEMS.filter((i) => !i.superOnly || isSuperAdmin).map((item) => {
        const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              active ? 'bg-white text-brand-navy' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            <span className="flex-1">{item.label}</span>
            {item.href === '/admin/pesan' && unread > 0 && (
              <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unread}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="lg:hidden text-brand-navy" aria-label="Buka menu">
        <Menu size={24} />
      </button>
      <aside className="hidden lg:block fixed top-16 bottom-0 left-0 w-64 bg-brand-navy p-4 pt-6 overflow-y-auto">{nav}</aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <aside className="w-72 h-full bg-brand-navy p-4" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setOpen(false)} className="text-white mb-6" aria-label="Tutup menu">
              <X size={24} />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}

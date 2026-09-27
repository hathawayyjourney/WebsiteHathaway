import Image from 'next/image';
import Link from 'next/link';
import { count, eq } from 'drizzle-orm';
import { ExternalLink, LogOut } from 'lucide-react';
import AdminNav from '@/src/components/admin/AdminNav';
import { requireUser } from '@/src/server/auth/session';
import { logout } from '@/src/server/actions/auth';
import { db } from '@/src/db';
import { contactMessages } from '@/src/db/schema';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [{ unread }] = await db.select({ unread: count() }).from(contactMessages).where(eq(contactMessages.isRead, false));

  return (
    <div className="min-h-screen bg-brand-light">
      <header className="fixed top-0 inset-x-0 z-40 h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <AdminNav isSuperAdmin={user.role === 'SUPER_ADMIN'} unread={unread} />
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Hathaway Journey" width={120} height={40} className="h-9 w-auto object-contain" />
            <span className="hidden sm:inline text-xs font-bold text-brand-muted tracking-widest">ADMIN</span>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" target="_blank" className="hidden sm:inline-flex items-center gap-1.5 text-brand-navy font-semibold hover:text-brand-red transition">
            Lihat Website <ExternalLink size={14} />
          </Link>
          <span className="hidden md:inline text-brand-muted">
            {user.name} · <span className="font-semibold">{user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}</span>
          </span>
          <form action={logout}>
            <button type="submit" className="inline-flex items-center gap-1.5 text-brand-red font-semibold hover:underline">
              <LogOut size={16} /> Keluar
            </button>
          </form>
        </div>
      </header>
      <main className="pt-20 pb-12 px-4 lg:pl-72 lg:pr-8">{children}</main>
    </div>
  );
}

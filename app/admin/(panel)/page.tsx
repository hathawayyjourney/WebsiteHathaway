import Link from 'next/link';
import { and, asc, count, desc, eq, gte, sql } from 'drizzle-orm';
import { CalendarDays, Mail, MapPin, Package } from 'lucide-react';
import { Panel } from '@/src/components/admin/fields';
import { db } from '@/src/db';
import { contactMessages, destinations, packages, schedules } from '@/src/db/schema';
import { formatDate, singleLine } from '@/src/lib/format';
import { SCHEDULE_BADGE, SCHEDULE_LABELS } from '@/src/lib/schedule';

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ forbidden?: string }> }) {
  const { forbidden } = await searchParams;
  const [[pkgStats], [destStats], [msgStats], upcoming, messages] = await Promise.all([
    db
      .select({ total: count(), active: sql<number>`SUM(${packages.status} = 'PUBLISHED')` })
      .from(packages),
    db.select({ total: count() }).from(destinations),
    db.select({ unread: count() }).from(contactMessages).where(eq(contactMessages.isRead, false)),
    db
      .select({ id: schedules.id, date: schedules.departureDate, status: schedules.status, seatsLeft: schedules.seatsLeft, packageId: packages.id, name: packages.name })
      .from(schedules)
      .innerJoin(packages, eq(packages.id, schedules.packageId))
      .where(and(gte(schedules.departureDate, sql`CURDATE()`)))
      .orderBy(asc(schedules.departureDate))
      .limit(8),
    db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(5),
  ]);

  const stats = [
    { label: 'Total Paket', value: pkgStats.total, icon: Package, href: '/admin/paket' },
    { label: 'Paket Aktif', value: Number(pkgStats.active ?? 0), icon: Package, href: '/admin/paket' },
    { label: 'Destinasi', value: destStats.total, icon: MapPin, href: '/admin/destinasi' },
    { label: 'Pesan Belum Dibaca', value: msgStats.unread, icon: Mail, href: '/admin/pesan' },
  ];

  return (
    <div className="space-y-6">
      {forbidden && <p className="bg-red-50 text-brand-red text-sm font-medium px-4 py-3 rounded-xl">Anda tidak memiliki akses ke halaman tersebut.</p>}
      <h1 className="text-2xl font-black text-brand-navy">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-full bg-brand-softblue text-brand-navy flex items-center justify-center shrink-0">
              <s.icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-navy leading-none">{s.value}</p>
              <p className="text-xs text-brand-muted mt-1">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Panel title="Keberangkatan Terdekat">
          {upcoming.length === 0 ? (
            <p className="text-sm text-brand-muted">Belum ada jadwal.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {upcoming.map((u) => (
                <li key={u.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <CalendarDays size={18} className="text-brand-navy shrink-0" />
                    <div className="min-w-0">
                      <Link href={`/admin/paket/${u.packageId}#jadwal`} className="text-sm font-semibold text-brand-dark hover:text-brand-navy truncate block">
                        {singleLine(u.name)}
                      </Link>
                      <p className="text-xs text-brand-muted">
                        {formatDate(u.date)}
                        {u.seatsLeft != null && ` · sisa ${u.seatsLeft} kursi`}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${SCHEDULE_BADGE[u.status]}`}>{SCHEDULE_LABELS[u.status]}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Pesan Terbaru" actions={<Link href="/admin/pesan" className="text-xs font-semibold text-brand-navy hover:underline">Lihat semua</Link>}>
          {messages.length === 0 ? (
            <p className="text-sm text-brand-muted">Belum ada pesan.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {messages.map((m) => (
                <li key={m.id} className="py-3">
                  <p className="text-sm font-semibold text-brand-dark">
                    {!m.isRead && <span className="inline-block w-2 h-2 rounded-full bg-brand-red mr-2" />}
                    {m.name} <span className="text-brand-muted font-normal">· {m.subject || 'Tanpa subjek'}</span>
                  </p>
                  <p className="text-xs text-brand-muted line-clamp-1">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

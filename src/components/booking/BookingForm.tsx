'use client';

import { useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';
import type { ScheduleStatus } from '@/src/db/enums';
import { formatDate, singleLine } from '@/src/lib/format';
import { SCHEDULE_LABELS, isBookable } from '@/src/lib/schedule';
import { buildBookingWaLink } from '@/src/lib/whatsapp';
import { track } from '@/src/lib/analytics';

type PackageOption = { slug: string; name: string; schedules: { date: string; status: ScheduleStatus }[] };

const field =
  'w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition';

export default function BookingForm({
  packages,
  initialSlug,
  whatsapp,
  template,
  siteUrl,
}: {
  packages: PackageOption[];
  initialSlug?: string;
  whatsapp: string;
  template: string;
  siteUrl: string;
}) {
  const [slug, setSlug] = useState(packages.some((p) => p.slug === initialSlug) ? initialSlug! : '');
  const [date, setDate] = useState('');
  const [pax, setPax] = useState(1);

  const pkg = packages.find((p) => p.slug === slug);
  const schedules = pkg?.schedules ?? [];

  const href = pkg
    ? buildBookingWaLink({
        number: whatsapp,
        template,
        packageName: singleLine(pkg.name),
        date: date ? formatDate(date) : undefined,
        pax,
        url: `${siteUrl}/paket-tour/${pkg.slug}`,
      })
    : '';

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="booking-package" className="block text-sm font-semibold text-gray-700 mb-2">Paket Tour</label>
        <div className="relative">
          <select
            id="booking-package"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setDate('');
            }}
            className={field}
          >
            <option value="">Pilih paket tour</option>
            {packages.map((p) => (
              <option key={p.slug} value={p.slug}>{singleLine(p.name)}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="booking-date" className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Keberangkatan</label>
          <div className="relative">
            <select id="booking-date" value={date} onChange={(e) => setDate(e.target.value)} disabled={!pkg} className={`${field} disabled:opacity-60`}>
              <option value="">{schedules.length ? 'Pilih tanggal' : 'Belum ada jadwal — tanya admin'}</option>
              {schedules.map((s) => (
                <option key={s.date} value={s.date} disabled={!isBookable(s.status)}>
                  {formatDate(s.date)}{isBookable(s.status) ? '' : ` — ${SCHEDULE_LABELS[s.status]}`}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <div>
          <label htmlFor="booking-pax" className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Peserta</label>
          <input
            id="booking-pax"
            type="number"
            min={1}
            max={99}
            value={pax}
            onChange={(e) => setPax(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
            className={field}
          />
        </div>
      </div>

      {pkg ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('click_booking_wa', { package: pkg.slug, date, pax })}
          className="bg-brand-wa hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md w-full sm:w-auto sm:inline-flex"
        >
          <Phone size={18} fill="currentColor" />
          Lanjut Booking via WhatsApp
        </a>
      ) : (
        <span className="bg-gray-200 text-gray-500 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 w-full sm:w-auto sm:inline-flex cursor-not-allowed">
          <Phone size={18} fill="currentColor" />
          Pilih paket terlebih dahulu
        </span>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Calendar, Minus, Phone, Plus, Users } from 'lucide-react';
import type { ScheduleStatus } from '@/src/db/enums';
import { formatDate, formatRupiah } from '@/src/lib/format';
import { SCHEDULE_BADGE, SCHEDULE_LABELS, isBookable } from '@/src/lib/schedule';
import { buildBookingWaLink } from '@/src/lib/whatsapp';
import { track } from '@/src/lib/analytics';

type Schedule = { id: number; departureDate: string; status: ScheduleStatus; seatsLeft: number | null; quota: number | null };

export default function BookingCard({
  packageName,
  packageUrl,
  price,
  promoPrice,
  childPrice,
  singleSupplement,
  deposit,
  schedules,
  whatsapp,
  bookingTemplate,
  inquiryTemplate,
}: {
  packageName: string;
  packageUrl: string;
  price: number;
  promoPrice: number | null;
  childPrice: number | null;
  singleSupplement: number | null;
  deposit: number | null;
  schedules: Schedule[];
  whatsapp: string;
  bookingTemplate: string;
  inquiryTemplate: string;
}) {
  const firstBookable = schedules.find((s) => isBookable(s.status));
  const [scheduleId, setScheduleId] = useState<number | undefined>(firstBookable?.id);
  const [pax, setPax] = useState(1);

  const selected = schedules.find((s) => s.id === scheduleId);
  const date = selected ? formatDate(selected.departureDate) : undefined;
  const bookingHref = buildBookingWaLink({ number: whatsapp, template: bookingTemplate, packageName, date, pax, url: packageUrl });
  const inquiryHref = buildBookingWaLink({ number: whatsapp, template: inquiryTemplate, packageName, date, url: packageUrl });
  const canBook = schedules.length === 0 || Boolean(selected && isBookable(selected.status));

  const priceRows = [
    { label: 'Harga anak', value: childPrice },
    { label: 'Single supplement', value: singleSupplement },
    { label: 'Deposit', value: deposit },
  ].filter((row) => row.value);

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
      <p className="text-[11px] text-brand-muted font-medium mb-0.5">Mulai dari</p>
      {promoPrice && <p className="text-sm text-brand-muted line-through">Rp {formatRupiah(price)}</p>}
      <div className="flex items-end gap-1 mb-4">
        <p className="text-brand-red font-bold text-3xl">Rp {formatRupiah(promoPrice ?? price)}</p>
        <span className="text-brand-muted text-xs font-medium mb-1.5">/pax</span>
      </div>
      {priceRows.length > 0 && (
        <ul className="text-sm text-gray-600 space-y-1.5 mb-6 border-t border-gray-100 pt-4">
          {priceRows.map((row) => (
            <li key={row.label} className="flex justify-between">
              <span>{row.label}</span>
              <span className="font-semibold text-brand-dark">Rp {formatRupiah(row.value!)}</span>
            </li>
          ))}
        </ul>
      )}

      <h3 className="font-semibold text-brand-dark mb-3 flex items-center gap-2">
        <Calendar size={16} className="text-brand-navy" /> Jadwal Keberangkatan
      </h3>
      {schedules.length === 0 ? (
        <p className="text-sm text-brand-muted mb-6">Jadwal akan diinformasikan. Silakan hubungi admin.</p>
      ) : (
        <div className="space-y-2 mb-6 max-h-72 overflow-y-auto pr-1">
          {schedules.map((s) => {
            const bookable = isBookable(s.status);
            return (
              <label
                key={s.id}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition ${
                  scheduleId === s.id ? 'border-brand-navy bg-brand-softblue' : 'border-gray-200'
                } ${bookable ? 'cursor-pointer hover:border-brand-navy' : 'opacity-60 cursor-not-allowed'}`}
              >
                <input
                  type="radio"
                  name="schedule"
                  className="sr-only"
                  disabled={!bookable}
                  checked={scheduleId === s.id}
                  onChange={() => setScheduleId(s.id)}
                />
                <div>
                  <p className="text-sm font-semibold text-brand-dark">{formatDate(s.departureDate)}</p>
                  {s.seatsLeft != null && bookable && <p className="text-[11px] text-brand-muted">Sisa {s.seatsLeft} kursi</p>}
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${SCHEDULE_BADGE[s.status]}`}>{SCHEDULE_LABELS[s.status]}</span>
              </label>
            );
          })}
        </div>
      )}

      <h3 className="font-semibold text-brand-dark mb-3 flex items-center gap-2">
        <Users size={16} className="text-brand-navy" /> Jumlah Peserta
      </h3>
      <div className="flex items-center gap-3 mb-6">
        <button type="button" aria-label="Kurangi peserta" onClick={() => setPax((p) => Math.max(1, p - 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-brand-navy hover:bg-gray-50 transition">
          <Minus size={16} />
        </button>
        <input
          type="number"
          min={1}
          max={99}
          value={pax}
          onChange={(e) => setPax(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
          aria-label="Jumlah peserta"
          className="w-16 text-center py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:outline-none focus:border-brand-navy"
        />
        <button type="button" aria-label="Tambah peserta" onClick={() => setPax((p) => Math.min(99, p + 1))} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-brand-navy hover:bg-gray-50 transition">
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {canBook ? (
          <a
            href={bookingHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('click_booking_wa', { package: packageName, date, pax })}
            className="block w-full bg-brand-navy hover:bg-brand-navy-sec text-white text-center py-3.5 rounded-full font-semibold transition btn-press shadow-md"
          >
            BOOKING SEKARANG
          </a>
        ) : (
          <span className="block w-full bg-gray-200 text-gray-500 text-center py-3.5 rounded-full font-semibold cursor-not-allowed">
            Jadwal Penuh
          </span>
        )}
        <a
          href={inquiryHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('click_whatsapp', { package: packageName })}
          className="flex items-center justify-center gap-2 w-full bg-brand-wa hover:bg-green-600 text-white py-3.5 rounded-full font-semibold transition btn-press shadow-md"
        >
          <Phone size={18} fill="currentColor" /> WHATSAPP ADMIN
        </a>
      </div>
      <p className="text-[11px] text-brand-muted text-center mt-4">Booking diproses langsung oleh admin kami melalui WhatsApp.</p>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Briefcase, Search, ChevronDown } from 'lucide-react';
import { formatDate } from '@/src/lib/format';
import { track } from '@/src/lib/analytics';

type Option = { slug: string; name: string };

const REGION_OPTIONS = [
  { value: 'region:indonesia', label: 'Indonesia' },
  { value: 'region:asia', label: 'Asia' },
  { value: 'region:eropa', label: 'Eropa' },
  { value: 'region:timur_tengah', label: 'Timur Tengah' },
];

// Native controls are laid invisibly over each field so the original design stays intact.
const overlay = 'absolute inset-0 w-full h-full opacity-0 cursor-pointer';

export default function SearchPackage({ destinations, categories }: { destinations: Option[]; categories: Option[] }) {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  const destinationLabel =
    REGION_OPTIONS.find((o) => o.value === destination)?.label ??
    destinations.find((d) => `negara:${d.slug}` === destination)?.name ??
    'Pilih Destinasi';
  const categoryLabel = categories.find((c) => c.slug === category)?.name ?? 'Semua Jenis';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) {
      const [key, value] = destination.split(':');
      params.set(key, value);
    }
    if (date) params.set('tanggal', date);
    if (category) params.set('jenis', category);
    track('search_package', { destination, date, category });
    router.push(`/paket-tour${params.size ? `?${params}` : ''}`);
  }

  return (
    <div className="relative z-20 container mx-auto px-4 lg:px-8 max-w-[1250px] -mt-16 lg:-mt-24">
      <form onSubmit={handleSubmit} className="bg-white rounded-[20px] shadow-xl p-4 lg:p-6 flex flex-col lg:flex-row items-center gap-4 border border-gray-100">

        {/* Destinasi */}
        <div className="relative flex-1 w-full lg:w-auto flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="w-10 h-10 bg-brand-softblue text-brand-navy rounded-full flex items-center justify-center shrink-0">
            <MapPin size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-brand-muted font-medium mb-0.5">Destinasi</p>
            <p className="text-sm font-semibold text-brand-dark">{destinationLabel}</p>
          </div>
          <ChevronDown size={16} className="text-brand-muted" />
          <select aria-label="Destinasi" value={destination} onChange={(e) => setDestination(e.target.value)} className={overlay}>
            <option value="">Semua Destinasi</option>
            <optgroup label="Wilayah">
              {REGION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </optgroup>
            <optgroup label="Negara / Kota">
              {destinations.map((d) => (
                <option key={d.slug} value={`negara:${d.slug}`}>{d.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Tanggal */}
        <div className="relative flex-1 w-full lg:w-auto flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="w-10 h-10 bg-brand-softblue text-brand-navy rounded-full flex items-center justify-center shrink-0">
            <Calendar size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-brand-muted font-medium mb-0.5">Tanggal</p>
            <p className="text-sm font-semibold text-brand-dark">{date ? formatDate(date, 'short') : 'Pilih Tanggal'}</p>
          </div>
          <ChevronDown size={16} className="text-brand-muted" />
          <input
            type="date"
            aria-label="Tanggal keberangkatan"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onClick={(e) => e.currentTarget.showPicker?.()}
            className={overlay}
          />
        </div>

        {/* Jenis Trip */}
        <div className="relative flex-1 w-full lg:w-auto flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition">
          <div className="w-10 h-10 bg-brand-softblue text-brand-navy rounded-full flex items-center justify-center shrink-0">
            <Briefcase size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-brand-muted font-medium mb-0.5">Jenis Trip</p>
            <p className="text-sm font-semibold text-brand-dark">{categoryLabel}</p>
          </div>
          <ChevronDown size={16} className="text-brand-muted" />
          <select aria-label="Jenis Trip" value={category} onChange={(e) => setCategory(e.target.value)} className={overlay}>
            <option value="">Semua Jenis</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="w-full lg:w-auto pl-0 lg:pl-4">
          <button type="submit" className="w-full lg:w-auto bg-brand-navy hover:bg-brand-navy-sec text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md">
            <Search size={18} />
            Cari Paket
          </button>
        </div>

      </form>
    </div>
  );
}

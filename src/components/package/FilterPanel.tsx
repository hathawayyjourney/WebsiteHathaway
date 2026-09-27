'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { DURATION_BUCKETS, type PackageSearchParams } from '@/src/lib/package-filters';
import { formatRupiah } from '@/src/lib/format';

type Option = { value: string; label: string };
type FilterKey = 'region' | 'negara' | 'jenis' | 'durasi';

const REGION_OPTIONS: Option[] = [
  { value: 'INDONESIA', label: 'Indonesia' },
  { value: 'ASIA', label: 'Asia' },
  { value: 'EROPA', label: 'Eropa' },
  { value: 'TIMUR_TENGAH', label: 'Timur Tengah' },
  { value: 'AFRIKA', label: 'Afrika' },
  { value: 'AMERIKA', label: 'Amerika' },
];
const MAX_PRICE = 50_000_000;

export default function FilterPanel({
  current,
  destinations,
  categories,
}: {
  current: PackageSearchParams;
  destinations: { slug: string; name: string }[];
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(current.q ?? '');
  const [price, setPrice] = useState(current.harga ?? MAX_PRICE);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const firstRender = useRef(true);

  function navigate(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(window.location.search);
    mutate(params);
    params.delete('page');
    router.replace(`${pathname}${params.size ? `?${params}` : ''}`, { scroll: false });
  }

  // Debounced keyword search
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => navigate((p) => (query.trim() ? p.set('q', query.trim()) : p.delete('q'))), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function toggle(key: FilterKey, value: string) {
    navigate((params) => {
      const values = new Set((params.get(key) ?? '').split(',').filter(Boolean));
      if (values.has(value)) values.delete(value);
      else values.add(value);
      if (values.size) params.set(key, [...values].join(','));
      else params.delete(key);
    });
  }

  function commitPrice() {
    navigate((p) => (price < MAX_PRICE ? p.set('harga', String(price)) : p.delete('harga')));
  }

  function reset() {
    setQuery('');
    setPrice(MAX_PRICE);
    navigate((params) => {
      for (const key of ['q', 'region', 'negara', 'jenis', 'durasi', 'harga', 'tanggal']) params.delete(key);
    });
  }

  const selected: Record<FilterKey, string[]> = {
    region: current.region ?? [],
    negara: current.negara ?? [],
    jenis: current.jenis ?? [],
    durasi: current.durasi ?? [],
  };

  const filterSections: { key: FilterKey; title: string; options: Option[] }[] = [
    { key: 'region', title: 'Destinasi', options: REGION_OPTIONS },
    { key: 'negara', title: 'Negara', options: destinations.map((d) => ({ value: d.slug, label: d.name })) },
    { key: 'jenis', title: 'Jenis Trip', options: categories.map((c) => ({ value: c.slug, label: c.name })) },
    { key: 'durasi', title: 'Durasi', options: DURATION_BUCKETS.map((b) => ({ value: b.value, label: b.label })) },
  ];

  const toggleSection = (title: string) => setCollapsed((c) => ({ ...c, [title]: !c[title] }));

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-brand-navy text-lg mb-6 flex items-center justify-between">
        Filter Pencarian
        <button type="button" onClick={reset} className="text-xs font-medium text-brand-red cursor-pointer hover:underline">Reset</button>
      </h3>

      {/* Search Input in Filter */}
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama paket..."
          aria-label="Cari nama paket"
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition"
        />
        <Search size={16} className="absolute left-4 top-3.5 text-gray-400" />
      </div>

      <div className="space-y-6">
        {filterSections.map((section) => (
          <div key={section.key} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <h4
              onClick={() => toggleSection(section.title)}
              className="font-semibold text-brand-dark mb-4 flex items-center justify-between cursor-pointer"
            >
              {section.title}
              <ChevronDown size={16} className={`text-gray-400 transition ${collapsed[section.title] ? '-rotate-90' : ''}`} />
            </h4>
            {!collapsed[section.title] && (
              <div className="space-y-3">
                {section.options.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 rounded border border-gray-300 group-hover:border-brand-navy transition">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={selected[section.key].includes(opt.value)}
                        onChange={() => toggle(section.key, opt.value)}
                      />
                      <div className="w-full h-full rounded bg-brand-navy scale-0 peer-checked:scale-100 transition flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-brand-navy transition">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Harga */}
        <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
          <h4 onClick={() => toggleSection('Harga')} className="font-semibold text-brand-dark mb-4 flex items-center justify-between cursor-pointer">
            Harga
            <ChevronDown size={16} className={`text-gray-400 transition ${collapsed.Harga ? '-rotate-90' : ''}`} />
          </h4>
          {!collapsed.Harga && (
            <div className="space-y-3">
              <input
                type="range"
                aria-label="Harga maksimal"
                className="w-full accent-brand-navy"
                min="0"
                max={MAX_PRICE}
                step="500000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                onPointerUp={commitPrice}
                onKeyUp={commitPrice}
              />
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>Rp 0</span>
                <span>{price < MAX_PRICE ? `Rp ${formatRupiah(price)}` : 'Rp 50.000.000+'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tanggal Keberangkatan */}
        <div className="pb-2">
          <h4 onClick={() => toggleSection('Tanggal')} className="font-semibold text-brand-dark mb-4 flex items-center justify-between cursor-pointer">
            Tanggal Keberangkatan
            <ChevronDown size={16} className={`text-gray-400 transition ${collapsed.Tanggal ? '-rotate-90' : ''}`} />
          </h4>
          {!collapsed.Tanggal && (
            <input
              type="date"
              aria-label="Tanggal keberangkatan"
              value={current.tanggal ?? ''}
              onChange={(e) => navigate((p) => (e.target.value ? p.set('tanggal', e.target.value) : p.delete('tanggal')))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-navy transition text-gray-600"
            />
          )}
        </div>

      </div>
    </div>
  );
}

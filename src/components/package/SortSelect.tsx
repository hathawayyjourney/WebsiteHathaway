'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { SORT_OPTIONS } from '@/src/lib/package-filters';

export default function SortSelect({ value }: { value?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function onChange(sort: string) {
    const params = new URLSearchParams(window.location.search);
    if (sort === 'recommended') params.delete('sort');
    else params.set('sort', sort);
    params.delete('page');
    router.replace(`${pathname}${params.size ? `?${params}` : ''}`, { scroll: false });
  }

  return (
    <div className="relative flex-1 sm:w-48">
      <select
        aria-label="Urutkan"
        value={value ?? 'recommended'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-gray-50 border border-gray-200 text-sm font-semibold text-brand-dark px-4 py-2 pr-10 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-navy cursor-pointer"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
    </div>
  );
}

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type SearchParams = Record<string, string | string[] | undefined>;

function pageList(page: number, total: number): (number | '...')[] {
  const pages = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['...' as const, p] : [p]));
}

export default function Pagination({
  page,
  totalPages,
  basePath,
  searchParams = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: SearchParams;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key !== 'page' && typeof value === 'string') params.set(key, value);
    }
    if (p > 1) params.set('page', String(p));
    return `${basePath}${params.size ? `?${params}` : ''}`;
  };

  const arrow = 'w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 transition';

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      {page > 1 ? (
        <Link href={href(page - 1)} aria-label="Halaman sebelumnya" className={`${arrow} text-brand-navy hover:bg-gray-50`}>
          <ChevronLeft size={18} />
        </Link>
      ) : (
        <span className={`${arrow} text-gray-400 cursor-not-allowed`}>
          <ChevronLeft size={18} />
        </span>
      )}

      {pageList(page, totalPages).map((p, i) =>
        p === '...' ? (
          <span key={`gap-${i}`} className="text-gray-400 px-1">...</span>
        ) : p === page ? (
          <span key={p} aria-current="page" className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-navy text-white font-semibold shadow-md">
            {p}
          </span>
        ) : (
          <Link key={p} href={href(p)} className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-brand-dark hover:border-brand-navy hover:text-brand-navy font-semibold transition">
            {p}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} aria-label="Halaman berikutnya" className={`${arrow} text-brand-navy hover:bg-gray-50`}>
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span className={`${arrow} text-gray-400 cursor-not-allowed`}>
          <ChevronRight size={18} />
        </span>
      )}
    </div>
  );
}

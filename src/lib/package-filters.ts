import { REGIONS } from '@/src/db/enums';

// Shared (client-safe) filter definitions for /paket-tour.

export const PAGE_SIZE = 12;

export const DURATION_BUCKETS = [
  { value: '1-3', label: '1 - 3 Hari', min: 1, max: 3 },
  { value: '4-6', label: '4 - 6 Hari', min: 4, max: 6 },
  { value: '7-10', label: '7 - 10 Hari', min: 7, max: 10 },
  { value: '10+', label: '> 10 Hari', min: 11, max: 999 },
] as const;

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'harga-terendah', label: 'Harga Terendah' },
  { value: 'harga-tertinggi', label: 'Harga Tertinggi' },
  { value: 'terpopuler', label: 'Terpopuler' },
] as const;

export type PackageSearchParams = {
  q?: string;
  region?: string[];
  negara?: string[];
  jenis?: string[];
  durasi?: string[];
  harga?: number;
  tanggal?: string;
  sort?: string;
  page?: number;
};

function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).flatMap((v) => v.split(',')).filter(Boolean);
}

/** Parses Next.js searchParams into typed filters. */
export function parsePackageSearchParams(sp: Record<string, string | string[] | undefined>): PackageSearchParams {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const harga = Number(first(sp.harga));
  const page = Number(first(sp.page));
  const tanggal = first(sp.tanggal);
  return {
    q: first(sp.q)?.trim() || undefined,
    region: list(sp.region).map((r) => r.toUpperCase()).filter((r) => (REGIONS as readonly string[]).includes(r)),
    negara: list(sp.negara),
    jenis: list(sp.jenis),
    durasi: list(sp.durasi),
    harga: Number.isFinite(harga) && harga > 0 ? harga : undefined,
    tanggal: tanggal && /^\d{4}-\d{2}-\d{2}$/.test(tanggal) ? tanggal : undefined,
    sort: first(sp.sort),
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

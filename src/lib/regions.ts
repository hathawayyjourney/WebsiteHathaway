import type { Region } from '@/src/db/enums';

// SEO landing pages per region: /destinasi/wilayah/{slug}, targeting "paket tour {wilayah}" searches.
// "Destinasi Lain" (LAINNYA) has no page: it isn't something people search for.
export type RegionPage = { region: Region; slug: string; label: string; /** "Paket Tour" or "Paket Wisata" */ noun: string };

export const REGION_PAGES: RegionPage[] = [
  { region: 'ASIA', slug: 'asia', label: 'Asia', noun: 'Paket Tour' },
  { region: 'EROPA', slug: 'eropa', label: 'Eropa', noun: 'Paket Tour' },
  { region: 'TIMUR_TENGAH', slug: 'timur-tengah', label: 'Timur Tengah', noun: 'Paket Tour' },
  { region: 'AFRIKA', slug: 'afrika', label: 'Afrika', noun: 'Paket Tour' },
  { region: 'AMERIKA', slug: 'amerika', label: 'Amerika', noun: 'Paket Tour' },
  { region: 'INDONESIA', slug: 'indonesia', label: 'Indonesia', noun: 'Paket Wisata' },
];

export function regionPageBySlug(slug: string): RegionPage | undefined {
  return REGION_PAGES.find((r) => r.slug === slug);
}

export function regionPageHref(region: string): string | undefined {
  const page = REGION_PAGES.find((r) => r.region === region);
  return page ? `/destinasi/wilayah/${page.slug}` : undefined;
}

/** "Jepang, Korea, dan Thailand" */
export function joinNames(names: string[], max = 4): string {
  const list = names.slice(0, max);
  if (list.length <= 1) return list.join('');
  const rest = names.length > max ? ', dan lainnya' : ` dan ${list.pop()}`;
  return list.join(', ') + rest;
}

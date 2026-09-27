const rupiah = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

/** 6990000 → "6.990.000" (no currency prefix; callers render "Rp"). */
export function formatRupiah(value: number): string {
  return rupiah.format(value);
}

/** "2026-09-12" → "12 September 2026" */
export function formatDate(value: string, month: 'long' | 'short' = 'long'): string {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month, year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}

/** Package names may contain manual line breaks for card layout. */
export function singleLine(value: string): string {
  return value.replace(/\s*\n\s*/g, ' ').trim();
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

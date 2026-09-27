// Client-safe helpers — booking is just a pre-filled WhatsApp chat (no DB record).

/** "0812-3456-789" / "+62 812..." → "62812..." */
export function normalizeWaNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
}

export function waLink(number: string, text?: string): string {
  const base = `https://wa.me/${normalizeWaNumber(number)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}

export function buildBookingWaLink(opts: {
  number: string;
  template: string;
  packageName: string;
  date?: string;
  pax?: number | string;
  url?: string;
}): string {
  const text = fillTemplate(opts.template, {
    paket: opts.packageName,
    tanggal: opts.date || 'belum ditentukan',
    peserta: opts.pax ? String(opts.pax) : '-',
    link: opts.url ?? '',
  });
  return waLink(opts.number, text.trim());
}

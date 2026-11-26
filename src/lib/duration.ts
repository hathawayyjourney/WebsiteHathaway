// Package duration as "Hari + Malam". Nights are stored only when admin overrides them
// (e.g. an overnight flight: 6 days / 4 nights); empty means the usual days − 1.

export function durationNights(days: number, nights: number | null | undefined): number {
  return nights ?? Math.max(days - 1, 0);
}

/** 5, null → "5 Hari 4 Malam"; 1, null → "1 Hari". */
export function formatDuration(days: number, nights: number | null | undefined): string {
  const n = durationNights(days, nights);
  return n > 0 ? `${days} Hari ${n} Malam` : `${days} Hari`;
}

/** Card badge: 5, null → "5D4N"; 1, null → "1D". */
export function formatDurationShort(days: number, nights: number | null | undefined): string {
  const n = durationNights(days, nights);
  return n > 0 ? `${days}D${n}N` : `${days}D`;
}

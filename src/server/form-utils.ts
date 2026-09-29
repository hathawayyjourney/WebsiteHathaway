import 'server-only';
import * as z from 'zod';
import type { ActionState } from '@/src/lib/action-state';

// Small FormData helpers for admin server actions.

export const str = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim();
export const optStr = (fd: FormData, key: string) => str(fd, key) || null;
export const bool = (fd: FormData, key: string) => fd.get(key) === 'on' || fd.get(key) === 'true';

/** Decimal input such as a rating ("4.8" or "4,8"). */
export function optDecimal(fd: FormData, key: string): number | null {
  const raw = str(fd, key).replace(',', '.');
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Integer input; tolerates "6.990.000" style thousand separators. */
export function optNum(fd: FormData, key: string): number | null {
  const raw = str(fd, key).replace(/[.\s]/g, '').replace(',', '.');
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Textarea → one entry per non-empty line. */
export const lines = (fd: FormData, key: string) =>
  str(fd, key)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

/** "a | b | c" lines → string tuples. */
export const pipeLines = (fd: FormData, key: string) => lines(fd, key).map((l) => l.split('|').map((p) => p.trim()));

export function invalid(error: z.ZodError): ActionState {
  return { ok: false, message: 'Periksa kembali isian form.', errors: z.flattenError(error).fieldErrors as Record<string, string[]> };
}

/** Maps MySQL duplicate-key errors to a friendly message. */
export function dbError(err: unknown, fallback = 'Gagal menyimpan data.'): ActionState {
  const code = (err as { code?: string; cause?: { code?: string } })?.cause?.code ?? (err as { code?: string })?.code;
  if (code === 'ER_DUP_ENTRY') return { ok: false, message: 'Data dengan slug/email yang sama sudah ada.' };
  console.error(err);
  return { ok: false, message: fallback };
}

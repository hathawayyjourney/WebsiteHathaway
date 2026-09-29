'use server';

import { headers } from 'next/headers';
import * as z from 'zod';
import { db } from '@/src/db';
import { contactMessages } from '@/src/db/schema';
import { ContactSchema, type ContactFormState } from '@/src/lib/validations/contact';

// Simple per-IP throttle (single Node process on Hostinger).
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function throttled(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

export async function submitContact(_prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  // Honeypot: bots fill hidden fields, humans don't.
  if (formData.get('website')) return { ok: true, message: 'Terima kasih! Pesan Anda sudah terkirim.' };

  const input = Object.fromEntries(
    ['name', 'whatsapp', 'email', 'subject', 'message'].map((k) => [k, String(formData.get(k) ?? '')]),
  );
  const parsed = ContactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: z.flattenError(parsed.error).fieldErrors, values: input };

  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  if (throttled(ip)) return { ok: false, message: 'Terlalu banyak pesan. Silakan coba lagi beberapa menit lagi.', values: input };

  try {
    const { email, subject, ...rest } = parsed.data;
    await db.insert(contactMessages).values({ ...rest, email: email || null, subject: subject || null });
  } catch (err) {
    console.error('submitContact failed', err);
    return { ok: false, message: 'Maaf, pesan gagal dikirim. Silakan hubungi kami via WhatsApp.', values: input };
  }
  return { ok: true, message: 'Terima kasih! Pesan Anda sudah terkirim, tim kami akan segera menghubungi Anda.' };
}

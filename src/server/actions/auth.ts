'use server';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { createSession, deleteSession } from '@/src/server/auth/session';

const LoginSchema = z.object({
  email: z.email({ error: 'Email tidak valid.' }).trim().toLowerCase(),
  password: z.string().min(1, { error: 'Password wajib diisi.' }),
});

export type LoginState = { error?: string; email?: string } | undefined;

// Basic brute-force protection: 10 failed attempts per IP per 15 minutes.
const failures = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const recent = (failures.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= 10) return { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' };

  const email = String(formData.get('email') ?? '');
  const parsed = LoginSchema.safeParse({ email, password: formData.get('password') });
  if (!parsed.success) return { error: 'Email dan password wajib diisi dengan benar.', email };

  const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
  const valid = user?.active && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!user || !valid) {
    failures.set(ip, [...recent, now]);
    return { error: 'Email atau password salah.', email };
  }

  failures.delete(ip);
  await createSession(user.id, user.role);
  redirect('/admin');
}

export async function logout() {
  await deleteSession();
  redirect('/admin/login');
}

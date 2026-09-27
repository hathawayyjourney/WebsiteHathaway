'use server';

import bcrypt from 'bcryptjs';
import { and, eq, ne } from 'drizzle-orm';
import { refresh } from 'next/cache';
import * as z from 'zod';
import { db } from '@/src/db';
import { settings, users, ROLES } from '@/src/db/schema';
import type { ActionState } from '@/src/lib/action-state';
import { SETTINGS_DEFAULTS, type SettingKey, type SettingsMap } from '@/src/lib/settings-defaults';
import { normalizeWaNumber } from '@/src/lib/whatsapp';
import { requireUser } from '@/src/server/auth/session';
import { dbError, invalid, lines, optNum, pipeLines, str } from '@/src/server/form-utils';

/** Accepts either a Google Maps embed URL or the full <iframe> snippet. */
function mapsSrc(value: string): string {
  const match = value.match(/src="([^"]+)"/);
  const src = match ? match[1] : value;
  return /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/.test(src) ? src : '';
}

const rows = (fd: FormData, prefix: string, count: number, fields: string[]) =>
  Array.from({ length: count }, (_, i) => Object.fromEntries(fields.map((f) => [f, str(fd, `${prefix}.${i}.${f}`)])));

function build(key: SettingKey, fd: FormData): SettingsMap[SettingKey] | z.ZodError {
  switch (key) {
    case 'contact': {
      const value = {
        whatsapp: normalizeWaNumber(str(fd, 'whatsapp')),
        phoneDisplay: str(fd, 'phoneDisplay'),
        email: str(fd, 'email'),
        address: str(fd, 'address'),
        hours: str(fd, 'hours'),
        mapsEmbedUrl: mapsSrc(str(fd, 'mapsEmbedUrl')),
      };
      const parsed = z
        .object({
          whatsapp: z.string().regex(/^62\d{8,13}$/, { error: 'Nomor WhatsApp tidak valid (contoh: 0812xxxx atau 62812xxxx).' }),
          email: z.email({ error: 'Email tidak valid.' }),
        })
        .safeParse(value);
      return parsed.success ? value : parsed.error;
    }
    case 'social':
      return { instagram: str(fd, 'instagram'), facebook: str(fd, 'facebook'), youtube: str(fd, 'youtube'), tiktok: str(fd, 'tiktok') };
    case 'home_stats':
      return rows(fd, 'stats', 4, ['value', 'label']).filter((r) => r.value) as SettingsMap['home_stats'];
    case 'home_benefits':
      return rows(fd, 'benefits', 6, ['title', 'desc']).filter((r) => r.title) as SettingsMap['home_benefits'];
    case 'home_regions':
      return SETTINGS_DEFAULTS.home_regions.map((d, i) => ({
        region: d.region,
        label: str(fd, `regions.${i}.label`) || d.label,
        image: str(fd, `regions.${i}.image`) || d.image,
      }));
    case 'company':
      return {
        about: str(fd, 'about'),
        history: str(fd, 'history'),
        image: str(fd, 'image') || SETTINGS_DEFAULTS.company.image,
        vision: str(fd, 'vision'),
        missions: lines(fd, 'missions'),
        values: pipeLines(fd, 'values').map(([title, desc]) => ({ title, desc: desc ?? '' })),
      };
    case 'wa_templates':
      return { booking: str(fd, 'booking'), inquiry: str(fd, 'inquiry'), general: str(fd, 'general') };
    case 'legal_pages':
      return { privacy: str(fd, 'privacy'), terms: str(fd, 'terms') };
  }
}

export async function saveSetting(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const key = str(fd, 'key') as SettingKey;
  if (!(key in SETTINGS_DEFAULTS)) return { ok: false, message: 'Pengaturan tidak dikenal.' };

  const value = build(key, fd);
  if (value instanceof z.ZodError) return invalid(value);
  try {
    await db.insert(settings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
  } catch (err) {
    return dbError(err);
  }
  refresh();
  return { ok: true, message: 'Pengaturan disimpan.' };
}

// ---------- Users ----------

const password = z.string().min(8, { error: 'Password minimal 8 karakter.' }).max(72);

export async function saveUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireUser('SUPER_ADMIN');
  const id = optNum(fd, 'id');
  const pw = str(fd, 'password');
  const parsed = z
    .object({
      name: z.string().min(2, { error: 'Nama wajib diisi.' }).max(120),
      email: z.email({ error: 'Email tidak valid.' }),
      role: z.enum(ROLES),
      password: id ? password.or(z.literal('')) : password,
    })
    .safeParse({ name: str(fd, 'name'), email: str(fd, 'email').toLowerCase(), role: str(fd, 'role'), password: pw });
  if (!parsed.success) return invalid(parsed.error);

  const active = fd.get('active') === 'on';
  if (id === me.id && (!active || parsed.data.role !== 'SUPER_ADMIN')) {
    return { ok: false, message: 'Anda tidak dapat menonaktifkan atau menurunkan role akun sendiri.' };
  }

  const { password: _pw, ...rest } = parsed.data;
  const values = { ...rest, active, ...(pw ? { passwordHash: await bcrypt.hash(pw, 12) } : {}) };
  try {
    if (id) await db.update(users).set(values).where(eq(users.id, id));
    else await db.insert(users).values({ ...values, passwordHash: await bcrypt.hash(pw, 12) });
  } catch (err) {
    return dbError(err);
  }
  refresh();
  return { ok: true, message: id ? 'User diperbarui.' : 'User ditambahkan.' };
}

export async function deleteUser(id: number) {
  const me = await requireUser('SUPER_ADMIN');
  if (id === me.id) return;
  await db.delete(users).where(and(eq(users.id, id), ne(users.id, me.id)));
  refresh();
}

export async function changeOwnPassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireUser();
  const parsed = z
    .object({ current: z.string().min(1, { error: 'Password lama wajib diisi.' }), next: password, confirm: z.string() })
    .refine((d) => d.next === d.confirm, { error: 'Konfirmasi password tidak sama.', path: ['confirm'] })
    .safeParse({ current: str(fd, 'current'), next: str(fd, 'next'), confirm: str(fd, 'confirm') });
  if (!parsed.success) return invalid(parsed.error);

  const [user] = await db.select().from(users).where(eq(users.id, me.id));
  if (!user || !(await bcrypt.compare(parsed.data.current, user.passwordHash))) {
    return { ok: false, errors: { current: ['Password lama salah.'] } };
  }
  await db.update(users).set({ passwordHash: await bcrypt.hash(parsed.data.next, 12) }).where(eq(users.id, me.id));
  return { ok: true, message: 'Password berhasil diganti.' };
}

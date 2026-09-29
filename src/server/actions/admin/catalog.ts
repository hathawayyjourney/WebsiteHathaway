'use server';

import { eq } from 'drizzle-orm';
import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import { db } from '@/src/db';
import { categories, destinations, REGIONS } from '@/src/db/schema';
import type { ActionState } from '@/src/lib/action-state';
import { slugify } from '@/src/lib/format';
import { requireUser } from '@/src/server/auth/session';
import { bool, dbError, invalid, optNum, optStr, str } from '@/src/server/form-utils';

const slug = z.string().min(1).regex(/^[a-z0-9-]+$/, { error: 'Slug hanya huruf kecil, angka, dan "-".' });

// ---------- Destinations ----------

const DestinationSchema = z.object({
  name: z.string().min(2, { error: 'Nama wajib diisi.' }).max(120),
  slug,
  region: z.enum(REGIONS, { error: 'Pilih wilayah.' }),
  image: z.url({ error: 'Gambar wajib berupa URL.' }).nullable(),
});

export async function saveDestination(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = optNum(fd, 'id');
  const name = str(fd, 'name');
  const parsed = DestinationSchema.safeParse({ name, slug: str(fd, 'slug') || slugify(name), region: str(fd, 'region'), image: optStr(fd, 'image') });
  if (!parsed.success) return invalid(parsed.error);

  const values = {
    ...parsed.data,
    country: optStr(fd, 'country'),
    description: optStr(fd, 'description'),
    information: optStr(fd, 'information'),
    bestTime: optStr(fd, 'bestTime'),
    travelTips: optStr(fd, 'travelTips'),
    featured: bool(fd, 'featured'),
    sort: optNum(fd, 'sort') ?? 0,
    seoTitle: optStr(fd, 'seoTitle'),
    metaDescription: optStr(fd, 'metaDescription'),
  };
  try {
    if (id) await db.update(destinations).set(values).where(eq(destinations.id, id));
    else await db.insert(destinations).values(values);
  } catch (err) {
    return dbError(err);
  }
  if (!id) redirect('/admin/destinasi');
  refresh();
  return { ok: true, message: 'Destinasi disimpan.' };
}

export async function deleteDestination(id: number) {
  await requireUser();
  await db.delete(destinations).where(eq(destinations.id, id));
  redirect('/admin/destinasi');
}

// ---------- Categories (Jenis Trip) ----------

export async function saveCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = optNum(fd, 'id');
  const name = str(fd, 'name');
  const parsed = z
    .object({ name: z.string().min(2, { error: 'Nama wajib diisi.' }).max(100), slug })
    .safeParse({ name, slug: str(fd, 'slug') || slugify(name) });
  if (!parsed.success) return invalid(parsed.error);

  const values = { ...parsed.data, sort: optNum(fd, 'sort') ?? 0 };
  try {
    if (id) await db.update(categories).set(values).where(eq(categories.id, id));
    else await db.insert(categories).values(values);
  } catch (err) {
    return dbError(err);
  }
  refresh();
  return { ok: true, message: 'Kategori disimpan.' };
}

export async function deleteCategory(id: number) {
  await requireUser();
  await db.delete(categories).where(eq(categories.id, id));
  refresh();
}

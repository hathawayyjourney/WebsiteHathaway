'use server';

import { and, eq, like, sql } from 'drizzle-orm';
import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import { db } from '@/src/db';
import {
  itineraryDays,
  packageDestinations,
  packageImages,
  packages,
  schedules,
  PACKAGE_BADGES,
  PACKAGE_STATUS,
  SCHEDULE_STATUS,
} from '@/src/db/schema';
import type { ActionState } from '@/src/lib/action-state';
import { slugify } from '@/src/lib/format';
import { requireUser } from '@/src/server/auth/session';
import { bool, dbError, invalid, lines, optDecimal, optNum, optStr, pipeLines, str } from '@/src/server/form-utils';

const money = z.number({ error: 'Wajib diisi angka.' }).int().min(0);

const PackageSchema = z.object({
  name: z.string().min(3, { error: 'Nama paket minimal 3 karakter.' }).max(191),
  slug: z.string().regex(/^[a-z0-9-]+$/, { error: 'Slug hanya huruf kecil, angka, dan tanda "-".' }).max(191),
  code: z.string().max(40).nullable(),
  categoryId: z.number().int().nullable(),
  durationDays: z.number({ error: 'Durasi wajib diisi.' }).int().min(1).max(60),
  price: money,
  promoPrice: money.nullable(),
  thumbnail: z.url({ error: 'Thumbnail wajib berupa URL gambar.' }),
  rating: z.number().min(0).max(5).nullable(),
  badge: z.enum(PACKAGE_BADGES).nullable(),
  status: z.enum(PACKAGE_STATUS),
});

export async function savePackage(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = optNum(fd, 'id');
  const name = str(fd, 'name');

  const parsed = PackageSchema.safeParse({
    name,
    slug: str(fd, 'slug') || slugify(name),
    code: optStr(fd, 'code'),
    categoryId: optNum(fd, 'categoryId'),
    durationDays: optNum(fd, 'durationDays') ?? undefined,
    price: optNum(fd, 'price') ?? undefined,
    promoPrice: optNum(fd, 'promoPrice'),
    thumbnail: str(fd, 'thumbnail'),
    rating: optDecimal(fd, 'rating'),
    badge: optStr(fd, 'badge'),
    status: str(fd, 'status') || 'DRAFT',
  });
  if (!parsed.success) return invalid(parsed.error);

  const values = {
    ...parsed.data,
    countriesLabel: optStr(fd, 'countriesLabel'),
    departureLabel: optStr(fd, 'departureLabel'),
    summary: optStr(fd, 'summary'),
    description: optStr(fd, 'description'),
    childPrice: optNum(fd, 'childPrice'),
    singleSupplement: optNum(fd, 'singleSupplement'),
    deposit: optNum(fd, 'deposit'),
    videoUrl: optStr(fd, 'videoUrl'),
    featured: bool(fd, 'featured'),
    sort: optNum(fd, 'sort') ?? 0,
    includes: lines(fd, 'includes'),
    excludes: lines(fd, 'excludes'),
    hotels: pipeLines(fd, 'hotels').map(([hotelName, star, location, roomType]) => ({
      name: hotelName,
      star: Number(star) || undefined,
      location: location || undefined,
      roomType: roomType || undefined,
    })),
    transports: pipeLines(fd, 'transports').map(([type, detail]) => ({ type, detail: detail ?? '' })),
    terms: pipeLines(fd, 'terms').map(([title, ...rest]) => ({ title, content: rest.join(' | ') })),
    seoTitle: optStr(fd, 'seoTitle'),
    metaDescription: optStr(fd, 'metaDescription'),
  };
  const destinationIds = fd.getAll('destinationIds').map(Number).filter(Number.isInteger);

  let packageId = id;
  try {
    await db.transaction(async (tx) => {
      if (packageId) {
        await tx.update(packages).set(values).where(eq(packages.id, packageId));
        await tx.delete(packageDestinations).where(eq(packageDestinations.packageId, packageId));
      } else {
        const [res] = await tx.insert(packages).values(values);
        packageId = res.insertId;
      }
      if (destinationIds.length) {
        await tx.insert(packageDestinations).values(destinationIds.map((destinationId) => ({ packageId: packageId!, destinationId })));
      }
    });
  } catch (err) {
    return dbError(err);
  }

  if (!id) redirect(`/admin/paket/${packageId}?created=1`);
  refresh();
  return { ok: true, message: 'Paket berhasil disimpan.' };
}

export async function deletePackage(id: number) {
  await requireUser();
  await db.delete(packages).where(eq(packages.id, id));
  redirect('/admin/paket');
}

export async function togglePackageStatus(id: number) {
  await requireUser();
  await db
    .update(packages)
    .set({ status: sql`IF(${packages.status} = 'PUBLISHED', 'DRAFT', 'PUBLISHED')` })
    .where(eq(packages.id, id));
  refresh();
}

/** Copies a package (with destinations, itinerary, photos — not schedules) as a DRAFT. */
export async function duplicatePackage(id: number) {
  await requireUser();
  const [source] = await db.select().from(packages).where(eq(packages.id, id));
  if (!source) return;

  const [{ copies }] = await db
    .select({ copies: sql<number>`COUNT(*)` })
    .from(packages)
    .where(like(packages.slug, `${source.slug}-copy%`));

  let newId = 0;
  await db.transaction(async (tx) => {
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = source;
    const [res] = await tx.insert(packages).values({
      ...rest,
      name: `${source.name} (Copy)`,
      slug: `${source.slug}-copy${Number(copies) ? `-${Number(copies) + 1}` : ''}`,
      status: 'DRAFT',
      featured: false,
    });
    newId = res.insertId;

    const [dests, days, images] = await Promise.all([
      tx.select().from(packageDestinations).where(eq(packageDestinations.packageId, id)),
      tx.select().from(itineraryDays).where(eq(itineraryDays.packageId, id)),
      tx.select().from(packageImages).where(eq(packageImages.packageId, id)),
    ]);
    if (dests.length) await tx.insert(packageDestinations).values(dests.map((d) => ({ ...d, packageId: newId })));
    if (days.length) await tx.insert(itineraryDays).values(days.map(({ id: _i, ...d }) => ({ ...d, packageId: newId })));
    if (images.length) await tx.insert(packageImages).values(images.map(({ id: _i, ...img }) => ({ ...img, packageId: newId })));
  });
  redirect(`/admin/paket/${newId}`);
}

// ---------- Schedules (status is set manually by admin) ----------

const ScheduleSchema = z.object({
  packageId: z.number().int(),
  departureDate: z.iso.date({ error: 'Tanggal berangkat wajib diisi.' }),
  returnDate: z.iso.date().nullable(),
  quota: z.number().int().min(0).nullable(),
  seatsLeft: z.number().int().min(0).nullable(),
  status: z.enum(SCHEDULE_STATUS),
  note: z.string().max(191).nullable(),
});

export async function saveSchedule(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = optNum(fd, 'id');
  const parsed = ScheduleSchema.safeParse({
    packageId: optNum(fd, 'packageId'),
    departureDate: str(fd, 'departureDate'),
    returnDate: optStr(fd, 'returnDate'),
    quota: optNum(fd, 'quota'),
    seatsLeft: optNum(fd, 'seatsLeft'),
    status: str(fd, 'status'),
    note: optStr(fd, 'note'),
  });
  if (!parsed.success) return invalid(parsed.error);

  try {
    if (id) await db.update(schedules).set(parsed.data).where(eq(schedules.id, id));
    else await db.insert(schedules).values(parsed.data);
  } catch (err) {
    return dbError(err);
  }
  refresh();
  return { ok: true, message: id ? 'Jadwal diperbarui.' : 'Jadwal ditambahkan.' };
}

export async function deleteSchedule(id: number) {
  await requireUser();
  await db.delete(schedules).where(eq(schedules.id, id));
  refresh();
}

// ---------- Itinerary ----------

const DaySchema = z.object({
  packageId: z.number().int(),
  dayNo: z.number({ error: 'Hari ke- wajib diisi.' }).int().min(1),
  title: z.string().min(2, { error: 'Judul hari wajib diisi.' }).max(191),
});

export async function saveItineraryDay(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = optNum(fd, 'id');
  const parsed = DaySchema.safeParse({ packageId: optNum(fd, 'packageId'), dayNo: optNum(fd, 'dayNo') ?? undefined, title: str(fd, 'title') });
  if (!parsed.success) return invalid(parsed.error);

  const values = {
    ...parsed.data,
    // "waktu | aktivitas | lokasi | meal" per line; a line without "|" is just the activity.
    items: pipeLines(fd, 'items').map((parts) =>
      parts.length === 1 ? { activity: parts[0] } : { time: parts[0] || undefined, activity: parts[1] ?? '', location: parts[2] || undefined, meal: parts[3] || undefined },
    ),
    hotel: optStr(fd, 'hotel'),
    transport: optStr(fd, 'transport'),
  };
  try {
    if (id) await db.update(itineraryDays).set(values).where(eq(itineraryDays.id, id));
    else await db.insert(itineraryDays).values(values);
  } catch (err) {
    return dbError(err);
  }
  refresh();
  return { ok: true, message: 'Itinerary disimpan.' };
}

export async function deleteItineraryDay(id: number) {
  await requireUser();
  await db.delete(itineraryDays).where(eq(itineraryDays.id, id));
  refresh();
}

// ---------- Photos ----------

export async function addPackageImage(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = z
    .object({ packageId: z.number().int(), url: z.url({ error: 'URL gambar tidak valid.' }) })
    .safeParse({ packageId: optNum(fd, 'packageId'), url: str(fd, 'url') });
  if (!parsed.success) return invalid(parsed.error);

  const [{ next }] = await db
    .select({ next: sql<number>`COALESCE(MAX(${packageImages.sort}), 0) + 1` })
    .from(packageImages)
    .where(eq(packageImages.packageId, parsed.data.packageId));
  await db.insert(packageImages).values({ ...parsed.data, caption: optStr(fd, 'caption'), sort: Number(next) });
  refresh();
  return { ok: true, message: 'Foto ditambahkan.' };
}

export async function deletePackageImage(id: number) {
  await requireUser();
  await db.delete(packageImages).where(and(eq(packageImages.id, id)));
  refresh();
}

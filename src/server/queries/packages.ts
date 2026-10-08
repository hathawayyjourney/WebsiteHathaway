import 'server-only';
import { cache } from 'react';
import { and, asc, desc, eq, gte, inArray, like, lte, ne, or, sql, type SQL } from 'drizzle-orm';
import { connection } from 'next/server';
import { db } from '@/src/db';
import {
  categories,
  destinations,
  itineraryDays,
  packageDestinations,
  packageImages,
  packages,
  schedules,
  type Region,
} from '@/src/db/schema';
import { formatDate, formatRupiah } from '@/src/lib/format';
import type { PackageData, PackageBadge } from '@/src/types';
import { DURATION_BUCKETS, PAGE_SIZE, type PackageSearchParams } from '@/src/lib/package-filters';

const BADGE_COLORS: Record<PackageBadge, string> = {
  'HOT DEAL': 'bg-red-500',
  'BEST SELLER': 'bg-orange-500',
  POPULAR: 'bg-green-500',
  FAVORITE: 'bg-blue-500',
  PROMO: 'bg-brand-red',
};



const effectivePrice = sql<number>`COALESCE(${packages.promoPrice}, ${packages.price})`;
const nextDeparture = sql<string | null>`(SELECT MIN(s.departure_date) FROM ${schedules} s WHERE s.package_id = ${packages.id} AND s.departure_date >= CURDATE() AND s.status IN ('OPEN','LIMITED'))`;

const cardColumns = {
  id: packages.id,
  slug: packages.slug,
  name: packages.name,
  durationDays: packages.durationDays,
  countriesLabel: packages.countriesLabel,
  departureLabel: packages.departureLabel,
  price: packages.price,
  promoPrice: packages.promoPrice,
  thumbnail: packages.thumbnail,
  badge: packages.badge,
  rating: packages.rating,
  nextDeparture,
};

type CardRow = {
  slug: string;
  name: string;
  durationDays: number;
  countriesLabel: string | null;
  departureLabel: string | null;
  price: number;
  promoPrice: number | null;
  thumbnail: string;
  badge: PackageBadge | null;
  rating: number | null;
  nextDeparture: string | null;
};

/** Maps a DB row to the existing PackageCard props so the card component stays unchanged. */
export function toPackageCardData(row: CardRow): PackageData {
  return {
    id: row.slug, // PackageCard links to /paket-tour/{id}
    name: row.name,
    destination: row.countriesLabel ?? '',
    duration: `${row.durationDays}D`,
    countries: row.countriesLabel ?? '',
    departure: row.departureLabel || (row.nextDeparture ? formatDate(row.nextDeparture, 'short') : 'Hubungi Admin'),
    price: formatRupiah(row.promoPrice ?? row.price),
    image: row.thumbnail,
    badge: row.badge ?? undefined,
    badgeColor: row.badge ? BADGE_COLORS[row.badge] : undefined,
    rating: row.rating ?? undefined,
  };
}

export const getFeaturedPackages = cache(async (limit = 4) => {
  await connection();
  const rows = await db
    .select(cardColumns)
    .from(packages)
    .where(and(eq(packages.status, 'PUBLISHED'), eq(packages.featured, true)))
    .orderBy(asc(packages.sort), desc(packages.id))
    .limit(limit);
  return rows.map((r) => toPackageCardData(r as CardRow));
});



export async function searchPackages(params: PackageSearchParams) {
  await connection();
  const where: SQL[] = [eq(packages.status, 'PUBLISHED')];

  if (params.q) where.push(like(packages.name, `%${params.q}%`));

  if (params.region?.length || params.negara?.length) {
    const destFilter: SQL[] = [];
    if (params.region?.length) destFilter.push(inArray(destinations.region, params.region as Region[]));
    if (params.negara?.length) destFilter.push(inArray(destinations.slug, params.negara));
    where.push(
      inArray(
        packages.id,
        db
          .select({ id: packageDestinations.packageId })
          .from(packageDestinations)
          .innerJoin(destinations, eq(destinations.id, packageDestinations.destinationId))
          .where(and(...destFilter)),
      ),
    );
  }

  if (params.jenis?.length) {
    where.push(
      inArray(packages.categoryId, db.select({ id: categories.id }).from(categories).where(inArray(categories.slug, params.jenis))),
    );
  }

  const buckets = DURATION_BUCKETS.filter((b) => params.durasi?.includes(b.value));
  if (buckets.length) {
    where.push(or(...buckets.map((b) => and(gte(packages.durationDays, b.min), lte(packages.durationDays, b.max))))!);
  }

  if (params.harga) where.push(lte(effectivePrice, params.harga));

  if (params.tanggal) {
    // Departures within 30 days from the chosen date that are still bookable.
    where.push(
      inArray(
        packages.id,
        db
          .select({ id: schedules.packageId })
          .from(schedules)
          .where(
            and(
              gte(schedules.departureDate, params.tanggal),
              lte(schedules.departureDate, sql`DATE_ADD(${params.tanggal}, INTERVAL 30 DAY)`),
              inArray(schedules.status, ['OPEN', 'LIMITED']),
            ),
          ),
      ),
    );
  }

  const orderBy = {
    terbaru: [desc(packages.createdAt)],
    'harga-terendah': [asc(effectivePrice)],
    'harga-tertinggi': [desc(effectivePrice)],
    terpopuler: [desc(packages.rating), asc(packages.sort)],
  }[params.sort ?? ''] ?? [desc(packages.featured), asc(packages.sort), desc(packages.id)];

  const page = params.page ?? 1;
  const [rows, [{ total }]] = await Promise.all([
    db
      .select(cardColumns)
      .from(packages)
      .where(and(...where))
      .orderBy(...orderBy)
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: sql<number>`COUNT(*)` }).from(packages).where(and(...where)),
  ]);

  return {
    items: rows.map((r) => toPackageCardData(r as CardRow)),
    total: Number(total),
    page,
    totalPages: Math.max(1, Math.ceil(Number(total) / PAGE_SIZE)),
  };
}

export const getPackageFilterOptions = cache(async () => {
  await connection();
  const [cats, dests] = await Promise.all([
    db.select({ slug: categories.slug, name: categories.name }).from(categories).orderBy(asc(categories.sort)),
    db
      .select({ slug: destinations.slug, name: destinations.name, region: destinations.region })
      .from(destinations)
      .orderBy(asc(destinations.sort), asc(destinations.name)),
  ]);
  return { categories: cats, destinations: dests };
});

export const getPackageBySlug = cache(async (slug: string) => {
  await connection();
  const [row] = await db
    .select({ pkg: packages, category: categories })
    .from(packages)
    .leftJoin(categories, eq(categories.id, packages.categoryId))
    .where(and(eq(packages.slug, slug), eq(packages.status, 'PUBLISHED')))
    .limit(1);
  if (!row) return null;

  const id = row.pkg.id;
  const [dests, images, itinerary, sched] = await Promise.all([
    db
      .select({ id: destinations.id, name: destinations.name, slug: destinations.slug, region: destinations.region })
      .from(packageDestinations)
      .innerJoin(destinations, eq(destinations.id, packageDestinations.destinationId))
      .where(eq(packageDestinations.packageId, id)),
    db.select().from(packageImages).where(eq(packageImages.packageId, id)).orderBy(asc(packageImages.sort)),
    db.select().from(itineraryDays).where(eq(itineraryDays.packageId, id)).orderBy(asc(itineraryDays.dayNo)),
    db
      .select()
      .from(schedules)
      .where(and(eq(schedules.packageId, id), gte(schedules.departureDate, sql`CURDATE()`)))
      .orderBy(asc(schedules.departureDate)),
  ]);

  return { ...row.pkg, category: row.category, destinations: dests, images, itinerary, schedules: sched };
});

export type PackageDetail = NonNullable<Awaited<ReturnType<typeof getPackageBySlug>>>;

/** Packages + upcoming bookable schedules, for the /booking picker. */
export const getBookingOptions = cache(async () => {
  await connection();
  const [pkgs, sched] = await Promise.all([
    db
      .select({ id: packages.id, slug: packages.slug, name: packages.name })
      .from(packages)
      .where(eq(packages.status, 'PUBLISHED'))
      .orderBy(asc(packages.sort), asc(packages.name)),
    db
      .select({ packageId: schedules.packageId, date: schedules.departureDate, status: schedules.status })
      .from(schedules)
      .where(gte(schedules.departureDate, sql`CURDATE()`))
      .orderBy(asc(schedules.departureDate)),
  ]);
  return pkgs.map((p) => ({
    slug: p.slug,
    name: p.name,
    schedules: sched.filter((s) => s.packageId === p.id).map(({ date, status }) => ({ date, status })),
  }));
});

export async function getRelatedPackages(destinationId: number, limit = 8) {
  await connection();
  const rows = await db
    .select(cardColumns)
    .from(packages)
    .where(
      and(
        eq(packages.status, 'PUBLISHED'),
        inArray(
          packages.id,
          db.select({ id: packageDestinations.packageId }).from(packageDestinations).where(eq(packageDestinations.destinationId, destinationId)),
        ),
      ),
    )
    .orderBy(asc(packages.sort))
    .limit(limit);
  return rows.map((r) => toPackageCardData(r as CardRow));
}

/** Other published packages in the same regions as this package (for "Paket Lainnya" on the detail page). */
export async function getSimilarPackages(packageId: number, regions: Region[], limit = 4) {
  await connection();
  const rows = await db
    .select(cardColumns)
    .from(packages)
    .where(
      and(
        eq(packages.status, 'PUBLISHED'),
        ne(packages.id, packageId),
        regions.length
          ? inArray(
              packages.id,
              db
                .select({ id: packageDestinations.packageId })
                .from(packageDestinations)
                .innerJoin(destinations, eq(destinations.id, packageDestinations.destinationId))
                .where(inArray(destinations.region, regions)),
            )
          : undefined,
      ),
    )
    .orderBy(desc(packages.featured), asc(packages.sort), desc(packages.id))
    .limit(limit);
  return rows.map((r) => toPackageCardData(r as CardRow));
}

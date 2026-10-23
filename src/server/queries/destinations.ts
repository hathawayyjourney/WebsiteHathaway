import 'server-only';
import { cache } from 'react';
import { and, asc, eq, sql } from 'drizzle-orm';
import { connection } from 'next/server';
import { db } from '@/src/db';
import { destinations, packageDestinations, packages, type Region } from '@/src/db/schema';

export const REGION_LABELS: Record<Region, string> = {
  INDONESIA: 'Indonesia',
  ASIA: 'Asia',
  EROPA: 'Eropa',
  TIMUR_TENGAH: 'Timur Tengah',
  AFRIKA: 'Afrika',
  AMERIKA: 'Amerika',
  LAINNYA: 'Destinasi Lain',
};

const packageCount = sql<number>`(SELECT COUNT(*) FROM ${packageDestinations} pd INNER JOIN ${packages} p ON p.id = pd.package_id WHERE pd.destination_id = ${destinations.id} AND p.status = 'PUBLISHED')`;

export const listDestinations = cache(async (region?: Region) => {
  await connection();
  const rows = await db
    .select({
      id: destinations.id,
      name: destinations.name,
      slug: destinations.slug,
      region: destinations.region,
      country: destinations.country,
      image: destinations.image,
      featured: destinations.featured,
      packageCount,
    })
    .from(destinations)
    .where(region ? eq(destinations.region, region) : undefined)
    .orderBy(asc(destinations.sort), asc(destinations.name));
  return rows.map((r) => ({ ...r, packageCount: Number(r.packageCount) }));
});

/** Destinations ticked "Tampilkan di Destinasi Populer" in admin, in admin order (Home section). */
export const getPopularDestinations = cache(async () => {
  await connection();
  return db
    .select({ id: destinations.id, name: destinations.name, slug: destinations.slug, image: destinations.image })
    .from(destinations)
    .where(eq(destinations.featured, true))
    .orderBy(asc(destinations.sort), asc(destinations.name));
});

export type PopularDestination = Awaited<ReturnType<typeof getPopularDestinations>>[number];

export const getDestinationBySlug = cache(async (slug: string) => {
  await connection();
  const [row] = await db.select().from(destinations).where(and(eq(destinations.slug, slug))).limit(1);
  return row ?? null;
});

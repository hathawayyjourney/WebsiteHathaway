import type { MetadataRoute } from 'next';
import { eq } from 'drizzle-orm';
import { connection } from 'next/server';
import { db } from '@/src/db';
import { destinations, packages } from '@/src/db/schema';
import { absoluteUrl } from '@/src/lib/seo';
import { REGION_PAGES } from '@/src/lib/regions';

type Entry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const [pkgs, dests] = await Promise.all([
    db
      .select({ slug: packages.slug, thumbnail: packages.thumbnail, updatedAt: packages.updatedAt })
      .from(packages)
      .where(eq(packages.status, 'PUBLISHED')),
    db
      .select({ slug: destinations.slug, image: destinations.image, region: destinations.region, updatedAt: destinations.updatedAt })
      .from(destinations),
  ]);

  // List pages change when their content changes, so use the newest item instead of "now".
  const latest = (rows: { updatedAt: Date | null }[]) =>
    rows.reduce<Date | undefined>((max, r) => (r.updatedAt && (!max || r.updatedAt > max) ? r.updatedAt : max), undefined);
  const lastPackage = latest(pkgs);
  const lastDestination = latest(dests);

  const page = (path: string, priority: number, changeFrequency: Entry['changeFrequency'], lastModified?: Date): Entry => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page('/', 1, 'weekly', lastPackage),
    page('/paket-tour', 0.9, 'weekly', lastPackage),
    page('/destinasi', 0.8, 'weekly', lastDestination),
    // Region landing pages that have content (empty ones are noindex).
    ...REGION_PAGES.filter((r) => dests.some((d) => d.region === r.region)).map((r) =>
      page(`/destinasi/wilayah/${r.slug}`, 0.8, 'weekly', latest(dests.filter((d) => d.region === r.region))),
    ),
    page('/testimoni', 0.6, 'monthly'),
    page('/gallery', 0.5, 'monthly'),
    page('/tentang-kami', 0.5, 'monthly'),
    page('/faq', 0.5, 'monthly'),
    page('/kontak', 0.5, 'yearly'),
    page('/booking', 0.4, 'monthly'),
    page('/privacy-policy', 0.2, 'yearly'),
    page('/terms-conditions', 0.2, 'yearly'),
    ...pkgs.map((p) => ({
      ...page(`/paket-tour/${p.slug}`, 0.9, 'weekly', p.updatedAt ?? undefined),
      images: [absoluteUrl(p.thumbnail)],
    })),
    ...dests.map((d) => ({
      ...page(`/destinasi/${d.slug}`, 0.7, 'monthly', d.updatedAt ?? undefined),
      ...(d.image ? { images: [absoluteUrl(d.image)] } : {}),
    })),
  ];
}

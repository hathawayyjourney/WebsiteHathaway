import type { MetadataRoute } from 'next';
import { eq } from 'drizzle-orm';
import { connection } from 'next/server';
import { db } from '@/src/db';
import { destinations, packages } from '@/src/db/schema';

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const [pkgs, dests] = await Promise.all([
    db.select({ slug: packages.slug, updatedAt: packages.updatedAt }).from(packages).where(eq(packages.status, 'PUBLISHED')),
    db.select({ slug: destinations.slug, updatedAt: destinations.updatedAt }).from(destinations),
  ]);

  const staticPages = ['', '/paket-tour', '/destinasi', '/gallery', '/tentang-kami', '/testimoni', '/faq', '/kontak', '/booking'];
  return [
    ...staticPages.map((path) => ({ url: `${base}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.7 })),
    ...pkgs.map((p) => ({ url: `${base}/paket-tour/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'weekly' as const, priority: 0.9 })),
    ...dests.map((d) => ({ url: `${base}/destinasi/${d.slug}`, lastModified: d.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}

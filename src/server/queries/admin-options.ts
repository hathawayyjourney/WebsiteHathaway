import 'server-only';
import { asc } from 'drizzle-orm';
import { db } from '@/src/db';
import { categories, destinations } from '@/src/db/schema';
import { cloudinaryConfig } from '@/src/lib/cloudinary';

export async function getCatalogOptions() {
  const [cats, dests] = await Promise.all([
    db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.sort)),
    db.select({ id: destinations.id, name: destinations.name }).from(destinations).orderBy(asc(destinations.sort), asc(destinations.name)),
  ]);
  return { categories: cats, destinations: dests };
}

export const uploadEnabled = () => cloudinaryConfig() !== null;

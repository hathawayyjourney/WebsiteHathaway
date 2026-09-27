import 'server-only';
import { cache } from 'react';
import { and, asc, desc, eq } from 'drizzle-orm';
import { connection } from 'next/server';
import { db } from '@/src/db';
import { faqs, gallery, legalDocuments, partners, teams, testimonials } from '@/src/db/schema';

export const getGallery = cache(async () => {
  await connection();
  return db.select().from(gallery).where(eq(gallery.published, true)).orderBy(asc(gallery.sort), desc(gallery.id));
});

export const getTestimonials = cache(async (opts: { featuredOnly?: boolean } = {}) => {
  await connection();
  return db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.status, 'PUBLISHED'), opts.featuredOnly ? eq(testimonials.featured, true) : undefined))
    .orderBy(desc(testimonials.featured), desc(testimonials.date), desc(testimonials.id));
});

export const getFaqs = cache(async () => {
  await connection();
  return db.select().from(faqs).where(eq(faqs.published, true)).orderBy(asc(faqs.sort), asc(faqs.id));
});

export const getCompanyExtras = cache(async () => {
  await connection();
  const [legal, team, partnerList] = await Promise.all([
    db.select().from(legalDocuments).orderBy(asc(legalDocuments.sort)),
    db.select().from(teams).orderBy(asc(teams.sort)),
    db.select().from(partners).orderBy(asc(partners.sort)),
  ]);
  return { legal, team, partners: partnerList };
});

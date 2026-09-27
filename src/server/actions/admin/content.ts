'use server';

import { eq } from 'drizzle-orm';
import { refresh } from 'next/cache';
import * as z from 'zod';
import { db } from '@/src/db';
import {
  contactMessages,
  faqs,
  gallery,
  legalDocuments,
  partners,
  teams,
  testimonials,
  FAQ_GROUPS,
  GALLERY_KINDS,
  TESTIMONIAL_STATUS,
} from '@/src/db/schema';
import type { ActionState } from '@/src/lib/action-state';
import { requireUser } from '@/src/server/auth/session';
import { bool, dbError, invalid, optNum, optStr, str } from '@/src/server/form-utils';

const url = (msg: string) => z.url({ error: msg });

/** Shared insert-or-update tail for the simple content tables. */
async function upsert(
  run: (id: number | null) => Promise<unknown>,
  id: number | null,
  message: string,
): Promise<ActionState> {
  try {
    await run(id);
  } catch (err) {
    return dbError(err);
  }
  refresh();
  return { ok: true, message };
}

// ---------- Gallery ----------

export async function saveGalleryItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = optNum(fd, 'id');
  const parsed = z
    .object({ kind: z.enum(GALLERY_KINDS), imageUrl: url('Gambar / thumbnail wajib diisi.') })
    .safeParse({ kind: str(fd, 'kind'), imageUrl: str(fd, 'imageUrl') });
  if (!parsed.success) return invalid(parsed.error);
  const values = {
    ...parsed.data,
    category: parsed.data.kind === 'FOTO' ? optStr(fd, 'category') : null,
    title: optStr(fd, 'title'),
    videoUrl: optStr(fd, 'videoUrl'),
    sort: optNum(fd, 'sort') ?? 0,
    published: bool(fd, 'published'),
  };
  return upsert(
    (i) => (i ? db.update(gallery).set(values).where(eq(gallery.id, i)) : db.insert(gallery).values(values)),
    id,
    'Item gallery disimpan.',
  );
}

export async function deleteGalleryItem(id: number) {
  await requireUser();
  await db.delete(gallery).where(eq(gallery.id, id));
  refresh();
}

// ---------- Testimonials ----------

export async function saveTestimonial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = optNum(fd, 'id');
  const parsed = z
    .object({
      name: z.string().min(2, { error: 'Nama wajib diisi.' }).max(120),
      review: z.string().min(5, { error: 'Isi testimoni wajib diisi.' }),
      rating: z.number().int().min(1).max(5),
      status: z.enum(TESTIMONIAL_STATUS),
      date: z.iso.date().nullable(),
    })
    .safeParse({ name: str(fd, 'name'), review: str(fd, 'review'), rating: optNum(fd, 'rating') ?? 5, status: str(fd, 'status'), date: optStr(fd, 'date') });
  if (!parsed.success) return invalid(parsed.error);
  const values = {
    ...parsed.data,
    photo: optStr(fd, 'photo'),
    packageId: optNum(fd, 'packageId'),
    packageLabel: optStr(fd, 'packageLabel'),
    videoUrl: optStr(fd, 'videoUrl'),
    featured: bool(fd, 'featured'),
  };
  return upsert(
    (i) => (i ? db.update(testimonials).set(values).where(eq(testimonials.id, i)) : db.insert(testimonials).values(values)),
    id,
    'Testimoni disimpan.',
  );
}

export async function deleteTestimonial(id: number) {
  await requireUser();
  await db.delete(testimonials).where(eq(testimonials.id, id));
  refresh();
}

// ---------- FAQ ----------

export async function saveFaq(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = optNum(fd, 'id');
  const parsed = z
    .object({
      group: z.enum(FAQ_GROUPS),
      question: z.string().min(5, { error: 'Pertanyaan wajib diisi.' }).max(300),
      answer: z.string().min(2, { error: 'Jawaban wajib diisi.' }),
    })
    .safeParse({ group: str(fd, 'group'), question: str(fd, 'question'), answer: str(fd, 'answer') });
  if (!parsed.success) return invalid(parsed.error);
  const values = { ...parsed.data, sort: optNum(fd, 'sort') ?? 0, published: bool(fd, 'published') };
  return upsert((i) => (i ? db.update(faqs).set(values).where(eq(faqs.id, i)) : db.insert(faqs).values(values)), id, 'FAQ disimpan.');
}

export async function deleteFaq(id: number) {
  await requireUser();
  await db.delete(faqs).where(eq(faqs.id, id));
  refresh();
}

// ---------- Company: team, legal documents, partners ----------

export async function saveTeamMember(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = optNum(fd, 'id');
  const parsed = z
    .object({ name: z.string().min(2, { error: 'Nama wajib diisi.' }), position: z.string().min(2, { error: 'Jabatan wajib diisi.' }) })
    .safeParse({ name: str(fd, 'name'), position: str(fd, 'position') });
  if (!parsed.success) return invalid(parsed.error);
  const values = { ...parsed.data, bio: optStr(fd, 'bio'), photo: optStr(fd, 'photo'), sort: optNum(fd, 'sort') ?? 0 };
  return upsert((i) => (i ? db.update(teams).set(values).where(eq(teams.id, i)) : db.insert(teams).values(values)), id, 'Anggota tim disimpan.');
}

export async function deleteTeamMember(id: number) {
  await requireUser();
  await db.delete(teams).where(eq(teams.id, id));
  refresh();
}

export async function saveLegalDocument(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = optNum(fd, 'id');
  const parsed = z.object({ name: z.string().min(2, { error: 'Nama dokumen wajib diisi.' }) }).safeParse({ name: str(fd, 'name') });
  if (!parsed.success) return invalid(parsed.error);
  const values = { ...parsed.data, number: optStr(fd, 'number'), fileUrl: optStr(fd, 'fileUrl'), sort: optNum(fd, 'sort') ?? 0 };
  return upsert(
    (i) => (i ? db.update(legalDocuments).set(values).where(eq(legalDocuments.id, i)) : db.insert(legalDocuments).values(values)),
    id,
    'Dokumen legalitas disimpan.',
  );
}

export async function deleteLegalDocument(id: number) {
  await requireUser();
  await db.delete(legalDocuments).where(eq(legalDocuments.id, id));
  refresh();
}

export async function savePartner(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = optNum(fd, 'id');
  const parsed = z
    .object({ name: z.string().min(2, { error: 'Nama partner wajib diisi.' }), logo: url('Logo wajib berupa URL gambar.') })
    .safeParse({ name: str(fd, 'name'), logo: str(fd, 'logo') });
  if (!parsed.success) return invalid(parsed.error);
  const values = { ...parsed.data, url: optStr(fd, 'url'), sort: optNum(fd, 'sort') ?? 0 };
  return upsert((i) => (i ? db.update(partners).set(values).where(eq(partners.id, i)) : db.insert(partners).values(values)), id, 'Partner disimpan.');
}

export async function deletePartner(id: number) {
  await requireUser();
  await db.delete(partners).where(eq(partners.id, id));
  refresh();
}

// ---------- Contact messages ----------

export async function toggleMessageRead(id: number, isRead: boolean) {
  await requireUser();
  await db.update(contactMessages).set({ isRead }).where(eq(contactMessages.id, id));
  refresh();
}

export async function deleteMessage(id: number) {
  await requireUser();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  refresh();
}

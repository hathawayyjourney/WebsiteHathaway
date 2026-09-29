import * as z from 'zod';

export const ContactSchema = z.object({
  name: z.string().trim().min(2, { error: 'Nama minimal 2 karakter.' }).max(120),
  whatsapp: z
    .string()
    .trim()
    .regex(/^(\+?62|0)8[0-9\s-]{7,14}$/, { error: 'Nomor WhatsApp tidak valid (contoh: 08123456789).' }),
  email: z.union([z.literal(''), z.email({ error: 'Email tidak valid.' })]).optional(),
  subject: z.string().trim().max(191).optional(),
  message: z.string().trim().min(10, { error: 'Pesan minimal 10 karakter.' }).max(3000),
});

export type ContactFormState =
  | { ok: true; message: string }
  | {
      ok: false;
      message?: string;
      errors?: Partial<Record<keyof z.infer<typeof ContactSchema>, string[]>>;
      values?: Record<string, string>;
    }
  | undefined;

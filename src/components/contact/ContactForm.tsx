'use client';

import { useActionState } from 'react';
import { Send } from 'lucide-react';
import { track } from '@/src/lib/analytics';
import { submitContact } from '@/src/server/actions/contact';
import type { ContactFormState } from '@/src/lib/validations/contact';

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.length ? <p className="text-xs text-brand-red mt-1">{errors[0]}</p> : null;
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactFormState, FormData>(async (prev, formData) => {
    const result = await submitContact(prev, formData);
    if (result?.ok) track('submit_contact');
    return result;
  }, undefined);
  const errors = state && !state.ok ? state.errors : undefined;
  // Keep typed values after a validation error; clear them after success.
  const empty = { name: '', whatsapp: '', email: '', subject: '', message: '' };
  const values = state && !state.ok ? { ...empty, ...state.values } : empty;

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
          <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition" placeholder="Masukkan nama Anda" name="name" defaultValue={values.name} />
          <FieldError errors={errors?.name} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp</label>
          <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition" placeholder="Contoh: 08123456789" name="whatsapp" defaultValue={values.whatsapp} />
          <FieldError errors={errors?.whatsapp} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
          <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition" placeholder="Masukkan alamat email" name="email" defaultValue={values.email} />
          <FieldError errors={errors?.email} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Subjek</label>
          <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition" placeholder="Subjek pesan" name="subject" defaultValue={values.subject} />
          <FieldError errors={errors?.subject} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan</label>
        <textarea rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition resize-none" placeholder="Tuliskan pesan atau pertanyaan Anda di sini..." name="message" defaultValue={values.message}></textarea>
        <FieldError errors={errors?.message} />
      </div>

      <button type="submit" disabled={pending} className="disabled:opacity-60 bg-brand-navy hover:bg-brand-navy-sec text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md w-full sm:w-auto">
        <Send size={18} />
        {pending ? 'Mengirim...' : 'Kirim Pesan'}
      </button>
      {state?.message && (
        <p role="status" className={`text-sm font-medium ${state.ok ? 'text-green-600' : 'text-brand-red'}`}>{state.message}</p>
      )}
    </form>
  );
}

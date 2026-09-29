'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';

/** Confirms, then calls a bound Server Action (e.g. deleteX.bind(null, id)). */
export default function DeleteButton({
  action,
  confirmText = 'Hapus data ini? Tindakan ini tidak dapat dibatalkan.',
  label = 'Hapus',
}: {
  action: () => Promise<unknown>;
  confirmText?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(confirmText)) startTransition(async () => void (await action()));
      }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-red hover:underline disabled:opacity-50"
    >
      <Trash2 size={14} /> {pending ? 'Menghapus...' : label}
    </button>
  );
}

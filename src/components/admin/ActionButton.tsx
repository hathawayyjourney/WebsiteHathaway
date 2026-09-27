'use client';

import { useTransition } from 'react';

/** Small button that runs a bound Server Action (publish toggle, duplicate, mark read...). */
export default function ActionButton({ action, children, className }: { action: () => Promise<unknown>; children: React.ReactNode; className?: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(async () => void (await action()))}
      className={className ?? 'text-xs font-semibold text-brand-navy hover:underline disabled:opacity-50'}
    >
      {pending ? '...' : children}
    </button>
  );
}

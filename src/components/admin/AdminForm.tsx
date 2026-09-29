'use client';

import { createContext, useActionState, useContext, useEffect, useRef, useTransition } from 'react';
import type { ActionState, FormAction } from '@/src/lib/action-state';

const ErrorsContext = createContext<Record<string, string[] | undefined> | undefined>(undefined);

/**
 * Admin form wrapper: submits to a Server Action without React's automatic form reset,
 * so typed values survive validation errors. Pass `resetOnSuccess` for "add" forms.
 */
export default function AdminForm({
  action,
  children,
  submitLabel = 'Simpan',
  className = 'space-y-5',
  resetOnSuccess = false,
  inline = false,
}: {
  action: FormAction;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
  resetOnSuccess?: boolean;
  inline?: boolean;
}) {
  const [state, dispatch] = useActionState<ActionState, FormData>(action, undefined);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetOnSuccess && state?.ok) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => dispatch(data));
  }

  return (
    <ErrorsContext.Provider value={state?.errors}>
      <form ref={formRef} onSubmit={onSubmit} className={className} noValidate>
        {children}
        <div className={inline ? 'contents' : 'flex flex-wrap items-center gap-4 pt-2'}>
          <button
            type="submit"
            disabled={pending}
            className="bg-brand-navy hover:bg-brand-navy-sec disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
          >
            {pending ? 'Menyimpan...' : submitLabel}
          </button>
          {state?.message && !pending && (
            <p role="status" className={`text-sm font-medium ${state.ok ? 'text-green-600' : 'text-brand-red'}`}>
              {state.message}
            </p>
          )}
        </div>
      </form>
    </ErrorsContext.Provider>
  );
}

export function FieldError({ name }: { name: string }) {
  const errors = useContext(ErrorsContext)?.[name];
  return errors?.length ? <p className="text-xs text-brand-red mt-1">{errors[0]}</p> : null;
}

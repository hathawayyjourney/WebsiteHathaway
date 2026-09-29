'use client';

import { useActionState } from 'react';
import { login, type LoginState } from '@/src/server/actions/auth';
import { inputClass } from './fields';

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" defaultValue={state?.email} required className={inputClass} />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </div>
      {state?.error && <p role="alert" className="text-sm text-brand-red font-medium">{state.error}</p>}
      <button type="submit" disabled={pending} className="w-full bg-brand-navy hover:bg-brand-navy-sec disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition shadow-md">
        {pending ? 'Memproses...' : 'Masuk'}
      </button>
    </form>
  );
}

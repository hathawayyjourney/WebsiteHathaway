'use client';

import { useRef, useState } from 'react';
import { ImageUp, Loader2 } from 'lucide-react';
import { FieldError } from './AdminForm';
import { inputClass } from './fields';

const MAX_MB = 20;

/**
 * URL input + optional direct upload to Cloudinary.
 * The saved value is always the URL in the hidden-by-name text input.
 */
export default function MediaField({
  name,
  label,
  defaultValue,
  uploadEnabled,
  kind = 'image',
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  uploadEnabled: boolean;
  kind?: 'image' | 'video';
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    if (file.size > MAX_MB * 1024 * 1024) return setError(`Ukuran file maksimal ${MAX_MB} MB.`);
    setBusy(true);
    setError('');
    try {
      const sig = await fetch('/api/upload/sign', { method: 'POST' }).then((r) => r.json());
      if (sig.error) throw new Error(sig.error);
      const body = new FormData();
      body.append('file', file);
      body.append('api_key', sig.apiKey);
      body.append('timestamp', String(sig.timestamp));
      body.append('signature', sig.signature);
      body.append('folder', sig.folder);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/${kind}/upload`, { method: 'POST', body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? 'Upload gagal');
      setUrl(json.secure_url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload gagal');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="flex gap-3 items-start">
        {kind === 'image' && url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          <input id={name} name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputClass} />
          {uploadEnabled && (
            <>
              <input ref={fileRef} type="file" accept={kind === 'image' ? 'image/*' : 'video/*'} className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              <button
                type="button"
                disabled={busy}
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-navy bg-brand-softblue px-3 py-2 rounded-lg hover:bg-blue-100 transition disabled:opacity-60"
              >
                {busy ? <Loader2 size={14} className="animate-spin" /> : <ImageUp size={14} />}
                {busy ? 'Mengunggah...' : `Upload ${kind === 'image' ? 'gambar' : 'video'}`}
              </button>
            </>
          )}
        </div>
      </div>
      {hint && <p className="text-[11px] text-brand-muted mt-1">{hint}</p>}
      {error && <p className="text-xs text-brand-red mt-1">{error}</p>}
      <FieldError name={name} />
    </div>
  );
}

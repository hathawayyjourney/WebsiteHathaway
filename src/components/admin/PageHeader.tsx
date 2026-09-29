import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function PageHeader({ title, description, addHref, addLabel = 'Tambah', back }: { title: string; description?: string; addHref?: string; addLabel?: string; back?: { href: string; label: string } }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        {back && (
          <Link href={back.href} className="text-xs font-semibold text-brand-muted hover:text-brand-navy">
            ← {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-black text-brand-navy">{title}</h1>
        {description && <p className="text-sm text-brand-muted mt-1">{description}</p>}
      </div>
      {addHref && (
        <Link href={addHref} className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-navy-sec text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
          <Plus size={16} /> {addLabel}
        </Link>
      )}
    </div>
  );
}

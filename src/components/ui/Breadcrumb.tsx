import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm text-brand-muted mb-6 overflow-x-auto whitespace-nowrap pb-2 lg:pb-0">
      <Link href="/" className="hover:text-brand-red transition">
        Beranda
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight size={14} className="mx-2 shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-red transition">
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-navy font-semibold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

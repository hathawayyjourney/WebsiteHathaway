import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import JsonLd from '@/src/components/seo/JsonLd';
import { absoluteUrl } from '@/src/lib/seo';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  // schema.org BreadcrumbList; the current page (last item, no href) may omit its URL.
  const trail = [{ label: 'Beranda', href: '/' }, ...items];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-brand-muted mb-6 overflow-x-auto whitespace-nowrap pb-2 lg:pb-0">
      <JsonLd data={jsonLd} />
      <Link href="/" className="hover:text-brand-red transition">
        Beranda
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight size={14} className="mx-2 shrink-0" aria-hidden="true" />
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-red transition">
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-navy font-semibold" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

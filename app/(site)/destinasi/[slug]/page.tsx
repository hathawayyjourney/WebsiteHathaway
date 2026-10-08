import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarDays, Lightbulb, MapPin } from 'lucide-react';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import PackageCard from '@/src/components/package/PackageCard';
import FinalCTA from '@/src/components/home/FinalCTA';
import TrackView from '@/src/components/analytics/TrackView';
import { getDestinationBySlug, REGION_LABELS } from '@/src/server/queries/destinations';
import { getRelatedPackages } from '@/src/server/queries/packages';
import { getSettings } from '@/src/server/queries/settings';
import { waLink } from '@/src/lib/whatsapp';
import Reveal from '@/src/components/ui/Reveal';
import JsonLd from '@/src/components/seo/JsonLd';
import { singleLine } from '@/src/lib/format';
import { absoluteUrl, pageMetadata, toDescription } from '@/src/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dest = await getDestinationBySlug((await params).slug);
  if (!dest) return { title: 'Destinasi tidak ditemukan' };
  return pageMetadata({
    title: dest.seoTitle || `Paket Tour ${dest.name}${dest.country && dest.country !== dest.name ? ` – ${dest.country}` : ''}`,
    description:
      toDescription(dest.metaDescription) ??
      toDescription(
        `${dest.description || ''} Paket tour ${dest.name} bersama Hathaway Journey: info destinasi, waktu terbaik berkunjung, dan pilihan paket tour.`,
      ),
    path: `/destinasi/${dest.slug}`,
    image: dest.image ? { src: dest.image, alt: dest.name } : null,
  });
}

export default async function DestinationDetailPage({ params }: Props) {
  const dest = await getDestinationBySlug((await params).slug);
  if (!dest) notFound();

  const [packages, { contact, wa_templates }] = await Promise.all([
    getRelatedPackages(dest.id),
    getSettings('contact', 'wa_templates'),
  ]);

  const info = [
    { icon: MapPin, label: 'Wilayah', value: [dest.country, REGION_LABELS[dest.region]].filter(Boolean).join(', ') },
    { icon: CalendarDays, label: 'Waktu Terbaik Berkunjung', value: dest.bestTime },
  ].filter((i) => i.value);

  const url = absoluteUrl(`/destinasi/${dest.slug}`);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    '@id': `${url}#destination`,
    name: dest.name,
    description: toDescription(dest.information || dest.description, 500),
    image: dest.image ? absoluteUrl(dest.image) : undefined,
    url,
    containedInPlace: dest.country && dest.country !== dest.name ? { '@type': 'Country', name: dest.country } : undefined,
    subjectOf:
      packages.length > 0
        ? {
            '@type': 'ItemList',
            name: `Paket Tour ${dest.name}`,
            itemListElement: packages.map((pkg, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: absoluteUrl(`/paket-tour/${pkg.id}`), // card id is the slug
              name: singleLine(pkg.name),
            })),
          }
        : undefined,
  };

  return (
    <main className="min-h-screen pt-20 pb-0 bg-brand-light">
      <JsonLd data={jsonLd} />
      <TrackView event="view_destination" params={{ destination: dest.slug }} />
      <PageHero title={dest.name.toUpperCase()} subtitle={dest.description ?? undefined} image={dest.image} />

      <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
        <Breadcrumb items={[{ label: 'Destinasi', href: '/destinasi' }, { label: dest.name }]} />

        {(dest.information || dest.travelTips || info.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 bg-white p-8 rounded-[20px] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-brand-navy mb-4">Tentang {dest.name}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{dest.information || dest.description}</p>
              {dest.travelTips && (
                <div className="mt-8">
                  <h3 className="font-bold text-brand-dark mb-3 flex items-center gap-2">
                    <Lightbulb size={18} className="text-brand-red" /> Travel Tips
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{dest.travelTips}</p>
                </div>
              )}
            </div>
            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100 space-y-6">
              {info.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-softblue text-brand-navy flex items-center justify-center shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-dark mb-1">{item.label}</h4>
                    <p className="text-sm text-gray-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-black text-brand-navy tracking-tight">PAKET TOUR {dest.name.toUpperCase()}</h2>
          <div className="w-16 h-1 bg-brand-red mx-auto mt-2 rounded-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-brand-navy"></div>
          </div>
        </div>

        {packages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.id} delay={(i % 4) * 80} className="h-full">
                <PackageCard data={pkg} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-brand-muted mb-10">Belum ada paket untuk destinasi ini. Hubungi kami untuk private trip.</p>
        )}

        <div className="flex justify-center">
          <Link
            href={`/paket-tour?negara=${dest.slug}`}
            className="flex items-center gap-2 bg-white text-brand-navy border border-gray-300 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition"
          >
            Lihat Semua Paket <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <FinalCTA whatsappHref={waLink(contact.whatsapp, wa_templates.general)} />
    </main>
  );
}

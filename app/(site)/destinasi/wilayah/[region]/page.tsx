import type { Metadata } from 'next';
import { cache } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import DestinationCard from '@/src/components/destination/DestinationCard';
import PackageCard from '@/src/components/package/PackageCard';
import FinalCTA from '@/src/components/home/FinalCTA';
import Reveal from '@/src/components/ui/Reveal';
import JsonLd from '@/src/components/seo/JsonLd';
import { getImage } from '@/src/lib/images';
import { singleLine } from '@/src/lib/format';
import { waLink } from '@/src/lib/whatsapp';
import { joinNames, regionPageBySlug, type RegionPage } from '@/src/lib/regions';
import { absoluteUrl, pageMetadata } from '@/src/lib/seo';
import { listDestinations } from '@/src/server/queries/destinations';
import { searchPackages } from '@/src/server/queries/packages';
import { getSettings } from '@/src/server/queries/settings';

type Props = { params: Promise<{ region: string }> };

// Landing page per region (e.g. /destinasi/wilayah/eropa) for "paket tour {wilayah}" searches.
// Same building blocks as /destinasi and /destinasi/[slug]; no new design.

// Cached so generateMetadata and the page share one set of queries.
const loadRegion = cache(async (slug: string) => {
  const page = regionPageBySlug(slug);
  if (!page) return null;
  const [destinations, packages] = await Promise.all([listDestinations(page.region), searchPackages({ region: [page.region], page: 1 })]);
  // Home links to every region, so an empty one still renders, but stays out of Google until it has content.
  const empty = destinations.length === 0 && packages.total === 0;
  return { page, destinations, packages, empty };
});

function describe(page: RegionPage, destinationNames: string[]): string {
  const where = destinationNames.length ? ` ke ${joinNames(destinationNames)}` : '';
  return `${page.noun} ${page.label}${where} bersama Hathaway Journey. Itinerary lengkap, harga transparan, tour leader berpengalaman, booking mudah via WhatsApp.`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await loadRegion((await params).region);
  if (!data) return { title: 'Wilayah tidak ditemukan' };
  const { page, destinations, empty } = data;
  return pageMetadata({
    title: `${page.noun} ${page.label} Terbaik`,
    description: describe(
      page,
      destinations.map((d) => d.name),
    ),
    path: `/destinasi/wilayah/${page.slug}`,
    image: getImage('heroDestinasi'),
    noindex: empty,
  });
}

export default async function RegionLandingPage({ params }: Props) {
  const data = await loadRegion((await params).region);
  if (!data) notFound();
  const { page, destinations, packages } = data;
  const { contact, wa_templates } = await getSettings('contact', 'wa_templates');
  const title = `${page.noun} ${page.label}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    url: absoluteUrl(`/destinasi/wilayah/${page.slug}`),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: packages.items.length,
      itemListElement: packages.items.map((pkg, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/paket-tour/${pkg.id}`), // card id is the slug
        name: singleLine(pkg.name),
      })),
    },
  };

  return (
    <main className="min-h-screen pt-20 pb-0 bg-brand-light">
      <JsonLd data={jsonLd} />
      <PageHero
        title={title.toUpperCase()}
        subtitle={describe(
          page,
          destinations.map((d) => d.name),
        )}
        image={getImage('heroDestinasi')}
      />

      <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
        <Breadcrumb items={[{ label: 'Destinasi', href: '/destinasi' }, { label: page.label }]} />

        {destinations.length > 0 && (
          <section className="mb-16">
            <SectionTitle>DESTINASI {page.label.toUpperCase()}</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {destinations.map((d, i) => (
                <Reveal key={d.id} delay={(i % 4) * 80}>
                  <DestinationCard
                    data={{
                      id: d.slug,
                      name: d.name.toUpperCase(),
                      image: d.image ?? '/logo.png',
                      subtitle: `${d.packageCount} Paket${d.country && d.country !== d.name ? ` • ${d.country}` : ''}`,
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionTitle>{title.toUpperCase()}</SectionTitle>
          {packages.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {packages.items.map((pkg, i) => (
                <Reveal key={pkg.id} delay={(i % 4) * 80} className="h-full">
                  <PackageCard data={pkg} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-brand-muted mb-10">Belum ada paket untuk wilayah ini. Hubungi kami untuk private trip.</p>
          )}

          <div className="flex justify-center">
            <Link
              href={`/paket-tour?region=${page.region.toLowerCase()}`}
              className="flex items-center gap-2 bg-white text-brand-navy border border-gray-300 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition"
            >
              Lihat Semua {title} ({packages.total}) <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      <FinalCTA whatsappHref={waLink(contact.whatsapp, wa_templates.general)} />
    </main>
  );
}

// Same heading style as the "PAKET TOUR {DESTINASI}" title on /destinasi/[slug].
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-2xl lg:text-3xl font-black text-brand-navy tracking-tight">{children}</h2>
      <div className="w-16 h-1 bg-brand-red mx-auto mt-2 rounded-full relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-brand-navy"></div>
      </div>
    </div>
  );
}

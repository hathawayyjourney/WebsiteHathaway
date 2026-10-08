import type { Metadata } from 'next';
import { pageMetadata } from '@/src/lib/seo';
import Link from 'next/link';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import { getImage } from '@/src/lib/images';
import DestinationCard from '@/src/components/destination/DestinationCard';
import { REGIONS, type Region } from '@/src/db/enums';
import { listDestinations, REGION_LABELS } from '@/src/server/queries/destinations';
import Reveal from '@/src/components/ui/Reveal';

export const metadata: Metadata = pageMetadata({
  title: 'Destinasi Tour Luar Negeri',
  description:
    'Jelajahi destinasi tour luar negeri favorit di Asia, Eropa, dan Timur Tengah, lengkap dengan waktu terbaik berkunjung dan pilihan paket tour Hathaway Journey.',
  path: '/destinasi',
  image: getImage('heroDestinasi'),
});

// Sitemap FSD: Indonesia, Asia, Eropa, Timur Tengah, Destinasi Lain
const TABS: Region[] = ['INDONESIA', 'ASIA', 'EROPA', 'TIMUR_TENGAH', 'LAINNYA'];

export default async function DestinasiPage({ searchParams }: { searchParams: Promise<{ region?: string }> }) {
  const regionParam = (await searchParams).region?.toUpperCase();
  const region = (REGIONS as readonly string[]).includes(regionParam ?? '') ? (regionParam as Region) : undefined;
  // "Destinasi Lain" also groups regions without their own tab.
  const all = await listDestinations();
  const destinations = region
    ? all.filter((d) => (region === 'LAINNYA' ? !TABS.slice(0, 4).includes(d.region) : d.region === region))
    : all;

  const tabClass = (active: boolean) =>
    `px-6 py-3 rounded-full text-sm font-semibold transition ${
      active ? 'bg-brand-navy text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
    }`;

  return (
    <main className="min-h-screen pt-20 pb-20 bg-brand-light">
      <PageHero title="DESTINASI" subtitle="Jelajahi destinasi impian Anda, dari keindahan Indonesia hingga penjuru dunia." image={getImage('heroDestinasi')} />

      <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
        <Breadcrumb items={region ? [{ label: 'Destinasi', href: '/destinasi' }, { label: REGION_LABELS[region] }] : [{ label: 'Destinasi' }]} />

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10">
          <Link href="/destinasi" className={tabClass(!region)}>SEMUA</Link>
          {TABS.map((r) => (
            <Link key={r} href={`/destinasi?region=${r.toLowerCase()}`} className={tabClass(region === r)}>
              {REGION_LABELS[r].toUpperCase()}
            </Link>
          ))}
        </div>

        {destinations.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {destinations.map((d, i) => (
              <Reveal key={d.id} delay={(i % 4) * 80}>
              <DestinationCard
                data={{
                  id: d.slug,
                  name: d.name.toUpperCase(),
                  image: d.image ?? '/logo.png',
                  subtitle: `${d.packageCount} Paket • ${REGION_LABELS[d.region]}`,
                }}
              />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-brand-muted py-10">Belum ada destinasi pada wilayah ini.</p>
        )}
      </div>
    </main>
  );
}

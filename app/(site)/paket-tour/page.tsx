import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import { getImage } from '@/src/lib/images';
import FilterPanel from '@/src/components/package/FilterPanel';
import PackageCard from '@/src/components/package/PackageCard';
import Pagination from '@/src/components/ui/Pagination';
import SortSelect from '@/src/components/package/SortSelect';
import { SlidersHorizontal } from 'lucide-react';
import type { Metadata } from 'next';
import { pageMetadata } from '@/src/lib/seo';
import Image from 'next/image';
import { getPackageFilterOptions, searchPackages } from '@/src/server/queries/packages';
import { PAGE_SIZE, parsePackageSearchParams } from '@/src/lib/package-filters';
import Reveal from '@/src/components/ui/Reveal';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

// Filtered/sorted lists point their canonical to the plain list; only pagination keeps its own URL.
// Keyword searches (?q=) are internal search results and stay out of the index.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q, page, region, negara, jenis, durasi, harga, tanggal, sort } = parsePackageSearchParams(await searchParams);
  const filtered = !!(region?.length || negara?.length || jenis?.length || durasi?.length || harga || tanggal || sort);
  const paged = !filtered && !q && page && page > 1;
  return pageMetadata({
    title: paged ? `Paket Tour Luar Negeri – Halaman ${page}` : 'Paket Tour Luar Negeri Terbaik',
    description:
      'Pilihan paket tour luar negeri ke Asia, Eropa, dan Timur Tengah. Bandingkan harga, durasi, dan jadwal keberangkatan, lalu booking mudah via WhatsApp.',
    path: paged ? `/paket-tour?page=${page}` : '/paket-tour',
    image: getImage('heroPaketTour'),
    noindex: !!q,
  });
}

export default async function PaketTourPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filters = parsePackageSearchParams(sp);
  const [{ items: packages, total, page, totalPages }, options] = await Promise.all([
    searchPackages(filters),
    getPackageFilterOptions(),
  ]);
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const emptyImage = getImage('emptySearch');

  return (
    <>
      <main className="min-h-screen pt-20 pb-20 bg-brand-light">
        
        <PageHero
          title="PAKET TOUR"
          subtitle="Temukan perjalanan terbaik sesuai kebutuhan Anda. Kami menawarkan berbagai pilihan destinasi menarik dengan harga terbaik."
          image={getImage('heroPaketTour')}
        />

        <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
          <Breadcrumb items={[{ label: 'Paket Tour' }]} />

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar / Filters (hidden on mobile until the Filter button is tapped) */}
            <input id="mobile-filter-toggle" type="checkbox" className="peer sr-only" />
            <aside className="w-full lg:w-1/4 hidden peer-checked:block lg:block">
              <FilterPanel current={filters} destinations={options.destinations} categories={options.categories} />
            </aside>

            {/* Main Content Area */}
            <div className="w-full lg:w-3/4">
              
              {/* Sorting & Result Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-600">
                  Menampilkan <span className="font-bold text-brand-dark">{from}-{to}</span> dari <span className="font-bold text-brand-dark">{total}</span> paket
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Mobile Filter Trigger */}
                  <label htmlFor="mobile-filter-toggle" className="lg:hidden flex items-center justify-center gap-2 bg-gray-100 px-4 py-2 rounded-xl text-sm font-semibold flex-1 cursor-pointer">
                    <SlidersHorizontal size={16} /> Filter
                  </label>
                  
                  {/* Sorting Dropdown */}
                  <SortSelect value={filters.sort} />
                </div>
              </div>

              {/* Package Grid */}
              {packages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {packages.map((pkg, i) => (
                    <Reveal key={pkg.id} delay={(i % 3) * 80} className="h-full">
                      <PackageCard data={pkg} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-10 text-center">
                  {emptyImage && (
                    <Image src={emptyImage.src} alt={emptyImage.alt} width={160} height={160} className="mx-auto mb-6 rounded-2xl" />
                  )}
                  <p className="font-bold text-brand-navy mb-2">Paket tidak ditemukan</p>
                  <p className="text-sm text-brand-muted">Coba ubah atau reset filter pencarian Anda.</p>
                </div>
              )}

              {/* Pagination */}
              <Pagination page={page} totalPages={totalPages} basePath="/paket-tour" searchParams={sp} />

            </div>

          </div>
        </div>

      </main>

    </>
  );
}

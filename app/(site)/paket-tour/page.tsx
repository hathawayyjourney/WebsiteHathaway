import Breadcrumb from '@/src/components/ui/Breadcrumb';
import FilterPanel from '@/src/components/package/FilterPanel';
import PackageCard from '@/src/components/package/PackageCard';
import Pagination from '@/src/components/ui/Pagination';
import SortSelect from '@/src/components/package/SortSelect';
import { SlidersHorizontal } from 'lucide-react';
import type { Metadata } from 'next';
import { getPackageFilterOptions, searchPackages } from '@/src/server/queries/packages';
import { PAGE_SIZE, parsePackageSearchParams } from '@/src/lib/package-filters';

export const metadata: Metadata = {
  title: 'Paket Tour',
  description: 'Temukan paket tour domestik dan internasional terbaik dari Hathaway Journey.',
};

export default async function PaketTourPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const filters = parsePackageSearchParams(sp);
  const [{ items: packages, total, page, totalPages }, options] = await Promise.all([
    searchPackages(filters),
    getPackageFilterOptions(),
  ]);
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <>
      <main className="min-h-screen pt-20 pb-20 bg-brand-light">
        
        {/* Page Hero Area */}
        <div className="bg-brand-navy py-16 lg:py-20 relative overflow-hidden mb-10">
          <div 
            className="absolute inset-0 z-0 opacity-20 mix-blend-overlay bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')" }}
          ></div>
          <div className="container mx-auto px-4 lg:px-8 max-w-[1250px] relative z-10 text-center">
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">PAKET TOUR</h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Temukan perjalanan terbaik sesuai kebutuhan Anda. Kami menawarkan berbagai pilihan destinasi menarik dengan harga terbaik.
            </p>
          </div>
        </div>

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
                  {packages.map(pkg => (
                    <PackageCard key={pkg.id} data={pkg} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-10 text-center">
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

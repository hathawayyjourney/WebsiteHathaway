import Header from '@/src/components/layout/Header';
import Footer from '@/src/components/layout/Footer';
import WhatsAppFloating from '@/src/components/ui/WhatsAppFloating';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import FilterPanel from '@/src/components/package/FilterPanel';
import PackageCard from '@/src/components/package/PackageCard';
import Pagination from '@/src/components/ui/Pagination';
import { recommendedPackages } from '@/src/data/mock';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

export default function PaketTourPage() {
  // Duplicate packages to simulate a full grid (12 items)
  const packages = [
    ...recommendedPackages,
    ...recommendedPackages.map(p => ({ ...p, id: p.id + '-2' })),
    ...recommendedPackages.map(p => ({ ...p, id: p.id + '-3' })),
  ];

  return (
    <>
      <Header />
      
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
            
            {/* Sidebar / Filters (Hidden on mobile initially, or stacked) */}
            <aside className="w-full lg:w-1/4">
              <FilterPanel />
            </aside>

            {/* Main Content Area */}
            <div className="w-full lg:w-3/4">
              
              {/* Sorting & Result Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-600">
                  Menampilkan <span className="font-bold text-brand-dark">1-12</span> dari <span className="font-bold text-brand-dark">120</span> paket
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Mobile Filter Trigger */}
                  <button className="lg:hidden flex items-center justify-center gap-2 bg-gray-100 px-4 py-2 rounded-xl text-sm font-semibold flex-1">
                    <SlidersHorizontal size={16} /> Filter
                  </button>
                  
                  {/* Sorting Dropdown */}
                  <div className="relative flex-1 sm:w-48">
                    <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-sm font-semibold text-brand-dark px-4 py-2 pr-10 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-navy cursor-pointer">
                      <option>Recommended</option>
                      <option>Terbaru</option>
                      <option>Harga Terendah</option>
                      <option>Harga Tertinggi</option>
                      <option>Terpopuler</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Package Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {packages.map(pkg => (
                  <PackageCard key={pkg.id} data={pkg} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination />

            </div>

          </div>
        </div>

      </main>

      <Footer />
      <WhatsAppFloating />
    </>
  );
}

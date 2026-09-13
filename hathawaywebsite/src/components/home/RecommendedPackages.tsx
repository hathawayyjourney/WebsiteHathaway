import { recommendedPackages } from '../../data/mock';
import PackageCard from '../package/PackageCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RecommendedPackages() {
  return (
    <section className="py-16 container mx-auto px-4 lg:px-8 max-w-[1250px]">
      
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-2xl lg:text-3xl font-black text-brand-navy tracking-tight">PAKET REKOMENDASI</h2>
        <div className="w-16 h-1 bg-brand-red mx-auto mt-2 rounded-full relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-brand-navy"></div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {recommendedPackages.map(pkg => (
          <PackageCard key={pkg.id} data={pkg} />
        ))}
      </div>

      {/* View All */}
      <div className="flex justify-center">
        <Link 
          href="/paket-tour"
          className="flex items-center gap-2 bg-white text-brand-navy border border-gray-300 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition"
        >
          Lihat Semua Paket <ArrowRight size={16} />
        </Link>
      </div>

    </section>
  );
}

import { popularDestinations } from '../../data/mock';
import DestinationCard from '../destination/DestinationCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PopularDestinations() {
  return (
    <section className="py-8 container mx-auto px-4 lg:px-8 max-w-[1250px]">
      
      {/* Section Title */}
      <div className="text-center mb-10">
        <h2 className="text-2xl lg:text-3xl font-black text-brand-navy tracking-tight">DESTINASI POPULER</h2>
        <div className="w-16 h-1 bg-brand-red mx-auto mt-2 rounded-full relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-brand-navy"></div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {popularDestinations.map(dest => (
          <DestinationCard key={dest.id} data={dest} />
        ))}
      </div>

      {/* View All */}
      <div className="flex justify-center">
        <Link 
          href="/destinasi"
          className="flex items-center gap-2 bg-white text-brand-navy border border-gray-300 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition"
        >
          Lihat Semua Destinasi <ArrowRight size={16} />
        </Link>
      </div>

    </section>
  );
}

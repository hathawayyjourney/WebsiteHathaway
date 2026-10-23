import DestinationCard from '../destination/DestinationCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Decor from '../ui/Decor';
import { getImage } from '@/src/lib/images';
import Reveal from '@/src/components/ui/Reveal';
import type { PopularDestination } from '@/src/server/queries/destinations';

// Columns follow the number of cards so a short list doesn't leave empty slots.
function gridColumns(count: number): string {
  if (count >= 5) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
  if (count === 4) return 'grid-cols-2 lg:grid-cols-4';
  return 'grid-cols-2 sm:grid-cols-3';
}

// Destinations ticked "Tampilkan di Destinasi Populer" in Admin → Destinasi (name, photo and order come from there).
export default function PopularDestinations({ destinations }: { destinations: PopularDestination[] }) {
  if (destinations.length === 0) return null;
  // On the 2-column phone grid an odd last card spans the full row instead of leaving a hole.
  const oddOnPhone = destinations.length % 2 === 1;

  return (
    <section className="relative py-8 container mx-auto px-4 lg:px-8 max-w-[1250px]">
      <Decor image={getImage('decorPassport')} className="-top-12 right-0 xl:right-10 w-32 rotate-12" floatDelay={0.8} />

      {/* Section Title */}
      <Reveal className="text-center mb-10">
        <h2 className="text-2xl lg:text-3xl font-black text-brand-navy tracking-tight">DESTINASI POPULER</h2>
        <div className="w-16 h-1 bg-brand-red mx-auto mt-2 rounded-full relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-brand-navy"></div>
        </div>
      </Reveal>

      {/* Grid */}
      <div className={`grid ${gridColumns(destinations.length)} gap-4 mb-10`}>
        {destinations.map((dest, i) => (
          <Reveal
            key={dest.id}
            delay={i * 80}
            className={oddOnPhone && i === destinations.length - 1 ? 'col-span-2 sm:col-span-1' : undefined}
          >
            <DestinationCard data={{ id: dest.slug, name: dest.name.toUpperCase(), image: dest.image ?? '/logo.png' }} />
          </Reveal>
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

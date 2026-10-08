import DestinationCard from '../destination/DestinationCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SETTINGS_DEFAULTS, type HomeRegion } from '@/src/lib/settings-defaults';
import Decor from '../ui/Decor';
import { getImage, pickImage } from '@/src/lib/images';
import { REGION_IMAGE_KEYS } from '@/src/lib/image-assets';

// Default photo per region, used to tell whether an admin has replaced it.
const DEFAULT_IMAGES = new Map(SETTINGS_DEFAULTS.home_regions.map((r) => [r.region, r.image]));

export default function PopularDestinations({ regions }: { regions: HomeRegion[] }) {
  return (
    <section className="relative py-8 container mx-auto px-4 lg:px-8 max-w-[1250px]">
      <Decor image={getImage('decorPassport')} className="-top-12 right-0 xl:right-10 w-32 rotate-12" />

      {/* Section Title */}
      <div className="text-center mb-10">
        <h2 className="text-2xl lg:text-3xl font-black text-brand-navy tracking-tight">DESTINASI POPULER</h2>
        <div className="w-16 h-1 bg-brand-red mx-auto mt-2 rounded-full relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-brand-navy"></div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {regions.map(item => (
          <DestinationCard
            key={item.region}
            data={{
              id: item.region,
              name: item.label,
              image: REGION_IMAGE_KEYS[item.region]
                ? pickImage(REGION_IMAGE_KEYS[item.region], item.image, DEFAULT_IMAGES.get(item.region) ?? item.image)
                : item.image,
              href: `/destinasi?region=${item.region.toLowerCase()}`,
            }}
          />
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

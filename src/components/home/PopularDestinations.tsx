import DestinationCard from '../destination/DestinationCard';
import { regionPageHref } from '@/src/lib/regions';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SETTINGS_DEFAULTS, type HomeRegion } from '@/src/lib/settings-defaults';
import Decor from '../ui/Decor';
import { getImage, pickImage } from '@/src/lib/images';
import { REGION_IMAGE_KEYS } from '@/src/lib/image-assets';
import Reveal from '@/src/components/ui/Reveal';

// Default photo per region, used to tell whether an admin has replaced it.
const DEFAULT_IMAGES = new Map(SETTINGS_DEFAULTS.home_regions.map((r) => [r.region, r.image]));

export default function PopularDestinations({ regions }: { regions: HomeRegion[] }) {
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {regions.map((item, i) => (
          <Reveal key={item.region} delay={i * 80}>
          <DestinationCard
            data={{
              id: item.region,
              name: item.label,
              image: REGION_IMAGE_KEYS[item.region]
                ? pickImage(REGION_IMAGE_KEYS[item.region], item.image, DEFAULT_IMAGES.get(item.region) ?? item.image)
                : item.image,
              // Regions with a landing page link there (SEO); "Destinasi Lain" keeps the filtered list.
              href: regionPageHref(item.region) ?? `/destinasi?region=${item.region.toLowerCase()}`,
            }}
          />
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

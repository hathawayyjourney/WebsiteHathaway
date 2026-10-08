import Image from 'next/image';
import { Users, Briefcase, Globe2, Award } from 'lucide-react';
import { getImage } from '@/src/lib/images';
import type { HomeStat } from '@/src/lib/settings-defaults';
import Reveal from '@/src/components/ui/Reveal';
import CountUp from '@/src/components/ui/CountUp';

const ICONS = [Users, Briefcase, Globe2, Award];

export default function StatsSection({ items }: { items: HomeStat[] }) {
  const stats = items.map((item, idx) => ({ ...item, icon: ICONS[idx % ICONS.length] }));
  const background = getImage('homeStatsBg');

  return (
    <section className="py-12 container mx-auto px-4 lg:px-8 max-w-[1250px]">
      <Reveal>
      <div className="relative overflow-hidden bg-brand-navy rounded-3xl p-8 lg:p-12 shadow-lg">
        {background && (
          <Image src={background.src} alt="" fill sizes="(min-width: 1250px) 1250px, 100vw" className="object-cover opacity-30 mix-blend-overlay pointer-events-none" />
        )}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-1 items-center justify-center gap-4 pt-6 md:pt-0 first:pt-0 w-full">
              <stat.icon size={40} className="text-white" strokeWidth={1.5} />
              <div>
                <h3 className="text-white font-bold text-3xl leading-none mb-1"><CountUp value={stat.value} /></h3>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </Reveal>
    </section>
  );
}

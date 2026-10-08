import { ShieldCheck, ThumbsUp, Headphones, Award, Users, CreditCard } from 'lucide-react';
import type { HomeBenefit } from '@/src/lib/settings-defaults';
import Reveal from '@/src/components/ui/Reveal';

const ICONS = [ShieldCheck, ThumbsUp, Headphones, Award, Users, CreditCard];

export default function TrustBenefits({ items }: { items: HomeBenefit[] }) {
  const benefits = items.map((item, idx) => ({ ...item, icon: ICONS[idx % ICONS.length] }));

  return (
    <section className="py-12 bg-transparent container mx-auto px-4 lg:px-8 max-w-[1250px]">
      <Reveal>
      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-wrap justify-between gap-6">
        {benefits.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="text-brand-navy">
              <item.icon size={32} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-dark leading-tight mb-1">{item.title}</h4>
              <p className="text-[11px] text-brand-muted">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      </Reveal>
    </section>
  );
}

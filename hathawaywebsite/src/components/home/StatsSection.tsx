import { Users, Briefcase, Globe2, Award } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    { icon: Users, value: '10.000+', label: 'Happy Customer' },
    { icon: Briefcase, value: '500+', label: 'Paket Tour' },
    { icon: Globe2, value: '50+', label: 'Destinasi' },
    { icon: Award, value: '5+', label: 'Tahun Pengalaman' }
  ];

  return (
    <section className="py-12 container mx-auto px-4 lg:px-8 max-w-[1250px]">
      <div className="bg-brand-navy rounded-3xl p-8 lg:p-12 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/20">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-1 items-center justify-center gap-4 pt-6 md:pt-0 first:pt-0 w-full">
              <stat.icon size={40} className="text-white" strokeWidth={1.5} />
              <div>
                <h3 className="text-white font-bold text-3xl leading-none mb-1">{stat.value}</h3>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

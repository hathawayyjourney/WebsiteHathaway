import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { PackageData } from '../../types';

export default function PackageCard({ data }: { data: PackageData }) {
  return (
    <div className="bg-white rounded-[20px] shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Image Area */}
      <div className="relative h-48 w-full bg-gray-200">
        <Image 
          src={data.image}
          alt={data.name}
          fill
          className="object-cover"
        />
        {/* Top Badges */}
        <div className="absolute top-0 left-0 right-0 flex justify-between p-3">
          {data.badge && (
            <span className={`${data.badgeColor || 'bg-brand-red'} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm`}>
              {data.badge}
            </span>
          )}
          <span className="bg-brand-navy text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            {data.duration}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-bold text-brand-navy text-lg leading-tight mb-4 min-h-[44px]">
          {data.name.split('\n').map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-brand-muted font-medium mb-6">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            {data.countries}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            {data.departure}
          </div>
        </div>

        {/* Price & CTA */}
        <div className="mt-auto">
          <p className="text-[11px] text-brand-muted font-medium mb-0.5">Mulai dari</p>
          <div className="flex items-end gap-1 mb-5">
            <p className="text-brand-red font-bold text-xl">Rp {data.price}</p>
            <span className="text-brand-muted text-xs font-medium mb-1">/pax</span>
          </div>

          <Link 
            href={`/paket-tour/${data.id}`}
            className="block w-full bg-brand-navy hover:bg-brand-navy-sec text-white text-center py-2.5 rounded-full text-sm font-semibold transition"
          >
            Lihat Detail <ArrowRight size={16} className="inline-block ml-1 -mt-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

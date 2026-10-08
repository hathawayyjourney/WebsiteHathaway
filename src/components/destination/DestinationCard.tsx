import Image from 'next/image';
import Link from 'next/link';

export default function DestinationCard({ data }: { data: { id: string, name: string, image: string, href?: string, subtitle?: string } }) {
  return (
    <Link href={data.href ?? `/destinasi/${data.id}`} className="group block relative h-40 lg:h-48 w-full rounded-[16px] overflow-hidden shadow-sm">
      <Image 
        src={data.image}
        alt={data.name}
        fill
        // Grids show 2–5 cards per row.
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        className="object-cover group-hover:scale-110 transition duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-black/20 to-transparent"></div>
      <div className="absolute bottom-4 left-0 right-0 text-center px-2">
        <h3 className="text-white font-bold text-sm lg:text-base tracking-widest">{data.name}</h3>
        {data.subtitle && <p className="text-white/80 text-[11px] font-medium mt-0.5">{data.subtitle}</p>}
      </div>
    </Link>
  );
}

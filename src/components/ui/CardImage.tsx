import Image from 'next/image';
import type { SiteImage } from '@/src/lib/images';

/** Full-bleed image at the top of a `p-8 rounded-[20px]` card. Renders nothing until the asset exists. */
export default function CardImage({ image, className = 'h-48' }: { image: SiteImage | null; className?: string }) {
  if (!image) return null;
  return (
    <div className={`relative -mx-8 -mt-8 mb-8 rounded-t-[20px] overflow-hidden ${className}`}>
      <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
    </div>
  );
}

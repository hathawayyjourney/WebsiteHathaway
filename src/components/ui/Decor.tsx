import Image from 'next/image';
import type { SiteImage } from '@/src/lib/images';

/** Decorative cut-out accent placed at a section edge. Desktop only; renders nothing until the asset exists. */
export default function Decor({ image, className, size = 192 }: { image: SiteImage | null; className: string; size?: number }) {
  if (!image) return null;
  return (
    <Image
      src={image.src}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={`hidden lg:block absolute pointer-events-none select-none drop-shadow-xl ${className}`}
    />
  );
}

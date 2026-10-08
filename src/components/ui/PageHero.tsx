import Image from 'next/image';
import type { SiteImage } from '@/src/lib/image-assets';

// Navy shading over the photo: darker behind the centered text and toward the bottom.
// Plain rgba() CSS (not Tailwind `/opacity` modifiers, which rely on color-mix) so it renders in every browser,
// including older Safari. #082A63 = brand-navy.
const HERO_OVERLAY = [
  'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(8,42,99,0.55) 0%, rgba(8,42,99,0) 70%)',
  'linear-gradient(to top, rgba(8,42,99,0.92) 0%, rgba(8,42,99,0.6) 45%, rgba(8,42,99,0.2) 100%)',
].join(', ');

const TEXT_SHADOW = '0 2px 12px rgba(0,0,0,0.35)';

// Hosts allowed in next.config.ts images.remotePatterns, so next/image can optimize them.
const OPTIMIZED_HOSTS = ['images.unsplash.com', 'res.cloudinary.com'];

function canOptimize(src: string): boolean {
  if (src.startsWith('/')) return true;
  try {
    const url = new URL(src);
    return url.protocol === 'https:' && OPTIMIZED_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

// Hero band shared by every inner page: sharp photo + navy gradient, plain navy when there is no image.
export default function PageHero({
  title,
  subtitle,
  image: imageProp,
}: {
  title: string;
  subtitle?: string;
  /** A static asset from getImage() (with focus point) or a plain URL from the database. */
  image?: SiteImage | string | null;
}) {
  const image = typeof imageProp === 'string' ? imageProp : imageProp?.src;
  const position = typeof imageProp === 'object' && imageProp ? imageProp.position : undefined;
  // Static assets carry their own alt; admin photos (package/destination) describe the page subject.
  const alt = typeof imageProp === 'object' && imageProp ? imageProp.alt : title;

  return (
    <div className="bg-brand-navy py-16 lg:py-20 relative overflow-hidden mb-10">
      {image &&
        (canOptimize(image) ? (
          // Local assets and Unsplash/Cloudinary photos are optimized by next/image (and visible to image search).
          <Image src={image} alt={alt} fill priority sizes="100vw" className="absolute inset-0 z-0 object-cover anim-ken-burns" style={{ objectPosition: position }} />
        ) : (
          // Admin-provided URLs on any other host stay a CSS background.
          <div className="absolute inset-0 z-0 bg-cover bg-center anim-ken-burns" style={{ backgroundImage: `url('${image}')`, backgroundPosition: position }}></div>
        ))}
      {image && <div className="absolute inset-0 z-0" style={{ backgroundImage: HERO_OVERLAY }}></div>}
      <div className="container mx-auto px-4 lg:px-8 max-w-[1250px] relative z-10 text-center">
        <h1 className="anim-fade-up text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight whitespace-pre-line" style={{ textShadow: TEXT_SHADOW }}>
          {title}
        </h1>
        {subtitle && (
          <p className="anim-fade-up max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.85)', textShadow: TEXT_SHADOW, '--anim-delay': '120ms' } as React.CSSProperties}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

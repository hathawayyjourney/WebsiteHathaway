import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import { getImage } from '@/src/lib/images';
import { getTestimonials } from '@/src/server/queries/content';
import { formatDate } from '@/src/lib/format';
import Reveal from '@/src/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'Testimoni',
  description: 'Cerita dan pengalaman pelanggan yang telah berlibur bersama Hathaway Journey.',
};

export default async function TestimoniPage() {
  const testimonials = await getTestimonials();

  return (
    <main className="min-h-screen pt-20 pb-20 bg-brand-light">
      <PageHero title="TESTIMONI" subtitle="Cerita dan pengalaman pelanggan yang telah berlibur bersama Hathaway Journey." image={getImage('heroTestimoni')} />

      <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
        <Breadcrumb items={[{ label: 'Testimoni' }]} />

        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 80} className="h-full">
              <figure className="h-full bg-white p-8 rounded-[20px] shadow-sm border border-gray-100 flex flex-col">
                <div className="flex gap-1 mb-4 text-orange-400" aria-label={`Rating ${t.rating} dari 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} fill={i < t.rating ? 'currentColor' : 'none'} className={i < t.rating ? '' : 'text-gray-300'} />
                  ))}
                </div>
                <blockquote className="text-gray-600 leading-relaxed flex-1 whitespace-pre-line">“{t.review}”</blockquote>
                <figcaption className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-softblue text-brand-navy font-bold flex items-center justify-center shrink-0">
                    {t.photo ? <Image src={t.photo} alt={t.name} fill className="object-cover" /> : t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy">{t.name}</p>
                    <p className="text-xs text-brand-muted">
                      {[t.packageLabel, t.date && formatDate(t.date, 'short')].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                </figcaption>
              </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-brand-muted py-10">Belum ada testimoni.</p>
        )}

        <div className="flex justify-center mt-12">
          <Link href="/gallery" className="flex items-center gap-2 bg-white text-brand-navy border border-gray-300 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition">
            Tonton Video Testimoni
          </Link>
        </div>
      </div>
    </main>
  );
}

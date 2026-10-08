import type { Metadata } from 'next';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import { getImage } from '@/src/lib/images';
import { getSetting } from '@/src/server/queries/settings';

export const metadata: Metadata = { title: 'Terms & Conditions' };

export default async function Page() {
  const legal = await getSetting('legal_pages');

  return (
    <main className="min-h-screen pt-20 pb-20 bg-brand-light">
      <PageHero title="TERMS & CONDITIONS" image={getImage('heroLegal')} />
      <div className="container mx-auto px-4 lg:px-8 max-w-[900px]">
        <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />
        <article className="bg-white p-8 lg:p-12 rounded-[20px] shadow-sm border border-gray-100 text-gray-600 leading-relaxed whitespace-pre-line">
          {legal.terms}
        </article>
      </div>
    </main>
  );
}

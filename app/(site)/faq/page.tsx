import type { Metadata } from 'next';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import { FAQ_GROUPS } from '@/src/db/enums';
import { getFaqs } from '@/src/server/queries/content';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Pertanyaan yang sering diajukan seputar booking, pembayaran, visa, dan perjalanan bersama Hathaway Journey.',
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  const groups = FAQ_GROUPS.map((group) => ({ group, items: faqs.filter((f) => f.group === group) })).filter((g) => g.items.length);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };

  return (
    <main className="min-h-screen pt-20 pb-20 bg-brand-light">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <PageHero title="FAQ" subtitle="Pertanyaan yang sering diajukan seputar perjalanan bersama Hathaway Journey." />

      <div className="container mx-auto px-4 lg:px-8 max-w-[900px]">
        <Breadcrumb items={[{ label: 'FAQ' }]} />

        <div className="space-y-8">
          {groups.map(({ group, items }) => (
            <section key={group} className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-brand-navy mb-4">{group}</h2>
              <div className="divide-y divide-gray-100">
                {items.map((faq) => (
                  <details key={faq.id} className="group py-4">
                    <summary className="font-semibold text-brand-dark cursor-pointer list-none flex justify-between items-center gap-4">
                      {faq.question}
                      <span className="text-brand-muted group-open:rotate-45 transition text-xl leading-none">+</span>
                    </summary>
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
          {groups.length === 0 && <p className="text-center text-sm text-brand-muted py-10">Belum ada FAQ.</p>}
        </div>
      </div>
    </main>
  );
}

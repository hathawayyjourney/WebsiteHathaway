import type { Metadata } from 'next';
import { pageMetadata } from '@/src/lib/seo';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import { getImage } from '@/src/lib/images';
import { FAQ_GROUPS } from '@/src/db/enums';
import { getFaqs } from '@/src/server/queries/content';
import { getSettings } from '@/src/server/queries/settings';
import { waLink } from '@/src/lib/whatsapp';
import Reveal from '@/src/components/ui/Reveal';
import JsonLd from '@/src/components/seo/JsonLd';

export const metadata: Metadata = pageMetadata({
  title: 'FAQ Paket Tour & Booking',
  description:
    'Jawaban seputar booking, pembayaran, visa, dokumen, dan persiapan perjalanan paket tour luar negeri bersama Hathaway Journey.',
  path: '/faq',
  image: getImage('heroFaq'),
});

export default async function FaqPage() {
  const [faqs, { contact, wa_templates }] = await Promise.all([getFaqs(), getSettings('contact', 'wa_templates')]);
  const helpImage = getImage('faqHelp');
  const groups = FAQ_GROUPS.map((group) => ({ group, items: faqs.filter((f) => f.group === group) })).filter((g) => g.items.length);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };

  return (
    <main className="min-h-screen pt-20 pb-20 bg-brand-light">
      {faqs.length > 0 && <JsonLd data={jsonLd} />}
      <PageHero title="FAQ" subtitle="Pertanyaan yang sering diajukan seputar perjalanan bersama Hathaway Journey." image={getImage('heroFaq')} />

      <div className="container mx-auto px-4 lg:px-8 max-w-[900px]">
        <Breadcrumb items={[{ label: 'FAQ' }]} />

        <div className="space-y-8">
          {groups.map(({ group, items }) => (
            <Reveal key={group}><section className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100">
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
            </section></Reveal>
          ))}
          {groups.length === 0 && <p className="text-center text-sm text-brand-muted py-10">Belum ada FAQ.</p>}

          {/* Still have questions? */}
          <Reveal><section className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
            {helpImage && (
              <div className="relative h-48 sm:h-auto sm:w-2/5 shrink-0">
                <Image src={helpImage.src} alt={helpImage.alt} fill sizes="(min-width: 640px) 360px, 100vw" className="object-cover" />
              </div>
            )}
            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-xl font-bold text-brand-navy mb-2">Masih ada pertanyaan?</h2>
              <p className="text-sm text-gray-600 mb-6">Tim kami siap membantu menjawab pertanyaan Anda seputar paket, visa, dan pembayaran.</p>
              <a
                href={waLink(contact.whatsapp, wa_templates.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start inline-flex items-center gap-2 bg-brand-wa hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition btn-press shadow-md"
              >
                <Phone size={18} fill="currentColor" /> Chat via WhatsApp
              </a>
            </div>
          </section></Reveal>
        </div>
      </div>
    </main>
  );
}

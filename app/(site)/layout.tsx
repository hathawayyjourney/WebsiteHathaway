import { ViewTransition } from 'react';
import Header from '@/src/components/layout/Header';
import Footer from '@/src/components/layout/Footer';
import WhatsAppFloating from '@/src/components/ui/WhatsAppFloating';
import { getSettings } from '@/src/server/queries/settings';
import { waLink } from '@/src/lib/whatsapp';
import JsonLd from '@/src/components/seo/JsonLd';
import { absoluteUrl, DEFAULT_DESCRIPTION, ORGANIZATION_ID, SITE_NAME, SITE_URL } from '@/src/lib/seo';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { contact, social, wa_templates } = await getSettings('contact', 'social', 'wa_templates');
  const whatsappHref = waLink(contact.whatsapp, wa_templates.general);

  // The business and the website, referenced by @id from page-level schema (packages, reviews).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TravelAgency',
        '@id': ORGANIZATION_ID,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl('/logo.png'),
        image: absoluteUrl('/opengraph-image.jpg'),
        description: DEFAULT_DESCRIPTION,
        telephone: contact.whatsapp ? `+${contact.whatsapp}` : undefined,
        email: contact.email || undefined,
        address: contact.address ? { '@type': 'PostalAddress', streetAddress: contact.address.split('\n').map((line) => line.trim().replace(/,$/, '')).filter(Boolean).join(', '), addressCountry: 'ID' } : undefined,
        areaServed: 'ID',
        sameAs: Object.values(social).filter((href) => /^https?:\/\//.test(href)),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: 'id-ID',
        publisher: { '@id': ORGANIZATION_ID },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/paket-tour?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header whatsappHref={whatsappHref} />
      {/* Page content cross-fades on navigation (see ::view-transition-*(.page-fade) in globals.css). */}
      <ViewTransition default="page-fade">{children}</ViewTransition>
      <Footer contact={contact} social={social} />
      <WhatsAppFloating href={whatsappHref} />
    </>
  );
}

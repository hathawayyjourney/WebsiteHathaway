import { ViewTransition } from 'react';
import Header from '@/src/components/layout/Header';
import Footer from '@/src/components/layout/Footer';
import WhatsAppFloating from '@/src/components/ui/WhatsAppFloating';
import { getSettings } from '@/src/server/queries/settings';
import { waLink } from '@/src/lib/whatsapp';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { contact, social, wa_templates } = await getSettings('contact', 'social', 'wa_templates');
  const whatsappHref = waLink(contact.whatsapp, wa_templates.general);

  return (
    <>
      <Header whatsappHref={whatsappHref} />
      {/* Page content cross-fades on navigation (see ::view-transition-*(.page-fade) in globals.css). */}
      <ViewTransition default="page-fade">{children}</ViewTransition>
      <Footer contact={contact} social={social} />
      <WhatsAppFloating href={whatsappHref} />
    </>
  );
}

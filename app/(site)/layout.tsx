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
      {children}
      <Footer contact={contact} social={social} />
      <WhatsAppFloating href={whatsappHref} />
    </>
  );
}

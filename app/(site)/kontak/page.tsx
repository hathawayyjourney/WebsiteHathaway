import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import { getImage } from '@/src/lib/images';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { pageMetadata } from '@/src/lib/seo';
import ContactForm from '@/src/components/contact/ContactForm';
import CardImage from '@/src/components/ui/CardImage';
import { getSettings } from '@/src/server/queries/settings';
import SocialIcon from '@/src/components/ui/SocialIcon';
import { socialLinks } from '@/src/lib/social';
import Reveal from '@/src/components/ui/Reveal';

export const metadata: Metadata = pageMetadata({
  title: 'Kontak & Konsultasi Tour',
  description:
    'Hubungi Hathaway Journey via WhatsApp, telepon, atau email untuk konsultasi paket tour luar negeri. Alamat kantor dan jam operasional tersedia di sini.',
  path: '/kontak',
  image: getImage('heroKontak'),
});

export default async function KontakPage() {
  const { contact, social } = await getSettings('contact', 'social');
  const socials = socialLinks(social);

  return (
    <>
      <main className="min-h-screen pt-20 pb-20 bg-brand-light">
        <PageHero
          title="KONTAK KAMI"
          subtitle="Hubungi tim Hathaway Journey untuk konsultasi perjalanan Anda."
          image={getImage('heroKontak')}
        />

        <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
          <Breadcrumb items={[{ label: 'Kontak' }]} />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Contact Info */}
            <Reveal className="w-full lg:w-1/3">
              <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100 h-full">
                <CardImage image={getImage('contactOffice')} className="h-44" />
                <h2 className="text-xl font-bold text-brand-navy mb-8">Informasi Kontak</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-softblue text-brand-navy flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-dark mb-1">Alamat Kantor</h4>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {contact.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-softblue text-brand-navy flex items-center justify-center shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-dark mb-1">Telepon & WhatsApp</h4>
                      <p className="text-sm text-gray-600">{contact.phoneDisplay}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-softblue text-brand-navy flex items-center justify-center shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-dark mb-1">Email</h4>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-softblue text-brand-navy flex items-center justify-center shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-dark mb-1">Jam Operasional</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {contact.hours}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social accounts from Admin → Pengaturan → Media Sosial (same source as the footer). */}
                {socials.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h4 className="font-semibold text-brand-dark mb-4">Media Sosial</h4>
                    <div className="flex flex-wrap items-center gap-3">
                      {socials.map((item) => (
                        <a
                          key={item.icon}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={item.name}
                          title={item.name}
                          className="w-10 h-10 rounded-full bg-brand-softblue text-brand-navy flex items-center justify-center hover:bg-brand-navy hover:text-white transition btn-press"
                        >
                          <SocialIcon name={item.icon} size={18} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>

            {/* Contact Form */}
            <Reveal delay={100} className="w-full lg:w-2/3">
              <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-brand-navy mb-8">Kirim Pesan</h2>
                <ContactForm />
              </div>
            </Reveal>
          </div>

          {/* Google Maps Placeholder */}
          <div className="mt-12 w-full h-[400px] bg-gray-200 rounded-[20px] overflow-hidden border border-gray-200 flex items-center justify-center">
            {contact.mapsEmbedUrl ? (
              <iframe src={contact.mapsEmbedUrl} title="Lokasi Hathaway Journey" className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            ) : (
              <span className="text-gray-500 font-semibold">Google Maps Embed Placeholder</span>
            )}
          </div>

        </div>
      </main>

    </>
  );
}

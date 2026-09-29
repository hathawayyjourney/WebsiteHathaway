import Breadcrumb from '@/src/components/ui/Breadcrumb';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import ContactForm from '@/src/components/contact/ContactForm';
import { getSetting } from '@/src/server/queries/settings';

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Hubungi tim Hathaway Journey untuk konsultasi perjalanan Anda.',
};

export default async function KontakPage() {
  const contact = await getSetting('contact');

  return (
    <>
      <main className="min-h-screen pt-20 pb-20 bg-brand-light">
        <div className="bg-brand-navy py-16 lg:py-20 relative overflow-hidden mb-10">
          <div className="container mx-auto px-4 lg:px-8 max-w-[1250px] relative z-10 text-center">
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">KONTAK KAMI</h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Hubungi tim Hathaway Journey untuk konsultasi perjalanan Anda.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
          <Breadcrumb items={[{ label: 'Kontak' }]} />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100 h-full">
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
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-brand-navy mb-8">Kirim Pesan</h2>
                <ContactForm />
              </div>
            </div>
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

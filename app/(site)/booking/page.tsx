import type { Metadata } from 'next';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import { getImage } from '@/src/lib/images';
import BookingForm from '@/src/components/booking/BookingForm';
import CardImage from '@/src/components/ui/CardImage';
import { getBookingOptions } from '@/src/server/queries/packages';
import { getSettings } from '@/src/server/queries/settings';

export const metadata: Metadata = {
  title: 'Booking',
  description: 'Booking paket tour Hathaway Journey langsung melalui WhatsApp.',
};

const STEPS = [
  { title: 'Pilih paket & jadwal', desc: 'Tentukan paket tour, tanggal keberangkatan, dan jumlah peserta.' },
  { title: 'Kirim via WhatsApp', desc: 'Pesan booking otomatis terisi dan terkirim ke admin kami.' },
  { title: 'Konfirmasi admin', desc: 'Admin mengonfirmasi ketersediaan kursi, harga final, dan pembayaran.' },
];

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ paket?: string }> }) {
  const [{ paket }, packages, { contact, wa_templates }] = await Promise.all([
    searchParams,
    getBookingOptions(),
    getSettings('contact', 'wa_templates'),
  ]);

  return (
    <main className="min-h-screen pt-20 pb-20 bg-brand-light">
      <PageHero title="BOOKING" subtitle="Pilih paket impian Anda, lalu lanjutkan pemesanan langsung dengan admin kami via WhatsApp." image={getImage('heroBooking')} />

      <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
        <Breadcrumb items={[{ label: 'Booking' }]} />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-brand-navy mb-8">Form Booking</h2>
              <BookingForm
                packages={packages}
                initialSlug={paket}
                whatsapp={contact.whatsapp}
                template={wa_templates.booking}
                siteUrl={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
              />
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100 h-full">
              <CardImage image={getImage('bookingHelp')} />
              <h2 className="text-xl font-bold text-brand-navy mb-8">Cara Booking</h2>
              <ol className="space-y-6">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-softblue text-brand-navy font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                    <div>
                      <h4 className="font-semibold text-brand-dark mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

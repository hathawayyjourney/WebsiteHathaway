import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bed, Check, Clock, MapPin, Plane, Star, Tag, X } from 'lucide-react';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import PackageGallery from '@/src/components/package/PackageGallery';
import BookingCard from '@/src/components/package/BookingCard';
import TrackView from '@/src/components/analytics/TrackView';
import { getPackageBySlug } from '@/src/server/queries/packages';
import { getSettings } from '@/src/server/queries/settings';
import { singleLine } from '@/src/lib/format';

type Props = { params: Promise<{ slug: string }> };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pkg = await getPackageBySlug((await params).slug);
  if (!pkg) return { title: 'Paket tidak ditemukan' };
  const title = pkg.seoTitle || singleLine(pkg.name);
  const description = pkg.metaDescription || pkg.summary || undefined;
  return {
    title,
    description,
    alternates: { canonical: `/paket-tour/${pkg.slug}` },
    openGraph: { title, description, images: [pkg.thumbnail] },
  };
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 lg:p-8">
      <h2 className="text-xl font-bold text-brand-navy mb-6">{title}</h2>
      {children}
    </section>
  );
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const [pkg, { contact, wa_templates }] = await Promise.all([getPackageBySlug(slug), getSettings('contact', 'wa_templates')]);
  if (!pkg) notFound();

  const name = singleLine(pkg.name);
  const images = [...new Set([pkg.thumbnail, ...pkg.images.map((i) => i.url)])];
  const destinationNames = pkg.destinations.map((d) => d.name).join(', ');
  const youtubeId = pkg.videoUrl?.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)?.[1];

  const facts = [
    { icon: Clock, label: 'Durasi', value: `${pkg.durationDays} Hari` },
    { icon: MapPin, label: 'Destinasi', value: destinationNames || pkg.countriesLabel || '-' },
    { icon: Tag, label: 'Kategori', value: pkg.category?.name ?? '-' },
    { icon: Star, label: 'Rating', value: pkg.rating ? `${pkg.rating} / 5` : '-' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name,
    description: pkg.summary ?? undefined,
    image: pkg.thumbnail,
    offers: { '@type': 'Offer', price: pkg.promoPrice ?? pkg.price, priceCurrency: 'IDR', url: `${siteUrl}/paket-tour/${pkg.slug}` },
  };

  return (
    <main className="min-h-screen pt-20 pb-20 bg-brand-light">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <TrackView event="view_package" params={{ package: name, slug: pkg.slug }} />
      <PageHero title={name} subtitle={[pkg.countriesLabel, `${pkg.durationDays} Hari`].filter(Boolean).join(' • ')} image={pkg.thumbnail} />

      <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
        <Breadcrumb items={[{ label: 'Paket Tour', href: '/paket-tour' }, { label: name }]} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-8">
            <PackageGallery images={images} alt={name} />

            <Card title="Informasi Paket">
              {pkg.code && <p className="text-xs text-brand-muted font-semibold mb-4">Kode Paket: {pkg.code}</p>}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-brand-softblue text-brand-navy rounded-full flex items-center justify-center shrink-0">
                      <fact.icon size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] text-brand-muted font-medium">{fact.label}</p>
                      <p className="text-sm font-semibold text-brand-dark">{fact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {pkg.description && <p className="text-gray-600 leading-relaxed whitespace-pre-line">{pkg.description}</p>}
            </Card>

            {youtubeId && (
              <Card title="Video">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                  <iframe src={`https://www.youtube.com/embed/${youtubeId}`} title={name} allowFullScreen className="absolute inset-0 w-full h-full" loading="lazy" />
                </div>
              </Card>
            )}

            {pkg.itinerary.length > 0 && (
              <Card title="Itinerary">
                <ol className="space-y-6">
                  {pkg.itinerary.map((day) => (
                    <li key={day.id} className="flex gap-4">
                      <div className="shrink-0 w-14 h-14 rounded-2xl bg-brand-navy text-white flex flex-col items-center justify-center">
                        <span className="text-[10px] font-semibold leading-none">DAY</span>
                        <span className="text-lg font-black leading-none">{String(day.dayNo).padStart(2, '0')}</span>
                      </div>
                      <div className="flex-1 border-b border-gray-100 pb-6">
                        <h3 className="font-bold text-brand-dark mb-2">{day.title}</h3>
                        <ul className="space-y-1.5 text-sm text-gray-600">
                          {day.items?.map((item, i) => (
                            <li key={i}>
                              {item.time && <span className="font-semibold text-brand-navy mr-2">{item.time}</span>}
                              {item.activity}
                              {item.location && <span className="text-brand-muted"> — {item.location}</span>}
                              {item.meal && <span className="block text-[11px] text-brand-red font-medium">Meal: {item.meal}</span>}
                            </li>
                          ))}
                        </ul>
                        {(day.hotel || day.transport) && (
                          <p className="text-xs text-brand-muted mt-2">
                            {day.hotel && <>Hotel: {day.hotel}</>}
                            {day.hotel && day.transport && ' • '}
                            {day.transport && <>Transportasi: {day.transport}</>}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </Card>
            )}

            {(pkg.includes?.length || pkg.excludes?.length) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Termasuk">
                  <ul className="space-y-2.5">
                    {pkg.includes?.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check size={16} className="text-green-600 shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card title="Tidak Termasuk">
                  <ul className="space-y-2.5">
                    {pkg.excludes?.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <X size={16} className="text-brand-red shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ) : null}

            {(pkg.hotels?.length || pkg.transports?.length) ? (
              <Card title="Hotel & Transportasi">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ul className="space-y-4">
                    {pkg.hotels?.map((hotel) => (
                      <li key={hotel.name} className="flex items-start gap-3">
                        <Bed size={18} className="text-brand-navy shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-brand-dark">
                            {hotel.name} {hotel.star ? <span className="text-orange-400">{'★'.repeat(hotel.star)}</span> : null}
                          </p>
                          <p className="text-brand-muted text-xs">{[hotel.location, hotel.roomType].filter(Boolean).join(' • ')}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-4">
                    {pkg.transports?.map((t) => (
                      <li key={t.type + t.detail} className="flex items-start gap-3">
                        <Plane size={18} className="text-brand-navy shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-brand-dark">{t.type}</p>
                          <p className="text-brand-muted text-xs">{t.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ) : null}

            {pkg.terms?.length ? (
              <Card title="Syarat & Ketentuan">
                <div className="divide-y divide-gray-100">
                  {pkg.terms.map((term) => (
                    <details key={term.title} className="group py-3">
                      <summary className="font-semibold text-brand-dark cursor-pointer list-none flex justify-between items-center">
                        {term.title}
                        <span className="text-brand-muted group-open:rotate-45 transition text-xl leading-none">+</span>
                      </summary>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line">{term.content}</p>
                    </details>
                  ))}
                </div>
              </Card>
            ) : null}
          </div>

          {/* Booking Sidebar */}
          <aside className="w-full lg:w-1/3">
            <div className="lg:sticky lg:top-28">
              <BookingCard
                packageName={name}
                packageUrl={`${siteUrl}/paket-tour/${pkg.slug}`}
                price={pkg.price}
                promoPrice={pkg.promoPrice}
                childPrice={pkg.childPrice}
                singleSupplement={pkg.singleSupplement}
                deposit={pkg.deposit}
                schedules={pkg.schedules.map(({ id, departureDate, status, seatsLeft, quota }) => ({ id, departureDate, status, seatsLeft, quota }))}
                whatsapp={contact.whatsapp}
                bookingTemplate={wa_templates.booking}
                inquiryTemplate={wa_templates.inquiry}
              />
              <Link href="/paket-tour" className="block text-center text-sm font-semibold text-brand-navy hover:text-brand-red transition mt-4">
                ← Lihat paket lainnya
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

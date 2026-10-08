import Breadcrumb from '@/src/components/ui/Breadcrumb';
import PageHero from '@/src/components/ui/PageHero';
import { getImage, pickImage } from '@/src/lib/images';
import { SETTINGS_DEFAULTS } from '@/src/lib/settings-defaults';
import FinalCTA from '@/src/components/home/FinalCTA';
import Image from 'next/image';
import type { Metadata } from 'next';
import { pageMetadata } from '@/src/lib/seo';
import { getSettings } from '@/src/server/queries/settings';
import { getCompanyExtras } from '@/src/server/queries/content';
import { waLink } from '@/src/lib/whatsapp';
import Reveal from '@/src/components/ui/Reveal';

export const metadata: Metadata = pageMetadata({
  title: 'Tentang Kami',
  description:
    'Kenali Hathaway Journey: travel agent penyelenggara paket tour luar negeri dengan tour leader berpengalaman, legalitas resmi, dan layanan sepenuh hati.',
  path: '/tentang-kami',
  image: getImage('heroAsiaCollage'),
});

/** Photo blended into a colored card (Visi/Misi), like the page hero treatment. */
function CardTexture({ image }: { image: ReturnType<typeof getImage> }) {
  if (!image) return null;
  return <Image src={image.src} alt="" fill sizes="400px" className="object-cover opacity-15 mix-blend-overlay pointer-events-none" />;
}

export default async function TentangKamiPage() {
  const [{ company, contact, wa_templates }, { legal, team, partners }] = await Promise.all([
    getSettings('company', 'contact', 'wa_templates'),
    getCompanyExtras(),
  ]);

  return (
    <>
      <main className="min-h-screen pt-20 pb-0 bg-brand-light">
        <PageHero
          title="TENTANG KAMI"
          subtitle="Mengenal lebih dekat Hathaway Journey, partner perjalanan terpercaya Anda."
          image={getImage('heroAsiaCollage')}
        />

        <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
          <Breadcrumb items={[{ label: 'Tentang Kami' }]} />

          {/* Section: Tentang & Sejarah */}
          <Reveal className="flex flex-col md:flex-row gap-12 items-center mb-20 bg-white p-8 lg:p-12 rounded-[20px] shadow-sm">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl lg:text-3xl font-black text-brand-navy mb-6">TENTANG HATHAWAY JOURNEY</h2>
              <div className="w-12 h-1 bg-brand-red mb-6"></div>
              <p className="text-gray-600 mb-4 leading-relaxed whitespace-pre-line">
                {company.about}
              </p>
              <h3 className="font-bold text-lg text-brand-dark mt-8 mb-4">Sejarah Perusahaan</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {company.history}
              </p>
            </div>
            <div className="w-full md:w-1/2 relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={pickImage('aboutCompany', company.image, SETTINGS_DEFAULTS.company.image)}
                alt="Tim Hathaway Journey"
                fill
                sizes="(min-width: 768px) 600px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Section: Visi, Misi, Nilai */}
          <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="relative overflow-hidden bg-brand-navy text-white p-8 rounded-[20px] shadow-lg">
              <CardTexture image={getImage('aboutVision')} />
              <h3 className="relative text-xl font-bold mb-4">Visi</h3>
              <p className="relative text-white/80 leading-relaxed">
                {company.vision}
              </p>
            </div>
            <div className="relative overflow-hidden bg-brand-red text-white p-8 rounded-[20px] shadow-lg">
              <CardTexture image={getImage('aboutMission')} />
              <h3 className="relative text-xl font-bold mb-4">Misi</h3>
              <ul className="relative list-disc list-outside ml-4 text-white/90 space-y-2">
                {company.missions.map((mission) => (
                  <li key={mission}>{mission}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-brand-navy mb-4">Nilai Perusahaan</h3>
              <ul className="list-disc list-outside ml-4 text-gray-600 space-y-2">
                {company.values.map((value) => (
                  <li key={value.title}><strong className="text-brand-dark">{value.title}:</strong> {value.desc}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Section: Legalitas & Sertifikasi */}
          <Reveal className="text-center mb-20">
            <h2 className="text-2xl font-black text-brand-navy mb-12">LEGALITAS & SERTIFIKASI</h2>
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              {legal.map((doc) =>
                doc.fileUrl ? (
                  <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-48 font-bold text-gray-400 hover:text-brand-navy transition">
                    {doc.name}
                    {doc.number && <span className="block text-xs font-medium mt-1">{doc.number}</span>}
                  </a>
                ) : (
                  <div key={doc.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-48 font-bold text-gray-400">
                    {doc.name}
                    {doc.number && <span className="block text-xs font-medium mt-1">{doc.number}</span>}
                  </div>
                ),
              )}
            </div>
          </Reveal>

          {/* Section: Team (shown once admin adds members) */}
          {team.length > 0 && (
            <Reveal className="text-center mb-20">
              <h2 className="text-2xl font-black text-brand-navy mb-12">TIM KAMI</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {team.map((member) => (
                  <div key={member.id} className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="relative h-56 bg-gray-200">
                      {member.photo && <Image src={member.photo} alt={member.name} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-brand-navy">{member.name}</h3>
                      <p className="text-xs text-brand-red font-semibold mb-2">{member.position}</p>
                      {member.bio && <p className="text-xs text-gray-600 leading-relaxed">{member.bio}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* Section: Partnership (shown once admin adds partners) */}
          {partners.length > 0 && (
            <Reveal className="text-center mb-20">
              <h2 className="text-2xl font-black text-brand-navy mb-12">PARTNER KAMI</h2>
              <div className="flex flex-wrap justify-center gap-8">
                {partners.map((partner) => (
                  <div key={partner.id} className="relative bg-white rounded-xl border border-gray-200 shadow-sm w-48 h-24">
                    <Image src={partner.logo} alt={partner.name} fill sizes="200px" className="object-contain p-4" />
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <FinalCTA whatsappHref={waLink(contact.whatsapp, wa_templates.general)} />
      </main>

    </>
  );
}

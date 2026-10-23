import { asc, eq } from 'drizzle-orm';
import { connection } from 'next/server';
import { db } from '@/src/db';
import { packages } from '@/src/db/schema';
import { formatRupiah, singleLine } from '@/src/lib/format';
import { absoluteUrl, DEFAULT_DESCRIPTION, SITE_NAME } from '@/src/lib/seo';
import { waLink } from '@/src/lib/whatsapp';
import { listDestinations, REGION_LABELS } from '@/src/server/queries/destinations';
import { getSettings } from '@/src/server/queries/settings';

// /llms.txt (https://llmstxt.org): a plain Markdown summary so AI assistants can answer questions
// about the business and link to the right pages. Built from the same admin data as the site.
export async function GET() {
  await connection();
  const [{ contact }, pkgs, dests] = await Promise.all([
    getSettings('contact'),
    db
      .select({
        name: packages.name,
        slug: packages.slug,
        durationDays: packages.durationDays,
        countriesLabel: packages.countriesLabel,
        price: packages.price,
        promoPrice: packages.promoPrice,
        summary: packages.summary,
      })
      .from(packages)
      .where(eq(packages.status, 'PUBLISHED'))
      .orderBy(asc(packages.sort), asc(packages.name)),
    listDestinations(),
  ]);

  // Multiline admin fields (address, hours) on one line; their lines may already end with a comma.
  const oneLine = (text: string) =>
    text
      .split('\n')
      .map((line) => line.trim().replace(/,$/, ''))
      .filter(Boolean)
      .join(', ');
  const page = (title: string, path: string, note: string) => `- [${title}](${absoluteUrl(path)}): ${note}`;

  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${DEFAULT_DESCRIPTION}`,
    '',
    `${SITE_NAME} adalah travel agent di Indonesia yang menyelenggarakan paket tour ke luar negeri dan dalam negeri. ` +
      'Pemesanan dilakukan lewat WhatsApp: pelanggan memilih paket dan tanggal di website, lalu tim kami mengonfirmasi ' +
      'ketersediaan kursi, harga final, dan pembayaran.',
    '',
    '## Kontak',
    '',
    contact.address ? `- Alamat kantor: ${oneLine(contact.address)}` : null,
    contact.whatsapp ? `- WhatsApp: ${contact.phoneDisplay || `+${contact.whatsapp}`} (${waLink(contact.whatsapp)})` : null,
    contact.email ? `- Email: ${contact.email}` : null,
    contact.hours ? `- Jam operasional: ${oneLine(contact.hours)}` : null,
    '',
    '## Halaman utama',
    '',
    page('Paket Tour', '/paket-tour', 'semua paket tour beserta harga, durasi, dan jadwal keberangkatan'),
    page('Destinasi', '/destinasi', 'negara dan kota tujuan'),
    page('Booking', '/booking', 'formulir pemesanan yang diteruskan ke WhatsApp'),
    page('FAQ', '/faq', 'pertanyaan umum seputar booking, pembayaran, visa, dan pembatalan'),
    page('Testimoni', '/testimoni', 'ulasan pelanggan'),
    page('Tentang Kami', '/tentang-kami', 'profil perusahaan, legalitas, dan tim'),
    page('Kontak', '/kontak', 'alamat, telepon, email, dan peta lokasi'),
    '',
    '## Paket tour',
    '',
    ...(pkgs.length
      ? pkgs.map((p) => {
          const price = `mulai Rp ${formatRupiah(p.promoPrice ?? p.price)}/pax`;
          const facts = [`${p.durationDays} hari`, p.countriesLabel, price].filter(Boolean).join(', ');
          return `- [${singleLine(p.name)}](${absoluteUrl(`/paket-tour/${p.slug}`)}): ${facts}.${p.summary ? ` ${singleLine(p.summary)}` : ''}`;
        })
      : ['- Belum ada paket yang dipublikasikan.']),
    '',
    '## Destinasi',
    '',
    ...dests.map((d) => `- [${d.name}](${absoluteUrl(`/destinasi/${d.slug}`)}): ${REGION_LABELS[d.region]}, ${d.packageCount} paket`),
    '',
    '## Lainnya',
    '',
    `- [Sitemap](${absoluteUrl('/sitemap.xml')})`,
    '',
  ];

  // null = contact field not filled in admin.
  return new Response(lines.filter((line) => line !== null).join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

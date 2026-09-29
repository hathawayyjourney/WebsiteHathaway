// Seeds sample content (converted from the original mock data) and the first admin.
// Usage: npm run db:seed            → only fills empty tables
//        npm run db:seed -- --reset → wipes content tables first (never users)
//        npm run db:seed -- --admin-only → only the admin account + default settings (production)
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/mysql2';
import { eq, sql } from 'drizzle-orm';
import mysql from 'mysql2/promise';
import * as s from './schema';
import { SETTINGS_DEFAULTS } from '../lib/settings-defaults';

const img = (id: string, w = 800) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

const CATEGORIES = ['Open Trip', 'Private Trip', 'Group Tour', 'Corporate', 'Honeymoon'];

const DESTINATIONS: (typeof s.destinations.$inferInsert)[] = [
  { name: 'Malaysia', slug: 'malaysia', region: 'ASIA', country: 'Malaysia', image: img('photo-1508964942454-1a56651d54ac'), bestTime: 'Maret – Oktober', featured: true, sort: 1 },
  { name: 'Singapore', slug: 'singapore', region: 'ASIA', country: 'Singapore', image: img('photo-1525625293386-3f8f99389edd'), bestTime: 'Februari – April', featured: true, sort: 2 },
  { name: 'Thailand', slug: 'thailand', region: 'ASIA', country: 'Thailand', image: img('photo-1552465011-b4e21bf6e79a'), bestTime: 'November – Februari', featured: true, sort: 3 },
  { name: 'Jepang', slug: 'jepang', region: 'ASIA', country: 'Jepang', image: img('photo-1480796927426-f609979314bd'), bestTime: 'Maret – Mei & Oktober – November', featured: true, sort: 4 },
  { name: 'Bali', slug: 'bali', region: 'INDONESIA', country: 'Indonesia', image: img('photo-1555400038-63f5ba517a47'), bestTime: 'April – Oktober', featured: true, sort: 5 },
  { name: 'Turki', slug: 'turki', region: 'EROPA', country: 'Turki', image: img('photo-1541417904950-b855846fe074'), bestTime: 'April – Juni & September – November', sort: 6 },
  { name: 'Prancis', slug: 'prancis', region: 'EROPA', country: 'Prancis', image: img('photo-1499856871958-5b9627545d1a'), bestTime: 'April – Juni', sort: 7 },
  { name: 'Dubai', slug: 'dubai', region: 'TIMUR_TENGAH', country: 'Uni Emirat Arab', image: img('photo-1512453979798-5ea266f8880c'), bestTime: 'November – Maret', sort: 8 },
];

type SeedPackage = typeof s.packages.$inferInsert & { destinations: string[]; category: string; departures: string[] };

const DEFAULT_TERMS: s.TermSection[] = [
  { title: 'Pembayaran', content: 'Deposit dibayarkan saat konfirmasi pemesanan, pelunasan paling lambat 30 hari sebelum keberangkatan.' },
  { title: 'Pembatalan & Refund', content: 'Pembatalan dikenakan biaya sesuai kebijakan maskapai dan hotel. Deposit tidak dapat dikembalikan.' },
  { title: 'Paspor', content: 'Paspor berlaku minimal 6 bulan dari tanggal keberangkatan.' },
];

const PACKAGES: SeedPackage[] = [
  {
    code: 'HJ-MST-5D', name: 'Malaysia Singapore\nThailand (Hatyai)', slug: 'malaysia-singapore-thailand-hatyai',
    durationDays: 5, countriesLabel: '3 Negara', departureLabel: 'Setiap Rabu', price: 6990000, rating: 4.8,
    thumbnail: img('photo-1508964942454-1a56651d54ac', 600), badge: 'HOT DEAL', featured: true, sort: 1,
    destinations: ['malaysia', 'singapore', 'thailand'], category: 'Open Trip', departures: ['2026-10-14', '2026-10-28', '2026-11-11'],
  },
  {
    code: 'HJ-MST-6D', name: 'Malaysia Singapore\nThailand (Bangkok Pattaya)', slug: 'malaysia-singapore-thailand-bangkok-pattaya',
    durationDays: 6, countriesLabel: '3 Negara', departureLabel: 'Setiap Rabu', price: 8990000, rating: 4.9,
    thumbnail: img('photo-1552465011-b4e21bf6e79a', 600), badge: 'BEST SELLER', featured: true, sort: 2,
    destinations: ['malaysia', 'singapore', 'thailand'], category: 'Open Trip', departures: ['2026-10-21', '2026-11-18'],
  },
  {
    code: 'HJ-MS-4D', name: 'Malaysia Singapore\n', slug: 'malaysia-singapore-4d',
    durationDays: 4, countriesLabel: '2 Negara', departureLabel: 'Setiap Rabu', price: 5990000, rating: 4.7,
    thumbnail: img('photo-1565967511849-76a60a516170', 600), badge: 'POPULAR', featured: true, sort: 3,
    destinations: ['malaysia', 'singapore'], category: 'Open Trip', departures: ['2026-10-07', '2026-10-21'],
  },
  {
    code: 'HJ-MS-5D', name: 'Malaysia Singapore\n', slug: 'malaysia-singapore-5d',
    durationDays: 5, countriesLabel: '2 Negara', departureLabel: 'Setiap Rabu', price: 7990000, rating: 4.8,
    thumbnail: img('photo-1525625293386-3f8f99389edd', 600), badge: 'FAVORITE', featured: true, sort: 4,
    destinations: ['malaysia', 'singapore'], category: 'Private Trip', departures: ['2026-11-04'],
  },
  {
    code: 'HJ-JPN-7D', name: 'Japan Autumn\nTokyo Kyoto Osaka', slug: 'japan-autumn-tokyo-kyoto-osaka',
    durationDays: 7, countriesLabel: '1 Negara', departureLabel: 'November 2026', price: 24990000, promoPrice: 22990000, rating: 4.9,
    thumbnail: img('photo-1480796927426-f609979314bd', 600), badge: 'PROMO', sort: 5,
    destinations: ['jepang'], category: 'Group Tour', departures: ['2026-11-12', '2026-11-19'],
  },
  {
    code: 'HJ-TUR-9D', name: 'Turki Cappadocia\nIstanbul', slug: 'turki-cappadocia-istanbul',
    durationDays: 9, countriesLabel: '1 Negara', departureLabel: 'Desember 2026', price: 19990000, rating: 4.8,
    thumbnail: img('photo-1541417904950-b855846fe074', 600), sort: 6,
    destinations: ['turki'], category: 'Group Tour', departures: ['2026-12-05'],
  },
  {
    code: 'HJ-BAL-4D', name: 'Bali Honeymoon\nUbud & Nusa Dua', slug: 'bali-honeymoon-ubud-nusa-dua',
    durationDays: 4, countriesLabel: 'Domestik', departureLabel: 'Setiap Hari', price: 4590000, rating: 4.7,
    thumbnail: img('photo-1555400038-63f5ba517a47', 600), sort: 7,
    destinations: ['bali'], category: 'Honeymoon', departures: ['2026-10-10', '2026-10-24'],
  },
  {
    code: 'HJ-DXB-6D', name: 'Dubai Abu Dhabi\nCity Tour', slug: 'dubai-abu-dhabi-city-tour',
    durationDays: 6, countriesLabel: '1 Negara', departureLabel: 'Januari 2027', price: 14990000, rating: 4.6,
    thumbnail: img('photo-1512453979798-5ea266f8880c', 600), sort: 8,
    destinations: ['dubai'], category: 'Corporate', departures: ['2027-01-15'],
  },
];

function sampleItinerary(days: number, place: string): Omit<typeof s.itineraryDays.$inferInsert, 'packageId'>[] {
  return Array.from({ length: days }, (_, i) => {
    const dayNo = i + 1;
    if (dayNo === 1)
      return { dayNo, title: `Jakarta – ${place}`, items: [{ time: '06.00', activity: 'Berkumpul di bandara Soekarno-Hatta', location: 'CGK' }, { activity: `Penerbangan menuju ${place}, check-in hotel`, meal: 'Makan malam' }] };
    if (dayNo === days)
      return { dayNo, title: `${place} – Jakarta`, items: [{ activity: 'Sarapan dan check-out hotel', meal: 'Sarapan' }, { activity: 'Transfer ke bandara dan kembali ke Jakarta' }] };
    return { dayNo, title: `City Tour ${place} (Hari ${dayNo})`, items: [{ time: '08.00', activity: 'Sarapan di hotel', meal: 'Sarapan' }, { activity: 'Mengunjungi destinasi ikonik bersama tour leader' }, { activity: 'Waktu bebas & belanja', meal: 'Makan siang, makan malam' }] };
  });
}

const GALLERY: (typeof s.gallery.$inferInsert)[] = [
  { kind: 'FOTO', category: 'Foto Grup', imageUrl: img('photo-1528605248644-14dd04022da1'), sort: 1 },
  { kind: 'FOTO', category: 'Foto Destinasi', imageUrl: img('photo-1499856871958-5b9627545d1a'), sort: 2 },
  { kind: 'FOTO', category: 'Foto Hotel', imageUrl: img('photo-1566073771259-6a8506099945'), sort: 3 },
  { kind: 'FOTO', category: 'Foto Aktivitas', imageUrl: img('photo-1533654793924-4fc4949ea7bf'), sort: 4 },
  { kind: 'FOTO', category: 'Foto Grup', imageUrl: img('photo-1517400508447-f8dd518b86db'), sort: 5 },
  { kind: 'FOTO', category: 'Foto Destinasi', imageUrl: img('photo-1476514525535-07fb3b4ae5f1'), sort: 6 },
  { kind: 'VIDEO_TOUR', title: 'Japan Autumn Tour 2023', imageUrl: img('photo-1480796927426-f609979314bd'), videoUrl: '', sort: 1 },
  { kind: 'VIDEO_TESTIMONI', title: 'Testimoni Keluarga Bpk. Andi', imageUrl: img('photo-1511895426328-dc8714191300'), videoUrl: '', sort: 1 },
];

const TESTIMONIALS: (typeof s.testimonials.$inferInsert)[] = [
  { name: 'Keluarga Bpk. Andi', packageLabel: 'Malaysia Singapore Thailand', rating: 5, review: 'Perjalanan sangat menyenangkan, tour leader ramah dan itinerary tertata rapi. (Contoh testimoni — ganti dari admin)', status: 'PUBLISHED', featured: true, date: '2026-08-20' },
  { name: 'Ibu Sari', packageLabel: 'Japan Autumn', rating: 5, review: 'Hotel nyaman, jadwal tidak terburu-buru. Pasti ikut lagi! (Contoh testimoni — ganti dari admin)', status: 'PUBLISHED', featured: true, date: '2026-07-02' },
];

const FAQS: (typeof s.faqs.$inferInsert)[] = [
  { group: 'Booking', question: 'Bagaimana cara booking paket?', answer: 'Pilih paket dan tanggal keberangkatan, lalu klik "Booking Sekarang". Anda akan terhubung ke WhatsApp admin kami dengan pesan otomatis.', sort: 1 },
  { group: 'Payment', question: 'Berapa deposit yang harus dibayar?', answer: 'Besaran deposit tertera pada halaman detail paket dan akan dikonfirmasi oleh admin via WhatsApp.', sort: 2 },
  { group: 'Visa', question: 'Apakah visa sudah termasuk?', answer: 'Tergantung paket. Silakan cek bagian Include/Exclude pada detail paket.', sort: 3 },
];

const LEGAL = ['ASITA Member', 'IATA Certified', 'Kemenpar Registered'];

async function main() {
  const reset = process.argv.includes('--reset');
  const adminOnly = process.argv.includes('--admin-only');
  const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL! });
  const db = drizzle(conn, { schema: s, mode: 'default' });

  if (reset) {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const t of ['package_destinations', 'package_images', 'itinerary_days', 'schedules', 'packages', 'destinations', 'categories', 'gallery', 'testimonials', 'faqs', 'legal_documents', 'teams', 'partners', 'settings']) {
      await conn.query(`TRUNCATE TABLE \`${t}\``);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Content tables truncated.');
  }

  // Admin account
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    const existing = await db.select({ id: s.users.id }).from(s.users).where(eq(s.users.email, email));
    if (existing.length === 0) {
      await db.insert(s.users).values({ name: 'Super Admin', email, passwordHash: await bcrypt.hash(password, 12), role: 'SUPER_ADMIN' });
      console.log(`Created SUPER_ADMIN ${email}`);
    }
  } else {
    console.warn('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping admin user.');
  }

  // Settings (insert missing keys only)
  for (const [key, value] of Object.entries(SETTINGS_DEFAULTS)) {
    await db.insert(s.settings).values({ key, value }).onDuplicateKeyUpdate({ set: { key: sql`\`key\`` } });
  }

  if (adminOnly) {
    console.log('Admin account & default settings ready (--admin-only: no sample content).');
    await conn.end();
    return;
  }

  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(s.packages);
  if (Number(count) > 0) {
    console.log('Packages already exist — skipping content seed (use --reset to reseed).');
    await conn.end();
    return;
  }

  await db.insert(s.categories).values(CATEGORIES.map((name, i) => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-'), sort: i + 1 })));
  const cats = new Map((await db.select().from(s.categories)).map((c) => [c.name, c.id]));

  await db.insert(s.destinations).values(
    DESTINATIONS.map((d) => ({ ...d, description: `${d.name} adalah salah satu destinasi favorit pelanggan Hathaway Journey.` })),
  );
  const dests = new Map((await db.select().from(s.destinations)).map((d) => [d.slug, d]));

  for (const { destinations: destSlugs, category, departures, ...pkg } of PACKAGES) {
    const [res] = await db.insert(s.packages).values({
      ...pkg,
      categoryId: cats.get(category),
      status: 'PUBLISHED',
      summary: `Paket ${pkg.durationDays} hari bersama tour leader berpengalaman.`,
      description: 'Nikmati perjalanan nyaman dengan itinerary yang tertata, hotel pilihan, dan pendampingan tour leader profesional dari Hathaway Journey.',
      childPrice: Math.round((pkg.promoPrice ?? pkg.price) * 0.9),
      singleSupplement: 1500000,
      deposit: 2000000,
      includes: ['Tiket pesawat PP', 'Hotel sesuai program', 'Makan sesuai program', 'Tour leader', 'Tiket masuk objek wisata', 'Transportasi AC'],
      excludes: ['Pengeluaran pribadi', 'Tipping guide & driver', 'Visa (jika diperlukan)', 'Optional tour'],
      hotels: [{ name: 'Hotel setaraf bintang 4', star: 4, location: 'Pusat kota', roomType: 'Twin / Double' }],
      transports: [{ type: 'Pesawat', detail: 'Full service airline' }, { type: 'Bus', detail: 'Bus pariwisata AC' }],
      terms: DEFAULT_TERMS,
    });
    const packageId = res.insertId;
    const firstDest = dests.get(destSlugs[0])!;
    await db.insert(s.packageDestinations).values(destSlugs.map((slug) => ({ packageId, destinationId: dests.get(slug)!.id })));
    await db.insert(s.itineraryDays).values(sampleItinerary(pkg.durationDays, firstDest.name).map((d) => ({ ...d, packageId })));
    await db.insert(s.packageImages).values([{ packageId, url: pkg.thumbnail.replace('w=600', 'w=1200'), sort: 0 }, { packageId, url: firstDest.image!, sort: 1 }]);
    await db.insert(s.schedules).values(
      departures.map((departureDate, i) => ({
        packageId,
        departureDate,
        quota: 20,
        seatsLeft: i === 0 ? 4 : 12,
        status: (i === 0 ? 'LIMITED' : 'OPEN') as s.ScheduleStatus,
      })),
    );
  }

  await db.insert(s.gallery).values(GALLERY);
  await db.insert(s.testimonials).values(TESTIMONIALS);
  await db.insert(s.faqs).values(FAQS);
  await db.insert(s.legalDocuments).values(LEGAL.map((name, i) => ({ name, sort: i + 1 })));

  console.log(`Seeded ${PACKAGES.length} packages, ${DESTINATIONS.length} destinations.`);
  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

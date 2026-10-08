// Single source of truth for the site's static image assets (generated with Gemini).
// Used by the website (src/lib/images.ts) and by `npm run images` (scripts/optimize-images.ts).
// Raw files go in assets-raw/<ID>.(png|jpg|jpeg|webp); see docs/image-assets.md for prompts.

export type AssetKind = 'photo' | 'cutout' | 'og';

export type ImageAsset = {
  /** Raw file name in assets-raw/ (without extension). */
  id: string;
  /** Output path under public/ (or app/ for kind "og"). */
  file: string;
  width: number;
  height: number;
  alt: string;
  kind: AssetKind;
  /** Shown until the generated file exists (keeps today's look). */
  fallback?: string;
  /** CSS object-position: keeps faces/subjects in frame when a wide hero band crops the photo. */
  position?: string;
};

export type SiteImage = { src: string; alt: string; position?: string };

const unsplash = (photo: string, w = 2074) => `https://images.unsplash.com/${photo}?q=80&w=${w}&auto=format&fit=crop`;

const hero = (id: string, slug: string, alt: string, opts: { fallback?: string; position?: string } = {}): ImageAsset => ({
  id,
  file: `images/heroes/${slug}.webp`,
  width: 2400,
  height: 1000,
  alt,
  kind: 'photo',
  ...opts,
});

export const IMAGE_ASSETS = {
  // A. Page heroes
  // Home hero: Southeast Asia landmark collage from the client (replaced H1).
  homeHero: {
    id: 'H12',
    file: 'images/home/hero-asia.webp',
    width: 2560,
    height: 1252,
    alt: 'Kolase landmark Malaysia, Singapura, dan Thailand dengan pesawat',
    kind: 'photo',
    fallback: unsplash('photo-1436491865332-7a61a109cc05'),
  },
  // Shared by Paket Tour, Destinasi (incl. region pages), Gallery and Tentang Kami (client request; replaced H2–H5, then H11).
  heroAsiaCollage: {
    id: 'H13',
    file: 'images/heroes/asia-landmarks.webp',
    width: 2400,
    height: 1018,
    alt: 'Kolase landmark Thailand, Singapura, dan Malaysia dengan pesawat di langit senja',
    kind: 'photo',
  },
  heroTestimoni: hero('H6', 'testimoni', 'Keluarga bahagia berlibur di pantai', { position: 'center 30%' }),
  heroFaq: hero('H7', 'faq', 'Paspor, boarding pass, dan peta perjalanan'),
  heroKontak: hero('H8', 'kontak', 'Konsultan travel melayani pelanggan', { position: 'center 30%' }),
  heroBooking: hero('H9', 'booking', 'Paspor dan boarding pass di bandara', { position: 'center 40%' }),
  heroLegal: hero('H10', 'legal', 'Dokumen perjalanan di meja'),

  // B. Home body
  // "Siap berpetualang" CTA (Home, Tentang Kami, destination & region pages). Replaced B1 at the client's request.
  homeCta: {
    id: 'B6',
    file: 'images/home/cta-asia.webp',
    width: 2400,
    height: 668,
    alt: 'Panorama landmark Singapura, Malaysia, dan Thailand saat matahari terbenam',
    kind: 'photo',
  },
  homeStatsBg: { id: 'B2', file: 'images/home/stats-bg.webp', width: 1600, height: 700, alt: '', kind: 'photo' },
  regionIndonesia: { id: 'B3-indonesia', file: 'images/regions/indonesia.webp', width: 800, height: 1000, alt: 'Indonesia', kind: 'photo' },
  regionAsia: { id: 'B3-asia', file: 'images/regions/asia.webp', width: 800, height: 1000, alt: 'Asia', kind: 'photo' },
  regionEropa: { id: 'B3-eropa', file: 'images/regions/eropa.webp', width: 800, height: 1000, alt: 'Eropa', kind: 'photo' },
  regionTimurTengah: { id: 'B3-timur-tengah', file: 'images/regions/timur-tengah.webp', width: 800, height: 1000, alt: 'Timur Tengah', kind: 'photo' },
  regionLainnya: { id: 'B3-lainnya', file: 'images/regions/lainnya.webp', width: 800, height: 1000, alt: 'Destinasi lainnya', kind: 'photo' },
  decorAirplane: { id: 'B4-airplane', file: 'images/decor/airplane.webp', width: 800, height: 800, alt: '', kind: 'cutout' },
  decorSuitcase: { id: 'B4-suitcase', file: 'images/decor/suitcase.webp', width: 800, height: 800, alt: '', kind: 'cutout' },
  decorPassport: { id: 'B4-passport', file: 'images/decor/passport.webp', width: 800, height: 800, alt: '', kind: 'cutout' },
  decorWorldMap: { id: 'B5', file: 'images/decor/world-map.webp', width: 2400, height: 1000, alt: '', kind: 'photo' },

  // C. Informative content
  aboutCompany: { id: 'C1', file: 'images/content/about-company.webp', width: 1200, height: 900, alt: 'Tim Hathaway Journey', kind: 'photo' },
  aboutVision: { id: 'C2-vision', file: 'images/content/about-vision.webp', width: 800, height: 600, alt: '', kind: 'photo' },
  aboutMission: { id: 'C2-mission', file: 'images/content/about-mission.webp', width: 800, height: 600, alt: '', kind: 'photo' },
  bookingHelp: { id: 'C3', file: 'images/content/booking-help.webp', width: 900, height: 675, alt: 'Pelanggan melakukan booking melalui WhatsApp', kind: 'photo' },
  contactOffice: { id: 'C4', file: 'images/content/contact-office.webp', width: 1200, height: 675, alt: 'Kantor Hathaway Journey', kind: 'photo' },
  faqHelp: { id: 'C5', file: 'images/content/faq-help.webp', width: 900, height: 675, alt: 'Customer service Hathaway Journey', kind: 'photo' },
  notFound: { id: 'C6', file: 'images/content/not-found.webp', width: 1000, height: 750, alt: 'Traveler mencari arah dengan peta', kind: 'photo' },
  emptySearch: { id: 'C7', file: 'images/content/empty-search.webp', width: 600, height: 600, alt: 'Koper kosong dan peta', kind: 'photo' },

  // D. SEO & admin
  ogImage: { id: 'D1', file: 'app/opengraph-image.jpg', width: 1200, height: 630, alt: 'Hathaway Journey — Explore More, Create Memories', kind: 'og' },
  adminLoginBg: { id: 'D2', file: 'images/admin/login-bg.webp', width: 1920, height: 1080, alt: '', kind: 'photo' },
} satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof IMAGE_ASSETS;

/** Region code (settings.home_regions[].region) → asset key. */
export const REGION_IMAGE_KEYS: Record<string, ImageKey> = {
  INDONESIA: 'regionIndonesia',
  ASIA: 'regionAsia',
  EROPA: 'regionEropa',
  TIMUR_TENGAH: 'regionTimurTengah',
  LAINNYA: 'regionLainnya',
};

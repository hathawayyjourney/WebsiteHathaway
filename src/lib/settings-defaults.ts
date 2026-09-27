import type { Region } from '@/src/db/enums';

export type ContactSettings = {
  whatsapp: string; // international digits, e.g. 628123456789
  phoneDisplay: string;
  email: string;
  address: string; // multiline
  hours: string; // multiline
  mapsEmbedUrl: string;
};
export type SocialSettings = { instagram: string; facebook: string; youtube: string; tiktok: string };
export type HomeStat = { value: string; label: string };
export type HomeBenefit = { title: string; desc: string };
export type HomeRegion = { region: Region; label: string; image: string };
export type CompanySettings = {
  about: string;
  history: string;
  image: string;
  vision: string;
  missions: string[];
  values: { title: string; desc: string }[];
};
// Placeholders: {paket} {tanggal} {peserta} {link}
export type WaTemplates = { booking: string; inquiry: string; general: string };
export type LegalPages = { privacy: string; terms: string };

export type SettingsMap = {
  contact: ContactSettings;
  social: SocialSettings;
  home_stats: HomeStat[];
  home_benefits: HomeBenefit[];
  home_regions: HomeRegion[];
  company: CompanySettings;
  wa_templates: WaTemplates;
  legal_pages: LegalPages;
};
export type SettingKey = keyof SettingsMap;

export const SETTINGS_DEFAULTS: SettingsMap = {
  contact: {
    whatsapp: '628000000000',
    phoneDisplay: '+62 800 0000 000',
    email: 'hello@hathawayjourney.com',
    address: 'Jl. Travel Agent No. 123,\nJakarta Selatan, 12345,\nDKI Jakarta, Indonesia',
    hours: 'Senin - Jumat: 09.00 - 17.00\nSabtu: 09.00 - 14.00\nMinggu: Libur',
    mapsEmbedUrl: '',
  },
  social: { instagram: '', facebook: '', youtube: '', tiktok: '' },
  home_stats: [
    { value: '10.000+', label: 'Happy Customer' },
    { value: '500+', label: 'Paket Tour' },
    { value: '50+', label: 'Destinasi' },
    { value: '5+', label: 'Tahun Pengalaman' },
  ],
  home_benefits: [
    { title: 'Travel Terpercaya', desc: 'Legal & Berizin Resmi' },
    { title: 'Harga Terbaik', desc: 'Harga Kompetitif' },
    { title: 'Customer Service 24/7', desc: 'Siap Membantu Anda' },
    { title: 'Paket Lengkap', desc: 'Fasilitas Terbaik' },
    { title: 'Berpengalaman & Profesional', desc: 'Tim Berpengalaman' },
    { title: 'Pembayaran Mudah', desc: 'Aman & Terpercaya' },
  ],
  home_regions: [
    { region: 'INDONESIA', label: 'INDONESIA', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=600&auto=format&fit=crop' },
    { region: 'ASIA', label: 'ASIA', image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=600&auto=format&fit=crop' },
    { region: 'EROPA', label: 'EROPA', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop' },
    { region: 'TIMUR_TENGAH', label: 'TIMUR TENGAH', image: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?q=80&w=600&auto=format&fit=crop' },
    { region: 'LAINNYA', label: 'DESTINASI LAINNYA', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=600&auto=format&fit=crop' },
  ],
  company: {
    about:
      'Hathaway Journey adalah perusahaan travel management terkemuka yang berdedikasi untuk memberikan pengalaman perjalanan tak terlupakan. Didirikan dengan passion terhadap dunia pariwisata, kami mengerti bahwa setiap perjalanan adalah sebuah cerita.',
    history:
      'Dimulai pada tahun 2018, kami berawal dari penyedia private tour kecil. Berkat kepercayaan pelanggan yang terus bertumbuh, Hathaway Journey kini telah menangani ribuan traveler setiap tahunnya, baik untuk kebutuhan personal, grup, maupun korporasi, menjangkau lebih dari 50+ destinasi global.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    vision:
      'Menjadi partner perjalanan terdepan di Indonesia yang memberikan pelayanan kelas dunia dan menciptakan kenangan abadi bagi setiap pelanggan.',
    missions: [
      'Menyediakan paket tour berkualitas.',
      'Memberikan customer service 24/7.',
      'Membangun ekosistem pariwisata yang berkelanjutan.',
    ],
    values: [
      { title: 'Trust', desc: 'Kepercayaan adalah kunci.' },
      { title: 'Excellence', desc: 'Layanan prima.' },
      { title: 'Care', desc: 'Peduli pada detail perjalanan.' },
    ],
  },
  wa_templates: {
    booking:
      'Halo Admin Hathaway Journey,\nSaya ingin booking paket:\n{paket}\n\nTanggal keberangkatan: {tanggal}\nJumlah peserta: {peserta}\n\nLink paket: {link}',
    inquiry: 'Halo,\nSaya tertarik dengan paket:\n{paket}\n\nTanggal: {tanggal}\n\nMohon informasi lebih lanjut.',
    general: 'Halo Admin Hathaway Journey, saya ingin konsultasi perjalanan.',
  },
  legal_pages: {
    privacy:
      'Hathaway Journey menghargai privasi Anda. Data yang Anda kirimkan melalui formulir kontak (nama, nomor WhatsApp, email, dan pesan) hanya digunakan untuk menindaklanjuti pertanyaan Anda dan tidak dibagikan kepada pihak ketiga tanpa persetujuan Anda.\n\nWebsite ini dapat menggunakan cookie analitik (Google Analytics) untuk memahami penggunaan website dan meningkatkan layanan kami.\n\nUntuk pertanyaan terkait privasi, silakan hubungi kami melalui halaman Kontak.',
    terms:
      'Informasi paket, harga, dan jadwal pada website ini dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Harga final dan ketersediaan kursi dikonfirmasi oleh tim kami melalui WhatsApp.\n\nPemesanan dianggap sah setelah pembayaran deposit diterima dan dikonfirmasi oleh Hathaway Journey. Ketentuan pembatalan, refund, dan reschedule mengikuti syarat pada masing-masing paket.',
  },
};

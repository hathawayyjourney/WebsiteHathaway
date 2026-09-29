import Link from 'next/link';

// Fallback for URLs outside any route group (no site header/footer here).
export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-light flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-brand-red font-bold tracking-widest text-sm mb-4">404</p>
        <h1 className="text-3xl font-black text-brand-navy mb-8">HALAMAN TIDAK DITEMUKAN</h1>
        <Link href="/" className="bg-brand-navy text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-navy-sec transition">
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}

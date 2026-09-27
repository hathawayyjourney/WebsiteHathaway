import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen pt-20 bg-brand-light flex items-center justify-center px-4">
      <div className="text-center py-24">
        <p className="text-brand-red font-bold tracking-widest text-sm mb-4">404</p>
        <h1 className="text-3xl lg:text-4xl font-black text-brand-navy mb-4">HALAMAN TIDAK DITEMUKAN</h1>
        <p className="text-brand-muted mb-8 max-w-md mx-auto">Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.</p>
        <Link href="/paket-tour" className="inline-flex items-center gap-2 bg-brand-navy text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-navy-sec transition shadow-lg">
          Lihat Paket Tour
        </Link>
      </div>
    </main>
  );
}

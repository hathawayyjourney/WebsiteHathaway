'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen pt-20 bg-brand-light flex items-center justify-center px-4">
      <div className="text-center py-24">
        <h1 className="text-3xl font-black text-brand-navy mb-4">TERJADI KESALAHAN</h1>
        <p className="text-brand-muted mb-8 max-w-md mx-auto">Maaf, halaman gagal dimuat. Silakan coba lagi beberapa saat lagi.</p>
        <button onClick={reset} className="bg-brand-navy text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-navy-sec transition shadow-lg">
          Coba Lagi
        </button>
      </div>
    </main>
  );
}

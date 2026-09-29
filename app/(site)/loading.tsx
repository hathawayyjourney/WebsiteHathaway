export default function Loading() {
  return (
    <main className="min-h-screen pt-20 bg-brand-light flex items-center justify-center" aria-busy="true">
      <div className="w-10 h-10 rounded-full border-4 border-brand-softblue border-t-brand-navy animate-spin" role="status" aria-label="Memuat" />
    </main>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import { listDestinations, REGION_LABELS } from '@/src/server/queries/destinations';

export const metadata: Metadata = { title: 'Destinasi' };

export default async function AdminDestinationsPage() {
  const rows = await listDestinations();
  return (
    <div>
      <PageHeader title="Destinasi" description="Negara / kota tujuan. Gambar wilayah di Home diatur di Pengaturan → Home." addHref="/admin/destinasi/baru" addLabel="Tambah Destinasi" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {rows.map((d) => (
          <Link key={d.id} href={`/admin/destinasi/${d.id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition">
            {d.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={d.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
            )}
            <div>
              <p className="font-bold text-brand-navy">{d.name}</p>
              <p className="text-xs text-brand-muted">{REGION_LABELS[d.region]} · {d.packageCount} paket</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import PackageForm from '@/src/components/admin/PackageForm';
import { getCatalogOptions, uploadEnabled } from '@/src/server/queries/admin-options';

export const metadata: Metadata = { title: 'Tambah Paket' };

export default async function NewPackagePage() {
  const { categories, destinations } = await getCatalogOptions();
  return (
    <div className="max-w-5xl">
      <PageHeader title="Tambah Paket" description="Jadwal, itinerary, dan foto tambahan bisa diisi setelah paket dibuat." back={{ href: '/admin/paket', label: 'Daftar paket' }} />
      <PackageForm categories={categories} destinations={destinations} uploadEnabled={uploadEnabled()} />
    </div>
  );
}

import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import DestinationForm from '@/src/components/admin/DestinationForm';
import { uploadEnabled } from '@/src/server/queries/admin-options';

export const metadata: Metadata = { title: 'Tambah Destinasi' };

export default function NewDestinationPage() {
  return (
    <div className="max-w-4xl">
      <PageHeader title="Tambah Destinasi" back={{ href: '/admin/destinasi', label: 'Daftar destinasi' }} />
      <DestinationForm uploadEnabled={uploadEnabled()} />
    </div>
  );
}

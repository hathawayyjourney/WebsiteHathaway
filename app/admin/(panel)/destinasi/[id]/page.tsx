import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import DestinationForm from '@/src/components/admin/DestinationForm';
import DeleteButton from '@/src/components/admin/DeleteButton';
import { db } from '@/src/db';
import { destinations } from '@/src/db/schema';
import { deleteDestination } from '@/src/server/actions/admin/catalog';
import { uploadEnabled } from '@/src/server/queries/admin-options';

export const metadata: Metadata = { title: 'Edit Destinasi' };

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const [dest] = Number.isInteger(id) ? await db.select().from(destinations).where(eq(destinations.id, id)) : [];
  if (!dest) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title={dest.name} back={{ href: '/admin/destinasi', label: 'Daftar destinasi' }} />
      <DestinationForm dest={dest} uploadEnabled={uploadEnabled()} />
      <DeleteButton action={deleteDestination.bind(null, id)} label="Hapus destinasi" confirmText="Hapus destinasi ini? Paket tidak ikut terhapus, hanya relasinya." />
    </div>
  );
}

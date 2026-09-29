import { asc } from 'drizzle-orm';
import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import AdminForm from '@/src/components/admin/AdminForm';
import DeleteButton from '@/src/components/admin/DeleteButton';
import { Panel, TextField } from '@/src/components/admin/fields';
import { db } from '@/src/db';
import { categories } from '@/src/db/schema';
import { deleteCategory, saveCategory } from '@/src/server/actions/admin/catalog';

export const metadata: Metadata = { title: 'Kategori Trip' };

export default async function AdminCategoriesPage() {
  const rows = await db.select().from(categories).orderBy(asc(categories.sort));
  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Kategori / Jenis Trip" description="Dipakai di filter Jenis Trip dan pencarian Home." />
      <Panel title="Daftar Kategori">
        <div className="space-y-3">
          {rows.map((c) => (
            <div key={c.id} className="flex flex-wrap items-end gap-3 border-b border-gray-100 pb-3">
              <AdminForm action={saveCategory} className="flex flex-wrap items-end gap-3 flex-1" inline>
                <input type="hidden" name="id" value={c.id} />
                <TextField name="name" label="Nama" defaultValue={c.name} />
                <TextField name="slug" label="Slug" defaultValue={c.slug} />
                <TextField name="sort" label="Urutan" type="number" defaultValue={c.sort} className="w-24" />
              </AdminForm>
              <DeleteButton action={deleteCategory.bind(null, c.id)} confirmText={`Hapus kategori "${c.name}"? Paket di kategori ini menjadi tanpa kategori.`} />
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Tambah Kategori">
        <AdminForm action={saveCategory} submitLabel="Tambah" className="flex flex-wrap items-end gap-3" inline resetOnSuccess>
          <TextField name="name" label="Nama" placeholder="Umroh" />
          <TextField name="slug" label="Slug" hint="Opsional" />
          <TextField name="sort" label="Urutan" type="number" defaultValue={rows.length + 1} className="w-24" />
        </AdminForm>
      </Panel>
    </div>
  );
}

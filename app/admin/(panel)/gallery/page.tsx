import { asc, desc } from 'drizzle-orm';
import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import AdminForm from '@/src/components/admin/AdminForm';
import DeleteButton from '@/src/components/admin/DeleteButton';
import EditableItem from '@/src/components/admin/EditableItem';
import MediaField from '@/src/components/admin/MediaField';
import { Checkbox, SelectField, TextField } from '@/src/components/admin/fields';
import { db } from '@/src/db';
import { gallery, GALLERY_KINDS, PHOTO_CATEGORIES } from '@/src/db/schema';
import { deleteGalleryItem, saveGalleryItem } from '@/src/server/actions/admin/content';
import { uploadEnabled } from '@/src/server/queries/admin-options';

export const metadata: Metadata = { title: 'Gallery' };

const KIND_LABELS = { FOTO: 'Foto', VIDEO_TOUR: 'Video Tour', VIDEO_TESTIMONI: 'Video Testimoni' } as const;

type Item = typeof gallery.$inferSelect;

function GalleryFields({ item, canUpload }: { item?: Item; canUpload: boolean }) {
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectField name="kind" label="Jenis" defaultValue={item?.kind ?? 'FOTO'} options={GALLERY_KINDS.map((k) => ({ value: k, label: KIND_LABELS[k] }))} />
        <SelectField name="category" label="Kategori Foto" defaultValue={item?.category} emptyLabel="— (khusus foto) —" options={PHOTO_CATEGORIES.map((c) => ({ value: c, label: c }))} />
        <TextField name="title" label="Judul / Caption" defaultValue={item?.title} />
      </div>
      <MediaField name="imageUrl" label="Foto / Thumbnail video" defaultValue={item?.imageUrl} uploadEnabled={canUpload} />
      <MediaField name="videoUrl" label="Video (URL YouTube atau upload) — khusus video" kind="video" defaultValue={item?.videoUrl} uploadEnabled={canUpload} />
      <div className="flex flex-wrap items-end gap-6">
        <TextField name="sort" label="Urutan" type="number" defaultValue={item?.sort ?? 0} className="w-28" />
        <Checkbox name="published" label="Tampilkan di website" defaultChecked={item?.published ?? true} />
      </div>
    </>
  );
}

export default async function AdminGalleryPage() {
  const items = await db.select().from(gallery).orderBy(asc(gallery.kind), asc(gallery.sort), desc(gallery.id));
  const canUpload = uploadEnabled();

  return (
    <div className="max-w-4xl space-y-4">
      <PageHeader title="Gallery" description="Foto grup, destinasi, hotel, aktivitas, video tour, dan video testimoni." />
      <EditableItem title="+ Tambah item gallery" open={items.length === 0}>
        <AdminForm action={saveGalleryItem} submitLabel="Tambah" resetOnSuccess>
          <GalleryFields canUpload={canUpload} />
        </AdminForm>
      </EditableItem>
      {items.map((item) => (
        <EditableItem
          key={item.id}
          title={item.title || item.category || KIND_LABELS[item.kind]}
          subtitle={`${KIND_LABELS[item.kind]}${item.published ? '' : ' · disembunyikan'}`}
          thumb={item.imageUrl}
          actions={<DeleteButton action={deleteGalleryItem.bind(null, item.id)} />}
        >
          <AdminForm action={saveGalleryItem}>
            <GalleryFields item={item} canUpload={canUpload} />
          </AdminForm>
        </EditableItem>
      ))}
    </div>
  );
}

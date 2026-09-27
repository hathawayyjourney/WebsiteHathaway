import { asc, desc } from 'drizzle-orm';
import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import AdminForm from '@/src/components/admin/AdminForm';
import DeleteButton from '@/src/components/admin/DeleteButton';
import EditableItem from '@/src/components/admin/EditableItem';
import MediaField from '@/src/components/admin/MediaField';
import { Checkbox, SelectField, TextArea, TextField } from '@/src/components/admin/fields';
import { db } from '@/src/db';
import { packages, testimonials, TESTIMONIAL_STATUS } from '@/src/db/schema';
import { singleLine } from '@/src/lib/format';
import { deleteTestimonial, saveTestimonial } from '@/src/server/actions/admin/content';
import { uploadEnabled } from '@/src/server/queries/admin-options';

export const metadata: Metadata = { title: 'Testimoni' };

type Item = typeof testimonials.$inferSelect;

function Fields({ item, pkgs, canUpload }: { item?: Item; pkgs: { value: number; label: string }[]; canUpload: boolean }) {
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextField name="name" label="Nama" defaultValue={item?.name} />
        <SelectField name="rating" label="Rating" defaultValue={item?.rating ?? 5} options={[5, 4, 3, 2, 1].map((r) => ({ value: r, label: '★'.repeat(r) }))} />
        <SelectField name="status" label="Status" defaultValue={item?.status ?? 'PUBLISHED'} options={TESTIMONIAL_STATUS.map((s) => ({ value: s, label: s }))} />
        <SelectField name="packageId" label="Paket" defaultValue={item?.packageId} emptyLabel="— Tidak terkait —" options={pkgs} />
        <TextField name="packageLabel" label="Label paket (teks bebas)" defaultValue={item?.packageLabel} />
        <TextField name="date" label="Tanggal" type="date" defaultValue={item?.date} />
      </div>
      <TextArea name="review" label="Isi Testimoni" rows={4} defaultValue={item?.review} />
      <MediaField name="photo" label="Foto" defaultValue={item?.photo} uploadEnabled={canUpload} />
      <TextField name="videoUrl" label="Video testimoni (URL, opsional)" defaultValue={item?.videoUrl} />
      <Checkbox name="featured" label="Featured (diprioritaskan tampil)" defaultChecked={item?.featured} />
    </>
  );
}

export default async function AdminTestimonialsPage() {
  const [items, pkgRows] = await Promise.all([
    db.select().from(testimonials).orderBy(desc(testimonials.featured), desc(testimonials.id)),
    db.select({ id: packages.id, name: packages.name }).from(packages).orderBy(asc(packages.sort)),
  ]);
  const pkgs = pkgRows.map((p) => ({ value: p.id, label: singleLine(p.name) }));
  const canUpload = uploadEnabled();

  return (
    <div className="max-w-4xl space-y-4">
      <PageHeader title="Testimoni" description="Hanya status PUBLISHED yang tampil di halaman Testimoni." />
      <EditableItem title="+ Tambah testimoni" open={items.length === 0}>
        <AdminForm action={saveTestimonial} submitLabel="Tambah" resetOnSuccess>
          <Fields pkgs={pkgs} canUpload={canUpload} />
        </AdminForm>
      </EditableItem>
      {items.map((item) => (
        <EditableItem
          key={item.id}
          title={item.name}
          subtitle={item.review}
          thumb={item.photo}
          badge={<span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{item.featured ? '★ ' : ''}{item.status}</span>}
          actions={<DeleteButton action={deleteTestimonial.bind(null, item.id)} />}
        >
          <AdminForm action={saveTestimonial}>
            <Fields item={item} pkgs={pkgs} canUpload={canUpload} />
          </AdminForm>
        </EditableItem>
      ))}
    </div>
  );
}

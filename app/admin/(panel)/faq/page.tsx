import { asc } from 'drizzle-orm';
import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import AdminForm from '@/src/components/admin/AdminForm';
import DeleteButton from '@/src/components/admin/DeleteButton';
import EditableItem from '@/src/components/admin/EditableItem';
import { Checkbox, SelectField, TextArea, TextField } from '@/src/components/admin/fields';
import { db } from '@/src/db';
import { faqs, FAQ_GROUPS } from '@/src/db/schema';
import { deleteFaq, saveFaq } from '@/src/server/actions/admin/content';

export const metadata: Metadata = { title: 'FAQ' };

type Item = typeof faqs.$inferSelect;

function Fields({ item }: { item?: Item }) {
  return (
    <>
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SelectField name="group" label="Grup" defaultValue={item?.group ?? 'General'} options={FAQ_GROUPS.map((g) => ({ value: g, label: g }))} />
        <TextField name="question" label="Pertanyaan" defaultValue={item?.question} className="md:col-span-3" />
      </div>
      <TextArea name="answer" label="Jawaban" rows={3} defaultValue={item?.answer} />
      <div className="flex flex-wrap items-end gap-6">
        <TextField name="sort" label="Urutan" type="number" defaultValue={item?.sort ?? 0} className="w-28" />
        <Checkbox name="published" label="Publish" defaultChecked={item?.published ?? true} />
      </div>
    </>
  );
}

export default async function AdminFaqPage() {
  const items = await db.select().from(faqs).orderBy(asc(faqs.group), asc(faqs.sort));
  return (
    <div className="max-w-4xl space-y-4">
      <PageHeader title="FAQ" description="Urutan: angka kecil tampil lebih dulu dalam grupnya." />
      <EditableItem title="+ Tambah FAQ" open={items.length === 0}>
        <AdminForm action={saveFaq} submitLabel="Tambah" resetOnSuccess>
          <Fields />
        </AdminForm>
      </EditableItem>
      {items.map((item) => (
        <EditableItem
          key={item.id}
          title={item.question}
          subtitle={`${item.group} · urutan ${item.sort}${item.published ? '' : ' · tidak dipublish'}`}
          actions={<DeleteButton action={deleteFaq.bind(null, item.id)} />}
        >
          <AdminForm action={saveFaq}>
            <Fields item={item} />
          </AdminForm>
        </EditableItem>
      ))}
    </div>
  );
}

import AdminForm from './AdminForm';
import MediaField from './MediaField';
import { Checkbox, SelectField, TextArea, TextField } from './fields';
import { saveDestination } from '@/src/server/actions/admin/catalog';
import { REGIONS } from '@/src/db/enums';
import { REGION_LABELS } from '@/src/server/queries/destinations';

type Destination = {
  id: number;
  name: string;
  slug: string;
  region: string;
  country: string | null;
  image: string | null;
  description: string | null;
  information: string | null;
  bestTime: string | null;
  travelTips: string | null;
  featured: boolean;
  sort: number;
  seoTitle: string | null;
  metaDescription: string | null;
};

export default function DestinationForm({ dest, uploadEnabled }: { dest?: Destination; uploadEnabled: boolean }) {
  return (
    <AdminForm action={saveDestination} submitLabel={dest ? 'Simpan Perubahan' : 'Tambah Destinasi'} className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
      {dest && <input type="hidden" name="id" value={dest.id} />}
      <TextField name="name" label="Nama Destinasi" defaultValue={dest?.name} placeholder="Jepang" />
      <TextField name="slug" label="Slug URL" defaultValue={dest?.slug} hint="Kosongkan untuk otomatis." />
      <SelectField name="region" label="Wilayah" defaultValue={dest?.region} emptyLabel="— Pilih wilayah —" options={REGIONS.map((r) => ({ value: r, label: REGION_LABELS[r] }))} />
      <TextField name="country" label="Negara" defaultValue={dest?.country} />
      <div className="md:col-span-2">
        <MediaField name="image" label="Gambar Utama" defaultValue={dest?.image} uploadEnabled={uploadEnabled} />
      </div>
      <TextArea name="description" label="Deskripsi Singkat" rows={2} defaultValue={dest?.description} className="md:col-span-2" />
      <TextArea name="information" label="Informasi Lengkap" rows={5} defaultValue={dest?.information} className="md:col-span-2" />
      <TextField name="bestTime" label="Waktu Terbaik Berkunjung" defaultValue={dest?.bestTime} />
      <TextField name="sort" label="Urutan" type="number" defaultValue={dest?.sort ?? 0} />
      <TextArea name="travelTips" label="Travel Tips" rows={4} defaultValue={dest?.travelTips} className="md:col-span-2" />
      <TextField name="seoTitle" label="SEO Title" defaultValue={dest?.seoTitle} />
      <TextField name="metaDescription" label="Meta Description" defaultValue={dest?.metaDescription} />
      <div className="md:col-span-2">
        <Checkbox name="featured" label="Destinasi unggulan" defaultChecked={dest?.featured} />
      </div>
    </AdminForm>
  );
}

import AdminForm from './AdminForm';
import MediaField from './MediaField';
import { Checkbox, Panel, SelectField, TextArea, TextField } from './fields';
import { savePackage } from '@/src/server/actions/admin/packages';
import { PACKAGE_BADGES, type HotelInfo, type TermSection, type TransportInfo } from '@/src/db/enums';

type PackageValues = {
  id: number;
  name: string;
  slug: string;
  code: string | null;
  categoryId: number | null;
  durationDays: number;
  countriesLabel: string | null;
  departureLabel: string | null;
  summary: string | null;
  description: string | null;
  price: number;
  promoPrice: number | null;
  childPrice: number | null;
  singleSupplement: number | null;
  deposit: number | null;
  thumbnail: string;
  videoUrl: string | null;
  rating: number | null;
  badge: string | null;
  featured: boolean;
  status: string;
  sort: number;
  includes: string[] | null;
  excludes: string[] | null;
  hotels: HotelInfo[] | null;
  transports: TransportInfo[] | null;
  terms: TermSection[] | null;
  seoTitle: string | null;
  metaDescription: string | null;
};

export default function PackageForm({
  pkg,
  categories,
  destinations,
  selectedDestinations = [],
  uploadEnabled,
}: {
  pkg?: PackageValues;
  categories: { id: number; name: string }[];
  destinations: { id: number; name: string }[];
  selectedDestinations?: number[];
  uploadEnabled: boolean;
}) {
  return (
    <AdminForm action={savePackage} submitLabel={pkg ? 'Simpan Perubahan' : 'Buat Paket'} className="space-y-6">
      {pkg && <input type="hidden" name="id" value={pkg.id} />}

      <Panel title="Informasi Utama">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextArea name="name" label="Nama Paket" rows={2} defaultValue={pkg?.name} hint="Enter = pindah baris pada kartu paket." className="md:col-span-2" />
          <TextField name="slug" label="Slug URL" defaultValue={pkg?.slug} hint="Kosongkan untuk dibuat otomatis dari nama." />
          <TextField name="code" label="Kode Paket" defaultValue={pkg?.code} placeholder="HJ-JPN-7D" />
          <SelectField name="categoryId" label="Kategori / Jenis Trip" emptyLabel="— Pilih —" defaultValue={pkg?.categoryId} options={categories.map((c) => ({ value: c.id, label: c.name }))} />
          <TextField name="durationDays" label="Durasi (hari)" type="number" defaultValue={pkg?.durationDays} />
          <TextField name="countriesLabel" label="Label Negara" defaultValue={pkg?.countriesLabel} placeholder="3 Negara" />
          <TextField name="departureLabel" label="Label Keberangkatan" defaultValue={pkg?.departureLabel} placeholder="Setiap Rabu" hint="Kosongkan untuk memakai tanggal jadwal terdekat." />
          <SelectField name="status" label="Status" defaultValue={pkg?.status ?? 'DRAFT'} options={[{ value: 'DRAFT', label: 'Draft (tidak tampil)' }, { value: 'PUBLISHED', label: 'Published (tampil)' }]} />
          <SelectField name="badge" label="Badge" emptyLabel="— Tanpa badge —" defaultValue={pkg?.badge} options={PACKAGE_BADGES.map((b) => ({ value: b, label: b }))} />
          <TextField name="rating" label="Rating (0-5)" defaultValue={pkg?.rating} placeholder="4.8" />
          <TextField name="sort" label="Urutan" type="number" defaultValue={pkg?.sort ?? 0} hint="Angka kecil tampil lebih dulu." />
          <div className="md:col-span-2">
            <Checkbox name="featured" label="Tampilkan di Paket Rekomendasi (Home)" defaultChecked={pkg?.featured} />
          </div>
        </div>
        <div className="mt-5">
          <p className="block text-sm font-semibold text-gray-700 mb-2">Destinasi</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {destinations.map((d) => (
              <label key={d.id} className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="destinationIds" value={d.id} defaultChecked={selectedDestinations.includes(d.id)} className="w-4 h-4 accent-brand-navy" />
                {d.name}
              </label>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="Harga (Rupiah)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TextField name="price" label="Harga Normal / pax" type="number" defaultValue={pkg?.price} />
          <TextField name="promoPrice" label="Harga Promo" type="number" defaultValue={pkg?.promoPrice} hint="Kosongkan jika tidak promo." />
          <TextField name="childPrice" label="Harga Anak" type="number" defaultValue={pkg?.childPrice} />
          <TextField name="singleSupplement" label="Single Supplement" type="number" defaultValue={pkg?.singleSupplement} />
          <TextField name="deposit" label="Deposit" type="number" defaultValue={pkg?.deposit} />
        </div>
      </Panel>

      <Panel title="Konten & Media">
        <div className="space-y-5">
          <MediaField name="thumbnail" label="Thumbnail (gambar kartu)" defaultValue={pkg?.thumbnail} uploadEnabled={uploadEnabled} />
          <MediaField name="videoUrl" label="Video (URL YouTube / upload)" kind="video" defaultValue={pkg?.videoUrl} uploadEnabled={uploadEnabled} />
          <TextField name="summary" label="Ringkasan singkat" defaultValue={pkg?.summary} />
          <TextArea name="description" label="Deskripsi" rows={5} defaultValue={pkg?.description} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextArea name="includes" label="Termasuk (1 baris = 1 item)" rows={6} defaultValue={pkg?.includes?.join('\n')} />
            <TextArea name="excludes" label="Tidak Termasuk (1 baris = 1 item)" rows={6} defaultValue={pkg?.excludes?.join('\n')} />
          </div>
          <TextArea
            name="hotels"
            label="Hotel"
            rows={3}
            hint="Format per baris: Nama Hotel | Bintang | Lokasi | Tipe Kamar"
            defaultValue={pkg?.hotels?.map((h) => [h.name, h.star ?? '', h.location ?? '', h.roomType ?? ''].join(' | ')).join('\n')}
          />
          <TextArea
            name="transports"
            label="Transportasi"
            rows={3}
            hint="Format per baris: Jenis | Detail  (contoh: Pesawat | Garuda Indonesia GA-880)"
            defaultValue={pkg?.transports?.map((t) => `${t.type} | ${t.detail}`).join('\n')}
          />
          <TextArea
            name="terms"
            label="Syarat & Ketentuan"
            rows={5}
            hint="Format per baris: Judul | Isi  (contoh: Pembatalan | Deposit tidak dapat dikembalikan)"
            defaultValue={pkg?.terms?.map((t) => `${t.title} | ${t.content}`).join('\n')}
          />
        </div>
      </Panel>

      <Panel title="SEO">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TextField name="seoTitle" label="SEO Title" defaultValue={pkg?.seoTitle} hint="Kosongkan untuk memakai nama paket." />
          <TextField name="metaDescription" label="Meta Description" defaultValue={pkg?.metaDescription} />
        </div>
      </Panel>
    </AdminForm>
  );
}

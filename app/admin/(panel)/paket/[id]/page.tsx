import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import PackageForm from '@/src/components/admin/PackageForm';
import AdminForm from '@/src/components/admin/AdminForm';
import DeleteButton from '@/src/components/admin/DeleteButton';
import MediaField from '@/src/components/admin/MediaField';
import { Panel, SelectField, TextArea, TextField } from '@/src/components/admin/fields';
import { db } from '@/src/db';
import { itineraryDays, packageDestinations, packageImages, packages, schedules, SCHEDULE_STATUS } from '@/src/db/schema';
import { singleLine } from '@/src/lib/format';
import { SCHEDULE_LABELS } from '@/src/lib/schedule';
import { getCatalogOptions, uploadEnabled } from '@/src/server/queries/admin-options';
import {
  addPackageImage,
  deleteItineraryDay,
  deletePackage,
  deletePackageImage,
  deleteSchedule,
  saveItineraryDay,
  saveSchedule,
} from '@/src/server/actions/admin/packages';

export const metadata: Metadata = { title: 'Edit Paket' };

const statusOptions = SCHEDULE_STATUS.map((s) => ({ value: s, label: SCHEDULE_LABELS[s] }));

export default async function EditPackagePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const { created } = await searchParams;

  const [[pkg], dests, days, images, sched, options] = await Promise.all([
    db.select().from(packages).where(eq(packages.id, id)),
    db.select({ id: packageDestinations.destinationId }).from(packageDestinations).where(eq(packageDestinations.packageId, id)),
    db.select().from(itineraryDays).where(eq(itineraryDays.packageId, id)).orderBy(asc(itineraryDays.dayNo)),
    db.select().from(packageImages).where(eq(packageImages.packageId, id)).orderBy(asc(packageImages.sort)),
    db.select().from(schedules).where(eq(schedules.packageId, id)).orderBy(asc(schedules.departureDate)),
    getCatalogOptions(),
  ]);
  if (!pkg) notFound();
  const canUpload = uploadEnabled();

  return (
    <div className="max-w-5xl space-y-8">
      <PageHeader title={singleLine(pkg.name)} back={{ href: '/admin/paket', label: 'Daftar paket' }} />
      {created && <p className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-xl">Paket dibuat. Lengkapi jadwal, itinerary, dan foto di bawah.</p>}
      {pkg.status === 'PUBLISHED' && (
        <Link href={`/paket-tour/${pkg.slug}`} target="_blank" className="text-sm font-semibold text-brand-navy hover:underline">
          Lihat halaman paket →
        </Link>
      )}

      {/* Schedules — availability status is set manually (client decision) */}
      <div id="jadwal">
        <Panel title="Jadwal Keberangkatan & Ketersediaan">
          <p className="text-xs text-brand-muted mb-4">
            Status diatur manual: OPEN / LIMITED bisa dibooking; FULL, SOLD OUT, CLOSED tampil tidak bisa dipilih di website.
          </p>
          <div className="space-y-3">
            {sched.map((s) => (
              <div key={s.id} className="border border-gray-100 rounded-xl p-3">
                <AdminForm action={saveSchedule} submitLabel="Simpan" className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end" inline>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="packageId" value={id} />
                  <TextField name="departureDate" label="Berangkat" type="date" defaultValue={s.departureDate} />
                  <SelectField name="status" label="Status" defaultValue={s.status} options={statusOptions} />
                  <TextField name="seatsLeft" label="Sisa kursi" type="number" defaultValue={s.seatsLeft} />
                  <TextField name="quota" label="Kuota" type="number" defaultValue={s.quota} />
                  <TextField name="note" label="Catatan" defaultValue={s.note} />
                </AdminForm>
                <div className="mt-2 text-right">
                  <DeleteButton action={deleteSchedule.bind(null, s.id)} confirmText="Hapus jadwal ini?" />
                </div>
              </div>
            ))}
            {sched.length === 0 && <p className="text-sm text-brand-muted">Belum ada jadwal.</p>}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-brand-dark mb-3">Tambah Jadwal</h3>
            <AdminForm action={saveSchedule} submitLabel="Tambah" className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end" inline resetOnSuccess>
              <input type="hidden" name="packageId" value={id} />
              <TextField name="departureDate" label="Berangkat" type="date" />
              <SelectField name="status" label="Status" defaultValue="OPEN" options={statusOptions} />
              <TextField name="seatsLeft" label="Sisa kursi" type="number" />
              <TextField name="quota" label="Kuota" type="number" />
              <TextField name="note" label="Catatan" />
            </AdminForm>
          </div>
        </Panel>
      </div>

      <PackageForm
        pkg={pkg}
        categories={options.categories}
        destinations={options.destinations}
        selectedDestinations={dests.map((d) => d.id)}
        uploadEnabled={canUpload}
      />

      <Panel title="Itinerary">
        <p className="text-xs text-brand-muted mb-4">Aktivitas per baris: <code>Waktu | Aktivitas | Lokasi | Meal</code> — atau cukup tulis aktivitasnya saja.</p>
        <div className="space-y-4">
          {days.map((day) => (
            <div key={day.id} className="border border-gray-100 rounded-xl p-4">
              <AdminForm action={saveItineraryDay} submitLabel="Simpan Hari" className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input type="hidden" name="id" value={day.id} />
                <input type="hidden" name="packageId" value={id} />
                <TextField name="dayNo" label="Hari ke-" type="number" defaultValue={day.dayNo} />
                <TextField name="title" label="Judul" defaultValue={day.title} className="md:col-span-3" />
                <TextArea
                  name="items"
                  label="Aktivitas"
                  rows={4}
                  className="md:col-span-4"
                  defaultValue={day.items
                    ?.map((i) => (i.time || i.location || i.meal ? [i.time ?? '', i.activity, i.location ?? '', i.meal ?? ''].join(' | ') : i.activity))
                    .join('\n')}
                />
                <TextField name="hotel" label="Hotel" defaultValue={day.hotel} className="md:col-span-2" />
                <TextField name="transport" label="Transportasi" defaultValue={day.transport} className="md:col-span-2" />
              </AdminForm>
              <div className="mt-2 text-right">
                <DeleteButton action={deleteItineraryDay.bind(null, day.id)} confirmText={`Hapus Day ${day.dayNo}?`} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-brand-dark mb-3">Tambah Hari</h3>
          <AdminForm action={saveItineraryDay} submitLabel="Tambah Hari" className="grid grid-cols-1 md:grid-cols-4 gap-3" resetOnSuccess>
            <input type="hidden" name="packageId" value={id} />
            <TextField name="dayNo" label="Hari ke-" type="number" defaultValue={(days.at(-1)?.dayNo ?? 0) + 1} />
            <TextField name="title" label="Judul" className="md:col-span-3" />
            <TextArea name="items" label="Aktivitas" rows={3} className="md:col-span-4" />
            <TextField name="hotel" label="Hotel" className="md:col-span-2" />
            <TextField name="transport" label="Transportasi" className="md:col-span-2" />
          </AdminForm>
        </div>
      </Panel>

      <Panel title="Foto Galeri Paket">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {images.map((img) => (
            <div key={img.id} className="space-y-2">
              <div className="relative h-28 rounded-xl overflow-hidden bg-gray-100">
                <Image src={img.url} alt={img.caption ?? ''} fill className="object-cover" sizes="200px" />
              </div>
              <DeleteButton action={deletePackageImage.bind(null, img.id)} confirmText="Hapus foto ini?" />
            </div>
          ))}
          {images.length === 0 && <p className="text-sm text-brand-muted col-span-full">Belum ada foto tambahan. Thumbnail tetap tampil sebagai foto utama.</p>}
        </div>
        <AdminForm action={addPackageImage} submitLabel="Tambah Foto" resetOnSuccess>
          <input type="hidden" name="packageId" value={id} />
          <MediaField name="url" label="Foto baru" uploadEnabled={canUpload} />
        </AdminForm>
      </Panel>

      <Panel title="Zona Berbahaya">
        <DeleteButton
          action={deletePackage.bind(null, id)}
          label="Hapus paket ini"
          confirmText="Hapus paket beserta jadwal, itinerary, dan fotonya? Tindakan ini tidak dapat dibatalkan."
        />
      </Panel>
    </div>
  );
}

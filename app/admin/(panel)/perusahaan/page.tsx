import { asc } from 'drizzle-orm';
import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import AdminForm from '@/src/components/admin/AdminForm';
import DeleteButton from '@/src/components/admin/DeleteButton';
import EditableItem from '@/src/components/admin/EditableItem';
import MediaField from '@/src/components/admin/MediaField';
import { Panel, TextArea, TextField } from '@/src/components/admin/fields';
import { db } from '@/src/db';
import { legalDocuments, partners, teams } from '@/src/db/schema';
import { getSetting } from '@/src/server/queries/settings';
import { uploadEnabled } from '@/src/server/queries/admin-options';
import { saveSetting } from '@/src/server/actions/admin/settings';
import {
  deleteLegalDocument,
  deletePartner,
  deleteTeamMember,
  saveLegalDocument,
  savePartner,
  saveTeamMember,
} from '@/src/server/actions/admin/content';

export const metadata: Metadata = { title: 'Profil Perusahaan' };

export default async function AdminCompanyPage() {
  const [company, team, legal, partnerList] = await Promise.all([
    getSetting('company'),
    db.select().from(teams).orderBy(asc(teams.sort)),
    db.select().from(legalDocuments).orderBy(asc(legalDocuments.sort)),
    db.select().from(partners).orderBy(asc(partners.sort)),
  ]);
  const canUpload = uploadEnabled();

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader title="Profil Perusahaan" description="Konten halaman Tentang Kami." />

      <Panel title="Tentang, Sejarah, Visi & Misi">
        <AdminForm action={saveSetting}>
          <input type="hidden" name="key" value="company" />
          <TextArea name="about" label="Tentang Hathaway Journey" rows={4} defaultValue={company.about} />
          <TextArea name="history" label="Sejarah Perusahaan" rows={4} defaultValue={company.history} />
          <MediaField name="image" label="Foto Perusahaan" defaultValue={company.image} uploadEnabled={canUpload} />
          <TextArea name="vision" label="Visi" rows={3} defaultValue={company.vision} />
          <TextArea name="missions" label="Misi (1 baris = 1 poin)" rows={4} defaultValue={company.missions.join('\n')} />
          <TextArea name="values" label="Nilai Perusahaan" hint="Format per baris: Judul | Deskripsi" rows={4} defaultValue={company.values.map((v) => `${v.title} | ${v.desc}`).join('\n')} />
        </AdminForm>
      </Panel>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-brand-navy">Legalitas & Sertifikasi</h2>
        <EditableItem title="+ Tambah dokumen">
          <AdminForm action={saveLegalDocument} submitLabel="Tambah" resetOnSuccess>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField name="name" label="Nama (mis. NIB, Akta, ASITA)" />
              <TextField name="number" label="Nomor" />
              <TextField name="sort" label="Urutan" type="number" defaultValue={legal.length + 1} />
            </div>
            <MediaField name="fileUrl" label="File / gambar dokumen (opsional)" uploadEnabled={canUpload} />
          </AdminForm>
        </EditableItem>
        {legal.map((doc) => (
          <EditableItem key={doc.id} title={doc.name} subtitle={doc.number} actions={<DeleteButton action={deleteLegalDocument.bind(null, doc.id)} />}>
            <AdminForm action={saveLegalDocument}>
              <input type="hidden" name="id" value={doc.id} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField name="name" label="Nama" defaultValue={doc.name} />
                <TextField name="number" label="Nomor" defaultValue={doc.number} />
                <TextField name="sort" label="Urutan" type="number" defaultValue={doc.sort} />
              </div>
              <MediaField name="fileUrl" label="File / gambar dokumen" defaultValue={doc.fileUrl} uploadEnabled={canUpload} />
            </AdminForm>
          </EditableItem>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-brand-navy">Tim</h2>
        <EditableItem title="+ Tambah anggota tim">
          <AdminForm action={saveTeamMember} submitLabel="Tambah" resetOnSuccess>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField name="name" label="Nama" />
              <TextField name="position" label="Jabatan" />
              <TextField name="sort" label="Urutan" type="number" defaultValue={team.length + 1} />
            </div>
            <TextArea name="bio" label="Bio singkat" rows={2} />
            <MediaField name="photo" label="Foto" uploadEnabled={canUpload} />
          </AdminForm>
        </EditableItem>
        {team.map((m) => (
          <EditableItem key={m.id} title={m.name} subtitle={m.position} thumb={m.photo} actions={<DeleteButton action={deleteTeamMember.bind(null, m.id)} />}>
            <AdminForm action={saveTeamMember}>
              <input type="hidden" name="id" value={m.id} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField name="name" label="Nama" defaultValue={m.name} />
                <TextField name="position" label="Jabatan" defaultValue={m.position} />
                <TextField name="sort" label="Urutan" type="number" defaultValue={m.sort} />
              </div>
              <TextArea name="bio" label="Bio singkat" rows={2} defaultValue={m.bio} />
              <MediaField name="photo" label="Foto" defaultValue={m.photo} uploadEnabled={canUpload} />
            </AdminForm>
          </EditableItem>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-brand-navy">Partner</h2>
        <EditableItem title="+ Tambah partner">
          <AdminForm action={savePartner} submitLabel="Tambah" resetOnSuccess>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField name="name" label="Nama" />
              <TextField name="url" label="Website (opsional)" />
              <TextField name="sort" label="Urutan" type="number" defaultValue={partnerList.length + 1} />
            </div>
            <MediaField name="logo" label="Logo" uploadEnabled={canUpload} />
          </AdminForm>
        </EditableItem>
        {partnerList.map((p) => (
          <EditableItem key={p.id} title={p.name} subtitle={p.url} thumb={p.logo} actions={<DeleteButton action={deletePartner.bind(null, p.id)} />}>
            <AdminForm action={savePartner}>
              <input type="hidden" name="id" value={p.id} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField name="name" label="Nama" defaultValue={p.name} />
                <TextField name="url" label="Website" defaultValue={p.url} />
                <TextField name="sort" label="Urutan" type="number" defaultValue={p.sort} />
              </div>
              <MediaField name="logo" label="Logo" defaultValue={p.logo} uploadEnabled={canUpload} />
            </AdminForm>
          </EditableItem>
        ))}
      </section>
    </div>
  );
}

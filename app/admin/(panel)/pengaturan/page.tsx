import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import AdminForm from '@/src/components/admin/AdminForm';
import MediaField from '@/src/components/admin/MediaField';
import { Panel, TextArea, TextField } from '@/src/components/admin/fields';
import { getSettings } from '@/src/server/queries/settings';
import { uploadEnabled } from '@/src/server/queries/admin-options';
import { changeOwnPassword, saveSetting } from '@/src/server/actions/admin/settings';

export const metadata: Metadata = { title: 'Pengaturan' };

const Key = ({ value }: { value: string }) => <input type="hidden" name="key" value={value} />;

export default async function AdminSettingsPage() {
  const s = await getSettings('contact', 'social', 'wa_templates', 'home_stats', 'home_benefits', 'home_regions', 'legal_pages');
  const canUpload = uploadEnabled();
  const stats = Array.from({ length: 4 }, (_, i) => s.home_stats[i] ?? { value: '', label: '' });
  const benefits = Array.from({ length: 6 }, (_, i) => s.home_benefits[i] ?? { title: '', desc: '' });

  return (
    <div className="max-w-4xl space-y-8">
      <PageHeader title="Pengaturan" description="Kontak, WhatsApp, konten Home, dan halaman legal." />

      <Panel title="Kontak & WhatsApp">
        <AdminForm action={saveSetting}>
          <Key value="contact" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField name="whatsapp" label="Nomor WhatsApp Admin" defaultValue={s.contact.whatsapp} hint="Tujuan semua tombol WA & booking." />
            <TextField name="phoneDisplay" label="Nomor telepon (tampilan)" defaultValue={s.contact.phoneDisplay} />
            <TextField name="email" label="Email" defaultValue={s.contact.email} />
            <TextArea name="address" label="Alamat" rows={3} defaultValue={s.contact.address} />
            <TextArea name="hours" label="Jam Operasional" rows={3} defaultValue={s.contact.hours} />
            <TextArea name="mapsEmbedUrl" label="Google Maps Embed" rows={3} defaultValue={s.contact.mapsEmbedUrl} hint="Google Maps → Bagikan → Sematkan peta → salin HTML." />
          </div>
        </AdminForm>
      </Panel>

      <Panel title="Template Pesan WhatsApp">
        <AdminForm action={saveSetting}>
          <Key value="wa_templates" />
          <p className="text-xs text-brand-muted">
            Placeholder: <code>{'{paket}'}</code> <code>{'{tanggal}'}</code> <code>{'{peserta}'}</code> <code>{'{link}'}</code>
          </p>
          <TextArea name="booking" label="Booking (tombol Booking Sekarang)" rows={7} defaultValue={s.wa_templates.booking} />
          <TextArea name="inquiry" label="Tanya paket (tombol WhatsApp Admin)" rows={5} defaultValue={s.wa_templates.inquiry} />
          <TextArea name="general" label="Konsultasi umum (tombol WA melayang/Hero)" rows={2} defaultValue={s.wa_templates.general} />
        </AdminForm>
      </Panel>

      <Panel title="Media Sosial">
        <AdminForm action={saveSetting} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Key value="social" />
          <TextField name="instagram" label="Instagram URL" defaultValue={s.social.instagram} />
          <TextField name="facebook" label="Facebook URL" defaultValue={s.social.facebook} />
          <TextField name="youtube" label="YouTube URL" defaultValue={s.social.youtube} />
          <TextField name="tiktok" label="TikTok URL" defaultValue={s.social.tiktok} />
        </AdminForm>
      </Panel>

      <Panel title="Home — Angka Statistik">
        <AdminForm action={saveSetting} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Key value="home_stats" />
          {stats.map((st, i) => (
            <div key={i} className="space-y-2">
              <TextField name={`stats.${i}.value`} label={`Angka ${i + 1}`} defaultValue={st.value} />
              <TextField name={`stats.${i}.label`} label="Label" defaultValue={st.label} />
            </div>
          ))}
        </AdminForm>
      </Panel>

      <Panel title="Home — Keunggulan (Why Choose Us)">
        <AdminForm action={saveSetting} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Key value="home_benefits" />
          {benefits.map((b, i) => (
            <div key={i} className="space-y-2">
              <TextField name={`benefits.${i}.title`} label={`Judul ${i + 1}`} defaultValue={b.title} />
              <TextField name={`benefits.${i}.desc`} label="Deskripsi" defaultValue={b.desc} />
            </div>
          ))}
        </AdminForm>
      </Panel>

      <Panel title="Home — Destinasi Populer (Wilayah)">
        <AdminForm action={saveSetting}>
          <Key value="home_regions" />
          {s.home_regions.map((r, i) => (
            <div key={r.region} className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 pb-4">
              <TextField name={`regions.${i}.label`} label={`Label (${r.region})`} defaultValue={r.label} />
              <div className="md:col-span-2">
                <MediaField name={`regions.${i}.image`} label="Gambar" defaultValue={r.image} uploadEnabled={canUpload} />
              </div>
            </div>
          ))}
        </AdminForm>
      </Panel>

      <Panel title="Halaman Legal">
        <AdminForm action={saveSetting}>
          <Key value="legal_pages" />
          <TextArea name="privacy" label="Privacy Policy" rows={8} defaultValue={s.legal_pages.privacy} />
          <TextArea name="terms" label="Terms & Conditions" rows={8} defaultValue={s.legal_pages.terms} />
        </AdminForm>
      </Panel>

      <Panel title="Akun Saya — Ganti Password">
        <AdminForm action={changeOwnPassword} submitLabel="Ganti Password" className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start" resetOnSuccess>
          <TextField name="current" label="Password lama" type="password" />
          <TextField name="next" label="Password baru" type="password" hint="Minimal 8 karakter." />
          <TextField name="confirm" label="Ulangi password baru" type="password" />
        </AdminForm>
      </Panel>
    </div>
  );
}

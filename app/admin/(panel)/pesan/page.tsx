import { desc } from 'drizzle-orm';
import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import ActionButton from '@/src/components/admin/ActionButton';
import DeleteButton from '@/src/components/admin/DeleteButton';
import { db } from '@/src/db';
import { contactMessages } from '@/src/db/schema';
import { waLink } from '@/src/lib/whatsapp';
import { deleteMessage, toggleMessageRead } from '@/src/server/actions/admin/content';

export const metadata: Metadata = { title: 'Pesan Masuk' };

const dateTime = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' });

export default async function AdminMessagesPage() {
  const messages = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  return (
    <div className="max-w-4xl space-y-4">
      <PageHeader title="Pesan Masuk" description="Pesan dari form di halaman Kontak." />
      {messages.length === 0 && <p className="text-sm text-brand-muted">Belum ada pesan.</p>}
      {messages.map((m) => (
        <article key={m.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${m.isRead ? 'border-gray-100' : 'border-brand-navy/30'}`}>
          <div className="flex flex-wrap justify-between gap-2 mb-2">
            <div>
              <p className="font-bold text-brand-dark">
                {!m.isRead && <span className="inline-block w-2 h-2 rounded-full bg-brand-red mr-2 align-middle" />}
                {m.name}
              </p>
              <p className="text-xs text-brand-muted">
                {m.whatsapp}
                {m.email && ` · ${m.email}`} · {dateTime.format(new Date(m.createdAt))}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a href={waLink(m.whatsapp, `Halo ${m.name}, terima kasih telah menghubungi Hathaway Journey.`)} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-green-600 hover:underline">
                Balas via WA
              </a>
              <ActionButton action={toggleMessageRead.bind(null, m.id, !m.isRead)}>{m.isRead ? 'Tandai belum dibaca' : 'Tandai dibaca'}</ActionButton>
              <DeleteButton action={deleteMessage.bind(null, m.id)} confirmText="Hapus pesan ini?" />
            </div>
          </div>
          {m.subject && <p className="text-sm font-semibold text-brand-navy mb-1">{m.subject}</p>}
          <p className="text-sm text-gray-600 whitespace-pre-line">{m.message}</p>
        </article>
      ))}
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { asc, desc, eq, sql } from 'drizzle-orm';
import type { Metadata } from 'next';
import PageHeader from '@/src/components/admin/PageHeader';
import ActionButton from '@/src/components/admin/ActionButton';
import { db } from '@/src/db';
import { categories, packages, schedules } from '@/src/db/schema';
import { formatRupiah, singleLine } from '@/src/lib/format';
import { duplicatePackage, togglePackageStatus } from '@/src/server/actions/admin/packages';

export const metadata: Metadata = { title: 'Paket' };

export default async function AdminPackagesPage() {
  const rows = await db
    .select({
      id: packages.id,
      name: packages.name,
      slug: packages.slug,
      thumbnail: packages.thumbnail,
      durationDays: packages.durationDays,
      price: packages.price,
      promoPrice: packages.promoPrice,
      status: packages.status,
      featured: packages.featured,
      category: categories.name,
      upcoming: sql<number>`(SELECT COUNT(*) FROM ${schedules} s WHERE s.package_id = ${packages.id} AND s.departure_date >= CURDATE())`,
    })
    .from(packages)
    .leftJoin(categories, eq(categories.id, packages.categoryId))
    .orderBy(asc(packages.sort), desc(packages.id));

  return (
    <div>
      <PageHeader title="Paket & Jadwal" description="Kelola paket tour, jadwal keberangkatan, dan status ketersediaan." addHref="/admin/paket/baru" addLabel="Tambah Paket" />
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-brand-muted uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Paket</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Jadwal</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image src={p.thumbnail} alt="" fill className="object-cover" sizes="56px" />
                    </div>
                    <div>
                      <Link href={`/admin/paket/${p.id}`} className="font-semibold text-brand-navy hover:underline">{singleLine(p.name)}</Link>
                      <p className="text-xs text-brand-muted">
                        {p.durationDays} hari{p.featured && ' · ★ Rekomendasi'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.category ?? '-'}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">Rp {formatRupiah(p.promoPrice ?? p.price)}</td>
                <td className="px-4 py-3 text-gray-600">{Number(p.upcoming)} mendatang</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${p.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-4 whitespace-nowrap">
                    <Link href={`/admin/paket/${p.id}`} className="text-xs font-semibold text-brand-navy hover:underline">Edit</Link>
                    <ActionButton action={togglePackageStatus.bind(null, p.id)}>{p.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</ActionButton>
                    <ActionButton action={duplicatePackage.bind(null, p.id)}>Duplikat</ActionButton>
                    {p.status === 'PUBLISHED' && (
                      <Link href={`/paket-tour/${p.slug}`} target="_blank" className="text-xs font-semibold text-brand-muted hover:underline">Lihat</Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-brand-muted">Belum ada paket.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

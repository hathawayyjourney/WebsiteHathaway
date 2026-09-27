# Hathaway Journey — Website Tour & Travel

Next.js 16 (App Router) + MySQL (Drizzle ORM) + Cloudinary. Website publik + Admin Panel (`/admin`).

**Alur booking (arahan client):** tombol *Booking* langsung membuka WhatsApp admin dengan pesan otomatis
(paket, tanggal, jumlah peserta, link). Booking **tidak** disimpan di database. Status ketersediaan jadwal
(OPEN / LIMITED / FULL / SOLD OUT / CLOSED) diatur **manual** oleh admin.

## Development lokal

```bash
cp .env.example .env            # lalu isi SESSION_SECRET & SEED_ADMIN_PASSWORD
docker run -d --name hathaway-mysql -e MYSQL_ROOT_PASSWORD=devroot -e MYSQL_DATABASE=hathaway \
  -e MYSQL_USER=hathaway -e MYSQL_PASSWORD=hathaway_dev -p 3307:3306 mysql:8.4
npm install
npm run db:migrate              # buat tabel
npm run db:seed                 # data contoh + akun SUPER_ADMIN dari SEED_ADMIN_*
npm run dev                     # http://localhost:3000  ·  admin: /admin
```

| Script | Fungsi |
|---|---|
| `npm run db:generate` | Buat file migrasi baru setelah mengubah `src/db/schema.ts` |
| `npm run db:migrate` | Jalankan migrasi yang belum diterapkan (`drizzle/`) |
| `npm run db:seed` | Isi data contoh (hanya jika tabel paket kosong). `-- --reset` untuk mengulang konten |
| `npm run db:studio` | Drizzle Studio untuk melihat isi database |

## Deploy ke Hostinger (Node.js Web App dari GitHub)

1. **Database** — hPanel → *Databases → MySQL Databases*: buat database + user. Catat host, nama DB, user, password.
2. **Jalankan migrasi & seed ke DB Hostinger** (sekali di awal, dan setiap ada migrasi baru):
   - hPanel → *Remote MySQL*: izinkan IP komputer Anda, lalu dari lokal:
     `DATABASE_URL="mysql://USER:PASS@HOST:3306/DB" npm run db:migrate` dan `... npm run db:seed`
   - atau via SSH/terminal Hostinger (jika tersedia di paket Anda) jalankan perintah yang sama.
3. **Node.js Web App** — hPanel → *Websites → Add Website → Node.js Apps → Import Git Repository*:
   - Repository: repo GitHub ini, branch `main`
   - Node version: **20.x atau 22.x**
   - Build command: `npm run build` · Start command: `npm start`
4. **Environment variables** (di pengaturan app Hostinger) — isi sesuai `.env.example`:
   `DATABASE_URL`, `SESSION_SECRET` (hasil `openssl rand -base64 32`), `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`, `NEXT_PUBLIC_SITE_URL` (mis. `https://hathawayjourney.com`), `NEXT_PUBLIC_GA_ID`.
   `SEED_ADMIN_*` tidak perlu di server.
5. **Domain & SSL** — hubungkan domain dan aktifkan SSL gratis di hPanel.
6. Setiap `git push` ke `main` → Hostinger build & deploy ulang otomatis.

`next build` **tidak membutuhkan akses database** — semua halaman yang membaca DB dirender saat request.

### Setelah go-live
- Login `/admin` → **Pengaturan**: isi nomor WhatsApp admin, alamat, email, Google Maps, media sosial.
- Ganti gambar contoh (Unsplash) dengan foto asli via upload Cloudinary di tiap form.
- Ganti password akun admin di **Pengaturan → Akun Saya**.
- Aktifkan backup database otomatis di hPanel (NFR-004).

## Struktur

```
app/(site)/        halaman publik (layout berisi Header/Footer/WA floating)
app/admin/         admin panel (login + (panel) yang dilindungi)
app/api/upload/    signature upload Cloudinary (khusus admin)
proxy.ts           redirect /admin → /admin/login bila belum login (cek utama tetap di requireUser)
src/db/            schema Drizzle, koneksi, seed
src/server/        queries (baca data), actions (Server Actions), auth (session)
src/lib/           helper bersama: format, whatsapp, settings default, filter paket
src/components/    komponen UI (desain existing dipertahankan)
```

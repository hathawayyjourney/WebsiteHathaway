<<<<<<< Updated upstream
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# Hathaway Journey — Panduan Deployment ke Hostinger

Panduan langkah demi langkah untuk meng-online-kan website **Hathaway Journey** (Next.js 16 + MySQL + Cloudinary)
di **Hostinger Node.js Web App** yang otomatis mengambil kode dari **GitHub**.

> Ditulis untuk orang yang baru pertama kali deploy. Ikuti urutannya dari atas ke bawah; setiap langkah ada
> tanda ✅ untuk memastikan langkah itu berhasil sebelum lanjut.

---

## Daftar Isi

1. [Gambaran Singkat](#1-gambaran-singkat)
2. [Yang Perlu Disiapkan](#2-yang-perlu-disiapkan)
3. [Langkah 1 — Siapkan Cloudinary & Google Analytics](#3-langkah-1--siapkan-cloudinary--google-analytics)
4. [Langkah 2 — Buat Database MySQL di Hostinger](#4-langkah-2--buat-database-mysql-di-hostinger)
5. [Langkah 3 — Isi Tabel & Buat Akun Admin](#5-langkah-3--isi-tabel--buat-akun-admin)
6. [Langkah 4 — Buat Node.js Web App dari GitHub](#6-langkah-4--buat-nodejs-web-app-dari-github)
7. [Langkah 5 — Environment Variables](#7-langkah-5--environment-variables)
8. [Langkah 6 — Domain & SSL](#8-langkah-6--domain--ssl)
9. [Langkah 7 — Checklist Setelah Online](#9-langkah-7--checklist-setelah-online)
10. [Cara Update Website Sehari-hari](#10-cara-update-website-sehari-hari)
11. [Jika Struktur Database Berubah (Migrasi)](#11-jika-struktur-database-berubah-migrasi)
12. [Backup & Keamanan](#12-backup--keamanan)
13. [Troubleshooting](#13-troubleshooting)
14. [Lampiran — Development Lokal](#14-lampiran--development-lokal)

---

## 1. Gambaran Singkat

```
 ┌──────────┐   git push    ┌─────────────────────────────┐
 │  GitHub  │ ────────────▶ │  Hostinger Node.js Web App  │ ◀── Pengunjung (https://domain-anda.com)
 │ (branch  │   auto build  │  npm run build → npm start  │ ◀── Admin      (https://domain-anda.com/admin)
 │   main)  │   & deploy    └──────┬──────────────┬───────┘
 └──────────┘                      │              │
                                   ▼              ▼
                         ┌────────────────┐  ┌──────────────┐
                         │ MySQL Hostinger│  │  Cloudinary  │  (upload foto/video dari admin)
                         └────────────────┘  └──────────────┘
```

- **Website publik**: katalog paket, destinasi, gallery, testimoni, FAQ, kontak.
- **Booking**: tombol *Booking* langsung membuka **WhatsApp admin** dengan pesan otomatis
  (paket, tanggal, jumlah peserta, link). Booking **tidak disimpan** di database.
- **Admin panel** (`/admin`): kelola paket, jadwal (status OPEN/LIMITED/FULL/SOLD OUT/CLOSED diatur **manual**),
  destinasi, gallery, testimoni, FAQ, profil perusahaan, pesan masuk, pengaturan, dan user.
- `npm run build` **tidak membutuhkan database**, jadi proses build di Hostinger aman walaupun database belum siap.

---

## 2. Yang Perlu Disiapkan

| # | Kebutuhan | Keterangan |
|---|---|---|
| 1 | **Paket Hostinger Business** atau **Cloud** (Startup/Professional/Enterprise) | Paket *Single/Premium* **tidak** mendukung Node.js Web App. |
| 2 | **Domain** | Bisa dibeli di Hostinger atau domain yang sudah ada. |
| 3 | **Akses repository GitHub** ini | Akun yang dipakai harus bisa membaca repo. |
| 4 | **Akun Cloudinary** (gratis) | Untuk upload gambar/video dari admin panel. |
| 5 | **Akun Google Analytics 4** (opsional) | Untuk statistik pengunjung & klik WhatsApp. |
| 6 | **Nomor WhatsApp admin** | Tujuan semua tombol Booking/WhatsApp. |
| 7 | **Komputer dengan Node.js 20+ dan Git** | Hanya untuk langkah 3 (mengisi tabel database). Cek dengan `node -v`. |

---

## 3. Langkah 1 — Siapkan Cloudinary & Google Analytics

### 3.1 Cloudinary (wajib untuk fitur upload)

1. Daftar gratis di <https://cloudinary.com>.
2. Buka **Dashboard** → bagian **API Keys** (atau *Settings → API Keys*).
3. Catat tiga nilai berikut:
   - **Cloud name** → nanti diisi ke `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET` (**rahasia**, jangan dibagikan)

> Tanpa Cloudinary website tetap jalan, tetapi tombol **Upload** di admin tidak muncul. Gambar masih bisa diisi
> dengan menempelkan URL gambar.

### 3.2 Google Analytics 4 (opsional)

1. Buka <https://analytics.google.com> → **Admin** → **Create property** (isi nama & zona waktu Jakarta).
2. **Data streams** → **Web** → masukkan domain Anda.
3. Salin **Measurement ID** yang berawalan `G-` (contoh `G-AB12CD34EF`) → nanti diisi ke `NEXT_PUBLIC_GA_ID`.

Event yang otomatis terkirim: `view_package`, `search_package`, `click_booking_wa`, `click_whatsapp`,
`view_destination`, `submit_contact`. Karena booking tidak disimpan di database, **`click_booking_wa` adalah cara
menghitung jumlah booking**.

✅ Anda sudah punya: Cloud name, API Key, API Secret, (dan Measurement ID bila memakai GA).

---

## 4. Langkah 2 — Buat Database MySQL di Hostinger

1. Login **hPanel** → **Websites** → pilih website/akun Anda → **Dashboard**.
2. Buka menu **Databases** → **Management** (MySQL Databases).
3. Isi:
   - **Database name**: misalnya `hathaway`
   - **Username**: misalnya `hathaway`
   - **Password**: buat password kuat, **simpan baik-baik**
4. Klik **Create**.

Hostinger biasanya menambahkan awalan akun, sehingga nama akhirnya seperti:

| Data | Contoh nilai akhir |
|---|---|
| Nama database | `u123456789_hathaway` |
| Username | `u123456789_hathaway` |
| Password | `(password Anda)` |

Salin nama **persis** seperti yang tertera di daftar database hPanel.

### 4.1 Susun `DATABASE_URL`

Formatnya:

```
mysql://USERNAME:PASSWORD@HOST:3306/NAMA_DATABASE
```

Ada **dua** versi yang akan dipakai:

| Dipakai untuk | HOST | Contoh |
|---|---|---|
| **Aplikasi di Hostinger** (Langkah 5) | `127.0.0.1` | `mysql://u123456789_hathaway:PASSWORD@127.0.0.1:3306/u123456789_hathaway` |
| **Komputer Anda** saat mengisi tabel (Langkah 3) | hostname Remote MySQL, mis. `srv1234.hstgr.io` | `mysql://u123456789_hathaway:PASSWORD@srv1234.hstgr.io:3306/u123456789_hathaway` |

> ⚠️ Pakai `127.0.0.1`, **bukan** `localhost`, untuk aplikasi di Hostinger. Node.js mengartikan `localhost` sebagai
> IPv6 (`::1`) yang sering ditolak MySQL.

> ⚠️ Jika password mengandung karakter khusus (`@ # : / ? & %` dll.), **encode** dulu:
> ```bash
> node -e "console.log(encodeURIComponent('P@ss#w0rd'))"
> ```
> Hasilnya (`P%40ss%23w0rd`) yang dimasukkan ke `DATABASE_URL`.

✅ Database sudah muncul di daftar **Databases → Management**.

---

## 5. Langkah 3 — Isi Tabel & Buat Akun Admin

Database yang baru dibuat masih kosong. Langkah ini membuat semua tabel dan akun **Super Admin** pertama.
Dijalankan **sekali dari komputer Anda**.

### 5.1 Izinkan komputer Anda mengakses database (Remote MySQL)

1. hPanel → **Websites** → **Dashboard** → cari menu **Remote MySQL**.
2. Pada **IP (IPv4 or IPv6)** isi IP publik komputer Anda (cek di <https://whatismyipaddress.com>),
   **atau** centang **Any Host** (lebih mudah, tapi hapus lagi setelah selesai).
3. Pada **Database** pilih database tadi → **Create**.
4. Catat **hostname MySQL** yang tertera di bagian atas halaman Remote MySQL (contoh `srv1234.hstgr.io`).

### 5.2 Jalankan migrasi dan buat admin

Di komputer Anda:

```bash
git clone <URL-repo-GitHub-ini>
cd WebsiteHathaway
npm install
```

Lalu jalankan (ganti nilai sesuai milik Anda; gunakan **hostname Remote MySQL**, bukan 127.0.0.1):

**macOS / Linux**

```bash
export DATABASE_URL="mysql://u123456789_hathaway:PASSWORD@srv1234.hstgr.io:3306/u123456789_hathaway"
export SEED_ADMIN_EMAIL="admin@domain-anda.com"
export SEED_ADMIN_PASSWORD="PasswordAdminYangKuat123!"
npm run db:migrate
npm run db:seed -- --admin-only
```

**Windows (PowerShell)**

```powershell
$env:DATABASE_URL="mysql://u123456789_hathaway:PASSWORD@srv1234.hstgr.io:3306/u123456789_hathaway"
$env:SEED_ADMIN_EMAIL="admin@domain-anda.com"
$env:SEED_ADMIN_PASSWORD="PasswordAdminYangKuat123!"
npm run db:migrate
npm run db:seed -- --admin-only
```

Output yang diharapkan:

```
Migrations applied.
Created SUPER_ADMIN admin@domain-anda.com
Admin account & default settings ready (--admin-only: no sample content).
```

| Perintah | Fungsi |
|---|---|
| `npm run db:migrate` | Membuat/memperbarui semua tabel. Aman dijalankan berulang. |
| `npm run db:seed -- --admin-only` | Membuat akun Super Admin + pengaturan default. **Tanpa** data contoh — konten asli diisi dari admin panel. |
| `npm run db:seed` | Sama seperti di atas **plus** 8 paket contoh, destinasi, gallery, FAQ (gambar Unsplash). Cocok untuk staging/demo. |

> ⛔ **Jangan pernah** menjalankan `npm run db:seed -- --reset` ke database produksi — perintah itu **menghapus
> semua konten** (paket, destinasi, gallery, dll.).

### 5.3 Tutup lagi akses Remote MySQL (disarankan)

Setelah berhasil, kembali ke **Remote MySQL** dan hapus entri IP / *Any Host* tadi. Aplikasi di Hostinger tidak
membutuhkannya karena terhubung lewat `127.0.0.1`.

✅ Buka **phpMyAdmin** (hPanel → Databases) — tabel seperti `packages`, `schedules`, `users`, `settings` sudah ada.

---

## 6. Langkah 4 — Buat Node.js Web App dari GitHub

> Jika domain yang akan dipakai sudah terpasang website lain di Hostinger, **hapus/pindahkan website tersebut
> terlebih dahulu** — alur Node.js Web App membuat slot website baru untuk domain itu.

1. hPanel → **Websites** → **Add Website**.
2. Pilih **Node.js Apps** / **Node.js web app**.
3. Pilih **Import Git repository** → **Connect with GitHub** → izinkan akses → pilih repository ini.
4. Hostinger mendeteksi Next.js dan mengisi pengaturan otomatis. Pastikan nilainya:

| Pengaturan | Nilai |
|---|---|
| **Framework preset** | `Next.js` |
| **Branch** | `main` |
| **Node.js version** | `22` (atau `20`; minimal 20.9) |
| **Package manager** | `npm` |
| **Build command** | `npm run build` |
| **Output directory** | `.next` (biarkan default preset) |
| **Start / Entry** | `npm start` (biarkan default preset — Next.js otomatis membaca `PORT` dari Hostinger) |

5. **Sebelum klik Deploy**, buka bagian **Set environment variables** dan isi semua variabel di
   [Langkah 5](#7-langkah-5--environment-variables).
6. Klik **Deploy** dan tunggu hingga status selesai. Pantau di **Build logs**.

✅ Build logs diakhiri daftar route (`/`, `/paket-tour`, `/admin`, …) tanpa error, dan website terbuka di domain
sementara / domain Anda.

---

## 7. Langkah 5 — Environment Variables

Diisi di halaman deploy (**Set environment variables**) atau setelah deploy lewat menu **Environment variables**
di sidebar dashboard website. Bisa juga **Import .env**: buat file teks berisi daftar di bawah lalu upload.

> Setiap kali environment variable **disimpan**, Hostinger otomatis **redeploy** (build ulang) supaya nilai baru
> berlaku.

| Variable | Wajib | Contoh nilai | Keterangan |
|---|---|---|---|
| `DATABASE_URL` | ✅ | `mysql://u123456789_hathaway:PASSWORD@127.0.0.1:3306/u123456789_hathaway` | Versi **127.0.0.1** (lihat 4.1). |
| `SESSION_SECRET` | ✅ | `k3Jd9...` (≥ 32 karakter acak) | Kunci login admin. Buat dengan perintah di bawah. |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://hathawayjourney.com` | Domain final **tanpa** `/` di akhir. Dipakai di link pesan WA, sitemap, SEO. |
| `CLOUDINARY_CLOUD_NAME` | ⭕ | `hathaway` | Dari Langkah 1. |
| `CLOUDINARY_API_KEY` | ⭕ | `123456789012345` | Dari Langkah 1. |
| `CLOUDINARY_API_SECRET` | ⭕ | `abcDEF...` | Dari Langkah 1. **Rahasia.** |
| `CLOUDINARY_FOLDER` | ⭕ | `hathaway` | Nama folder penyimpanan di Cloudinary. |
| `NEXT_PUBLIC_GA_ID` | ⭕ | `G-AB12CD34EF` | Kosongkan jika tidak memakai Google Analytics. |

✅ = wajib · ⭕ = opsional (fitur terkait nonaktif bila kosong). `SEED_ADMIN_*` **tidak** perlu diisi di Hostinger.

**Membuat `SESSION_SECRET`** (jalankan di komputer mana pun yang punya Node.js):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Contoh isi file untuk **Import .env**:

```env
DATABASE_URL=mysql://u123456789_hathaway:PASSWORD@127.0.0.1:3306/u123456789_hathaway
SESSION_SECRET=hasil-perintah-di-atas
NEXT_PUBLIC_SITE_URL=https://hathawayjourney.com
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
CLOUDINARY_FOLDER=hathaway
NEXT_PUBLIC_GA_ID=
```

> 🔒 Jangan pernah commit file berisi nilai asli ke GitHub. File `.env` sudah di-ignore oleh Git; yang ada di repo
> hanya `.env.example` (tanpa rahasia).

---

## 8. Langkah 6 — Domain & SSL

1. **Domain**: saat membuat Node.js Web App, pilih domain Anda (atau pakai domain sementara Hostinger dulu).
   - Domain dibeli di luar Hostinger → arahkan **nameserver** ke Hostinger (hPanel menampilkan nilainya), tunggu
     propagasi (bisa beberapa jam).
2. **SSL**: hPanel → **Security → SSL** → pastikan SSL aktif untuk domain (biasanya otomatis & gratis).
3. Jika domain berubah (misalnya dari domain sementara ke domain final), **perbarui `NEXT_PUBLIC_SITE_URL`**
   lalu simpan (otomatis redeploy).

✅ `https://domain-anda.com` terbuka dengan ikon gembok 🔒.

---

## 9. Langkah 7 — Checklist Setelah Online

Lakukan berurutan:

- [ ] Buka `https://domain-anda.com/admin` → login dengan `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.
- [ ] **Pengaturan → Akun Saya** → ganti password admin.
- [ ] **Pengaturan → Kontak & WhatsApp** → isi nomor WhatsApp admin (format `0812…` atau `62812…`), telepon,
      email, alamat, jam operasional, dan **Google Maps Embed** (Google Maps → Bagikan → Sematkan peta → salin HTML).
- [ ] **Pengaturan → Template Pesan WhatsApp** → sesuaikan kalimat pesan booking bila perlu.
- [ ] **Pengaturan → Media Sosial / Home** → link Instagram/Facebook/YouTube, angka statistik, keunggulan,
      gambar wilayah destinasi.
- [ ] **Kategori Trip** → tambahkan jenis trip (Open Trip, Private Trip, Group Tour, …).
- [ ] **Destinasi** → tambahkan negara/kota beserta wilayahnya.
- [ ] **Paket & Jadwal** → buat paket (status **Published**), lalu di halaman edit paket isi **jadwal**,
      **itinerary**, dan **foto**.
- [ ] **Gallery, Testimoni, FAQ, Profil Perusahaan** → isi konten asli.
- [ ] **Users** → buat akun untuk admin lain (role *Admin*).

**Uji di website publik:**

- [ ] Klik **Booking Sekarang** di detail paket → WhatsApp terbuka ke nomor yang benar dengan pesan berisi nama
      paket, tanggal, peserta, dan link `https://domain-anda.com/...` (bukan `localhost`).
- [ ] Di admin ubah status salah satu jadwal ke **FULL** → di website jadwal tersebut tampil FULL & tidak bisa dipilih.
- [ ] Kirim pesan dari halaman **Kontak** → muncul di admin **Pesan Masuk**.
- [ ] Buka `https://domain-anda.com/sitemap.xml` dan `/robots.txt` → tampil normal.
- [ ] Cek tampilan di HP (menu ☰, filter paket).

**SEO (disarankan):**

- [ ] **Google Search Console** (<https://search.google.com/search-console>) → tambah domain → verifikasi via DNS
      (hPanel → Domains → DNS / Nameservers → tambahkan record TXT) → **Sitemaps** → submit `sitemap.xml`.

---

## 10. Cara Update Website Sehari-hari

**Konten** (paket, jadwal, harga, foto, dll.) → cukup dari **admin panel**, tidak perlu deploy.

**Kode** (tampilan/fitur) → lewat GitHub:

```bash
git checkout -b fitur-baru        # kerjakan di branch terpisah
# ... ubah kode ...
npm run lint && npm run build     # pastikan lolos di komputer sendiri
git push origin fitur-baru        # buat Pull Request, review, lalu merge ke main
```

Setelah merge ke `main`, Hostinger **otomatis build & deploy**. Pantau di **Build logs**.

**Membatalkan update yang bermasalah:** revert commit di GitHub (atau `git revert <commit>` lalu push ke `main`) —
Hostinger akan deploy ulang versi sebelumnya.

---

## 11. Jika Struktur Database Berubah (Migrasi)

Hanya diperlukan bila developer mengubah `src/db/schema.ts`.

1. Developer membuat file migrasi & meng-commit folder `drizzle/`:
   ```bash
   npm run db:generate
   ```
2. **Sebelum** merge ke `main`, jalankan migrasi ke database produksi (aktifkan Remote MySQL sementara seperti
   [5.1](#51-izinkan-komputer-anda-mengakses-database-remote-mysql)):
   ```bash
   DATABASE_URL="mysql://...@srv1234.hstgr.io:3306/..." npm run db:migrate
   ```
3. Merge ke `main` → Hostinger deploy kode baru.
4. Tutup kembali Remote MySQL.

> Urutan ini (migrasi dulu, baru deploy kode) mencegah website error karena kolom/tabel baru belum ada.
> **Backup database dulu** sebelum migrasi (lihat bagian 12).

---

## 12. Backup & Keamanan

**Backup**

- Aktifkan/cek **backup otomatis** di hPanel (menu **Backups** — frekuensi tergantung paket).
- Backup manual sebelum perubahan besar: hPanel → **Databases → phpMyAdmin** → pilih database → **Export** →
  format SQL → simpan file.
- Foto/video yang di-upload tersimpan di **Cloudinary**, bukan di server Hostinger, sehingga aman saat redeploy.

**Keamanan yang sudah ada di aplikasi**

- Password admin di-hash (bcrypt), login dibatasi 10 percobaan gagal / 15 menit per IP.
- Session admin memakai cookie `httpOnly` + `secure`, berlaku 12 jam.
- Setiap aksi admin memeriksa login & role di server; halaman `/admin` tidak diindeks Google.
- Form kontak memiliki validasi, anti-spam (honeypot) dan batas 5 pesan / 10 menit per IP.
- Header keamanan (HSTS, X-Frame-Options, dll.) aktif otomatis.

**Yang perlu Anda jaga**

- Ganti password admin bawaan setelah login pertama; gunakan password berbeda untuk tiap admin.
- Jangan membagikan `SESSION_SECRET`, `CLOUDINARY_API_SECRET`, dan password database.
- Mengganti `SESSION_SECRET` akan membuat semua admin ter-logout (berguna jika dicurigai bocor).
- Tutup **Remote MySQL** jika tidak sedang dipakai.
- Nonaktifkan (bukan hapus) user admin yang sudah tidak bekerja: **Users** → hilangkan centang **Aktif**.

---

## 13. Troubleshooting

Lihat log di dashboard website Hostinger: **Build logs** (saat deploy) dan **Runtime logs** (saat website berjalan).

| Gejala | Kemungkinan penyebab | Solusi |
|---|---|---|
| Deploy gagal di tahap build | Node.js < 20, atau error kode | Set **Node.js version** ke 22/20. Jalankan `npm run build` di komputer untuk melihat error yang sama. |
| Halaman tampil **"Terjadi Kesalahan"** / error 500 | Database tidak terhubung | Cek **Runtime logs**. Pastikan `DATABASE_URL` benar dan memakai `127.0.0.1`. |
| Log: `ECONNREFUSED ::1:3306` | Memakai `localhost` | Ganti host menjadi `127.0.0.1`. |
| Log: `Access denied for user` | Username/password salah atau password belum di-encode | Salin ulang username dari hPanel; encode karakter khusus (lihat 4.1); reset password DB bila perlu. |
| Log: `Table ... doesn't exist` | Migrasi belum dijalankan | Jalankan [Langkah 3](#5-langkah-3--isi-tabel--buat-akun-admin). |
| Log: `SESSION_SECRET must be set` / tidak bisa login | `SESSION_SECRET` kosong/terlalu pendek | Isi minimal 32 karakter (lihat Langkah 5). |
| Login selalu "Email atau password salah" | Akun admin belum dibuat | Jalankan `npm run db:seed -- --admin-only` (Langkah 3). |
| "Terlalu banyak percobaan login" | 10x gagal login | Tunggu 15 menit, atau restart aplikasi. |
| Tombol **Upload** tidak muncul di admin | Variabel Cloudinary belum diisi | Isi ketiga variabel `CLOUDINARY_*`. |
| Upload gagal ("Invalid Signature") | API Secret/Key salah | Salin ulang dari Cloudinary Dashboard. |
| Link di pesan WhatsApp berisi `localhost` | `NEXT_PUBLIC_SITE_URL` belum diisi | Isi domain final, simpan (auto redeploy). |
| Tombol WhatsApp ke nomor `628000000000` | Nomor belum diatur | Admin → **Pengaturan → Kontak & WhatsApp**. |
| Gambar dari situs lain tidak tampil | Domain gambar tidak diizinkan | Upload lewat Cloudinary, atau developer menambahkan domain di `next.config.ts` → `images.remotePatterns`. |
| Perubahan environment variable tidak berlaku | Belum redeploy | Simpan ulang variabel / klik redeploy di dashboard. |
| Gagal `npm run db:migrate` dari komputer (`ETIMEDOUT`) | Remote MySQL belum diizinkan / IP berubah | Tambahkan IP terbaru di **Remote MySQL** (atau *Any Host* sementara). |

---

## 14. Lampiran — Development Lokal

```bash
cp .env.example .env     # isi SESSION_SECRET & SEED_ADMIN_PASSWORD
docker run -d --name hathaway-mysql -e MYSQL_ROOT_PASSWORD=devroot -e MYSQL_DATABASE=hathaway \
  -e MYSQL_USER=hathaway -e MYSQL_PASSWORD=hathaway_dev -p 3307:3306 mysql:8.4
npm install
npm run db:migrate
npm run db:seed          # data contoh + akun admin dari SEED_ADMIN_*
npm run dev              # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

| Script | Fungsi |
|---|---|
| `npm run dev` | Server development |
| `npm run build` / `npm start` | Build & jalankan versi produksi |
| `npm run lint` | Cek kualitas kode |
| `npm run db:generate` | Buat migrasi baru dari perubahan `src/db/schema.ts` |
| `npm run db:migrate` | Terapkan migrasi ke database di `DATABASE_URL` |
| `npm run db:seed` | Isi data contoh + admin (`-- --admin-only` tanpa contoh, `-- --reset` ulang konten — **lokal saja**) |
| `npm run db:studio` | Lihat isi database lewat Drizzle Studio |

**Struktur folder**

```
app/(site)/          halaman publik (Header/Footer/WA floating ada di layout)
app/admin/           admin panel — login + (panel) yang dilindungi
app/api/upload/      signature upload Cloudinary (khusus admin)
proxy.ts             redirect /admin → /admin/login bila belum login
drizzle/             file migrasi SQL (ikut di-commit)
scripts/migrate.ts   runner migrasi
src/db/              schema Drizzle, koneksi, seed
src/server/          queries (baca data), actions (Server Actions), auth (session)
src/lib/             helper: format, whatsapp, settings default, filter paket
src/components/      komponen UI
```

---

*Referensi resmi Hostinger:* [Creating a Node.js App](https://docs.hostinger.com/node.js/creating-an-app) ·
[Environment Variables](https://docs.hostinger.com/node.js/environment-variables) ·
[Connecting MySQL to Node.js](https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/) ·
[Remote MySQL](https://www.hostinger.com/support/1583546-how-to-set-up-remote-mysql-access-in-hostinger/)
>>>>>>> Stashed changes

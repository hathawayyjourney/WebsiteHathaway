# Panduan Aset Gambar (Gemini Nano Banana)

Dokumen ini berisi **31 slot gambar** website beserta prompt siap-copy untuk Gemini. Alurnya:

1. Generate gambar di Gemini memakai prompt di bawah.
2. Simpan file mentah ke folder **`assets-raw/`** di root project dengan nama **sesuai ID**
   (contoh `H1.png`, `B3-asia.png`, `B4-airplane.png`). Format `.png`, `.jpg`, `.jpeg`, atau `.webp`.
3. Jalankan:
   ```bash
   npm run images              # proses semua file yang ada di assets-raw/
   npm run images -- H1 H3     # hanya ID tertentu
   ```
   Script memotong (crop) dan mengecilkan gambar ke ukuran yang tepat, lalu mengubahnya ke WebP. Untuk dekorasi,
   background dihapus jadi transparan; untuk gambar share, logo ditempel otomatis.
4. Cek di `npm run dev`, lalu commit `public/images/` (dan `app/opengraph-image.jpg`, `app/twitter-image.jpg`) dan push.

> **Belum ada file? Tidak masalah.** Slot yang kosong otomatis memakai gambar lama (Home & Paket Tour) atau
> disembunyikan, sehingga website tidak pernah menampilkan gambar rusak. Folder `assets-raw/` tidak ikut ke GitHub.

---

## Tips Gemini

- **Resolusi**: pilih resolusi tertinggi (Nano Banana Pro: 2K/4K). Script yang mengecilkan.
- **Aspect ratio**: set sesuai kolom *Rasio* (di prompt juga sudah disebut).
- **Konsistensi**: generate semua hero (H1–H10) dalam **satu percakapan** dan tambahkan kalimat
  *"Keep the same photographic style, lighting and color grading as the previous images."*
- **Tanpa teks/logo**: semua prompt sudah melarang teks, logo, dan watermark. Jika tetap muncul, minta Gemini
  *"Remove all text and logos from this image."*
- **Revisi cepat**: Gemini bisa mengedit gambar terakhir, misalnya *"move the subject further to the right"* atau
  *"make the center area emptier and calmer"*.
- **Hak cipta & etika**: jangan meminta wajah orang terkenal atau logo maskapai/brand asli.

### Template dasar (sudah termasuk di setiap prompt)

```
Photorealistic cinematic travel photograph, [SUBJEK], [KOMPOSISI], natural soft lighting,
color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents,
high detail, professional DSLR, 35mm lens, shallow depth of field.
No text, no letters, no logos, no watermarks, no brand names. Aspect ratio [RASIO].
```

---

## A. Hero Halaman (P1)

Tampil di belakang judul halaman dengan lapisan navy (opacity ±20%), seperti hero halaman Paket Tour.
**Area tengah harus tenang/kosong** karena ada judul di atasnya; subjek utama di sisi kiri atau kanan.

| ID | Nama file mentah | Rasio | Output | Halaman |
|---|---|---|---|---|
| ~~H1~~ | — | — | diganti H12 | — |
| H12 | `H12.jpg` | ±2:1 | `public/images/home/hero-asia.webp` (maks. 2560×1252) | Home (hero utama) — kolase landmark Asia Tenggara dari klien |
| H2–H10 | `H2.png` … `H10.png` | 21:9 | `public/images/heroes/*.webp` (2400×1000) | Halaman dalam |
| ~~H11~~ | — | — | diganti H13 | — |
| H13 | `H13.jpg` | ±12:5 | `public/images/heroes/asia-landmarks.webp` (maks. 2400×1018) | Paket Tour, Destinasi (+ halaman wilayah), Gallery, Tentang Kami |

> **Catatan:** H2–H5 sudah tidak dipakai. Atas permintaan klien, keempat halaman itu memakai satu gambar
> bersama **H13** (kolase landmark Thailand–Singapura–Malaysia; sebelumnya H11). Prompt H2–H5 di bawah disimpan sebagai arsip.

**H1 — Home** · sisi kiri tertutup gradasi putih dan teks, jadi subjek harus di **kanan**.
```
Photorealistic cinematic travel photograph, view from an airplane window of the aircraft wing above a sea of soft white clouds at golden hour, wing and sun glow placed on the right third, the left half is bright open sky with plenty of empty space, natural soft lighting, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail, professional DSLR, 35mm lens. No text, no letters, no logos, no airline branding, no watermarks. Aspect ratio 16:9.
```

**H2 — Paket Tour** (menggantikan foto sayap pesawat sekarang)
```
Photorealistic cinematic travel photograph, commercial airplane wing slicing through clouds at sunrise, wide panoramic composition, wing on the right third, calm uncluttered center area for overlay text, natural soft lighting, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail, professional DSLR. No text, no letters, no logos, no airline branding, no watermarks. Aspect ratio 21:9.
```

**H3 — Destinasi**
```
Photorealistic cinematic travel photograph, a lone Indonesian traveler with a backpack standing on a cliff viewpoint looking over a turquoise tropical bay with limestone islands, traveler small on the left third, wide panoramic composition, calm uncluttered center area for overlay text, morning light, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail, professional DSLR. No text, no letters, no logos, no watermarks. Aspect ratio 21:9.
```

**H4 — Gallery**
```
Photorealistic cinematic travel photograph, a happy group of Indonesian tourists (some women wearing hijab) taking a group selfie in front of a Japanese temple with red autumn maple leaves in Kyoto, group on the right third, wide panoramic composition, calm uncluttered center area for overlay text, natural candid expressions, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail, professional DSLR. No text, no letters, no logos, no watermarks. Aspect ratio 21:9.
```

**H5 — Tentang Kami**
```
Photorealistic cinematic travel photograph, a friendly Indonesian tour leader holding a small navy blue flag guiding a tour group through a charming European old town street, group on the left third, wide panoramic composition, calm uncluttered center area for overlay text, warm afternoon light, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail, professional DSLR. No text, no letters, no logos, no watermarks. Aspect ratio 21:9.
```

**H6 — Testimoni**
```
Photorealistic cinematic travel photograph, a joyful Indonesian family (mother wearing hijab, father, two children) laughing together on a white sand beach resort, family on the right third, wide panoramic composition, calm uncluttered center area for overlay text, natural candid expressions, soft sunset light, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail, professional DSLR. No text, no letters, no logos, no watermarks. Aspect ratio 21:9.
```

**H7 — FAQ**
```
Photorealistic overhead flat-lay travel photograph, passport, boarding passes, folded paper map, vintage compass, sunglasses and a small notebook arranged along the left and right edges of a deep navy blue desk, the center of the desk left empty for overlay text, soft diffused light, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail. No readable text on documents, no letters, no logos, no watermarks. Aspect ratio 21:9.
```

**H8 — Kontak**
```
Photorealistic cinematic photograph, a smiling Indonesian travel consultant wearing a headset working at a modern bright office desk, a large world map on the wall behind, consultant on the left third, wide panoramic composition, calm uncluttered center area for overlay text, natural soft lighting, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail, professional DSLR. No text, no letters, no logos, no watermarks. Aspect ratio 21:9.
```

**H9 — Booking**
```
Photorealistic cinematic travel photograph, close-up of a hand holding a passport and a boarding pass in front of a large airport window with an airplane on the runway, hand on the right third, wide panoramic composition, calm uncluttered center area for overlay text, morning light, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, shallow depth of field, professional DSLR. No readable text on documents, no letters, no logos, no airline branding, no watermarks. Aspect ratio 21:9.
```

**H10 — Privacy Policy & Terms**
```
Photorealistic minimal photograph, neatly stacked documents, a passport and an elegant pen on a clean navy blue desk, objects on the left third, wide panoramic composition, large calm empty area in the center, soft diffused light, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail. No readable text, no letters, no logos, no watermarks. Aspect ratio 21:9.
```

---

## B. Body Home

| ID | Nama file mentah | Rasio | Output | Posisi |
|---|---|---|---|---|
| ~~B1~~ | — | — | diganti B6 | — |
| B6 | `B6.jpg` | ±18:5 | `home/cta-asia.webp` (maks. 2400×668) | Kanan section "Siap Berpetualang" (sisi kiri memudar) — panorama landmark Asia Tenggara dari klien |
| B2 | `B2.png` | 21:9 | `home/stats-bg.webp` (1600×700) | Latar samar kotak statistik navy |
| B3 | `B3-indonesia.png`, `B3-asia.png`, `B3-eropa.png`, `B3-timur-tengah.png`, `B3-lainnya.png` | 4:5 | `regions/*.webp` (800×1000) | Kartu "Destinasi Populer" |
| B4 | `B4-airplane.png`, `B4-suitcase.png`, `B4-passport.png` | 1:1 | `decor/*.webp` (800×800, transparan) | Aksen di samping judul section (desktop saja) |
| B5 | `B5.png` | 21:9 | `decor/world-map.webp` (2400×1000) | Pola samar di belakang "Paket Rekomendasi" |

**B1 — CTA**
```
Photorealistic cinematic travel photograph, an Indonesian couple seen from behind sitting on a hilltop watching dozens of colorful hot air balloons over Cappadocia at sunrise, couple on the right side, soft warm light, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail, professional DSLR. No text, no letters, no logos, no watermarks. Aspect ratio 4:3.
```

**B2 — Latar statistik** (dipakai sangat samar, jadi detail tidak terlalu penting)
```
Photorealistic photograph, view from an airplane window at night over a glowing city with scattered golden lights, deep navy blue sky, soft bokeh, moody and calm, high detail. No text, no letters, no logos, no watermarks. Aspect ratio 21:9.
```

**B3 — Kartu wilayah** (5 gambar; teks nama wilayah ditaruh di bagian bawah kartu, jadi bagian bawah sebaiknya agak gelap)
```
Photorealistic cinematic travel photograph, [SUBJEK], vertical composition with the main landmark in the upper two thirds and a darker lower area, vibrant but natural colors, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail, professional DSLR. No text, no letters, no logos, no watermarks. Aspect ratio 4:5.
```
| ID | `[SUBJEK]` |
|---|---|
| B3-indonesia | `a Balinese temple gate surrounded by lush green rice terraces at sunrise` |
| B3-asia | `a five-story Japanese pagoda with Mount Fuji and pink cherry blossoms` |
| B3-eropa | `the Eiffel Tower in Paris seen from a tree-lined street at golden hour` |
| B3-timur-tengah | `the modern Dubai skyline rising beyond golden desert dunes at sunset` |
| B3-lainnya | `overwater bungalows on a turquoise lagoon in the Maldives` |

**B4 — Dekorasi transparan** (3 gambar). Pakai **latar hijau polos** agar mudah dihapus otomatis oleh script
(lebih aman daripada latar putih untuk objek berwarna putih seperti pesawat).
```
Photorealistic product photograph of [OBJEK], isolated single object, centered, fully visible with nothing cut off, on a plain solid flat bright green (#00B140) studio background, soft even lighting, high detail. No shadow on the background, no text, no letters, no logos, no watermarks. Aspect ratio 1:1.
```
| ID | `[OBJEK]` |
|---|---|
| B4-airplane | `a white commercial passenger airplane flying, side three-quarter view, no airline livery` |
| B4-suitcase | `a navy blue hard-shell travel suitcase with a few colorful blank travel stickers` |
| B4-passport | `a navy blue passport with a boarding pass tucked inside and a small red ribbon, blank cover with no text` |

> Jika hasil potongan otomatis kurang rapi, hapus background secara manual (mis. remove.bg) lalu simpan sebagai
> PNG transparan dengan nama yang sama di `assets-raw/`. Script mendeteksi PNG transparan dan tidak memotongnya lagi.

**B5 — Pola peta dunia**
```
Minimal flat world map made of small evenly spaced light grey dots on a pure white background, all continents visible, centered, clean vector-like style, no borders, no labels. No text, no letters, no logos, no watermarks. Aspect ratio 21:9.
```

---

## C. Gambar Informatif (P2)

| ID | Nama file mentah | Rasio | Output | Posisi |
|---|---|---|---|---|
| C1 | `C1.png` | 4:3 | `content/about-company.webp` | Foto utama Tentang Kami |
| C2 | `C2-vision.png`, `C2-mission.png` | 4:3 | `content/about-*.webp` | Tekstur kartu Visi (navy) & Misi (merah) |
| C3 | `C3.png` | 4:3 | `content/booking-help.webp` | Atas kartu "Cara Booking" |
| C4 | `C4.png` | 16:9 | `content/contact-office.webp` | Atas kartu "Informasi Kontak" |
| C5 | `C5.png` | 4:3 | `content/faq-help.webp` | Kartu "Masih ada pertanyaan?" di FAQ |
| C6 | `C6.png` | 4:3 | `content/not-found.webp` | Halaman 404 |
| C7 | `C7.png` | 1:1 | `content/empty-search.webp` | Saat filter paket tidak menemukan hasil |

> **C1** hanya dipakai selama admin belum mengganti foto perusahaan di **Pengaturan**. Foto tim asli yang
> di-upload admin selalu diprioritaskan.

**C1 — Tim perusahaan**
```
Photorealistic photograph, a friendly team of five Indonesian travel agency staff (some women wearing hijab) smiling together in a modern bright office with travel posters without text, natural candid expressions, soft natural window light, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, professional DSLR. No text, no letters, no logos, no watermarks. Aspect ratio 4:3.
```

**C2-vision** (dipakai sangat samar di kartu Visi)
```
Photorealistic photograph, sunrise over layered mountain ridges with a soft glowing horizon, wide calm composition, high detail. No text, no letters, no logos, no watermarks. Aspect ratio 4:3.
```

**C2-mission** (dipakai sangat samar di kartu Misi)
```
Photorealistic photograph, close-up of hands planning a trip route on a paper world map with pins and a compass, top-down view, high detail. No readable text, no letters, no logos, no watermarks. Aspect ratio 4:3.
```

**C3 — Cara Booking**
```
Photorealistic photograph, a smiling young Indonesian woman wearing hijab chatting on her smartphone while planning a holiday at a cozy cafe table with a small travel guidebook, phone screen not visible, natural light, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, professional DSLR. No text, no letters, no app interface, no logos, no watermarks. Aspect ratio 4:3.
```

**C4 — Kantor / Kontak**
```
Photorealistic photograph, a welcoming Indonesian travel agency receptionist greeting a customer at a modern front desk, bright clean office with plants, natural candid expressions, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, professional DSLR. No text, no letters, no logos, no signage, no watermarks. Aspect ratio 16:9.
```

**C5 — Bantuan FAQ**
```
Photorealistic photograph, a friendly Indonesian customer service agent with a headset smiling at a laptop in a bright office, natural candid expression, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, professional DSLR. No text, no letters, no screen content, no logos, no watermarks. Aspect ratio 4:3.
```

**C6 — Halaman 404**
```
Photorealistic photograph, a slightly confused but smiling traveler with a backpack holding an open paper map at a quiet crossroads with signposts that have no text, soft afternoon light, light and friendly mood, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, professional DSLR. No text, no letters, no logos, no watermarks. Aspect ratio 4:3.
```

**C7 — Paket tidak ditemukan**
```
Photorealistic photograph, an open empty navy blue suitcase on a light bed with a folded map and a magnifying glass beside it, soft daylight, minimal and clean, high detail. No text, no letters, no logos, no watermarks. Aspect ratio 1:1.
```

---

## D. SEO & Admin

| ID | Nama file mentah | Rasio | Output | Dipakai di |
|---|---|---|---|---|
| D1 | `D1.png` | 16:9 | `app/opengraph-image.jpg` + `app/twitter-image.jpg` (1200×630, logo ditempel otomatis) | Preview saat link dibagikan di WhatsApp, Facebook, Instagram, X |
| D2 | `D2.png` | 16:9 | `public/images/admin/login-bg.webp` (1920×1080) | Latar halaman login admin |

**D1 — Gambar share** (logo Hathaway Journey otomatis ditempel di pojok kiri atas, jadi area itu sebaiknya tenang)
```
Photorealistic cinematic travel photograph, a commercial airplane flying over a turquoise tropical island with white sand beaches, airplane and island on the right half, calm open sky on the upper-left area, vibrant inviting colors, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail, professional DSLR. No text, no letters, no logos, no airline branding, no watermarks. Aspect ratio 16:9.
```

**D2 — Login admin**
```
Photorealistic cinematic photograph, a modern airport terminal at dusk with large glass windows and airplanes outside, soft blurred lights, calm and elegant, color palette harmonizing with deep navy blue (#082A63) and warm red (#D71920) accents, high detail. No text, no letters, no logos, no signage, no watermarks. Aspect ratio 16:9.
```

---

## Checklist

| Prioritas | ID | Status |
|---|---|---|
| P1 | H1, H2, H3, H4, H5, H6, H7, H8, H9, H10 | ☐ |
| P1 | B1, B2, B3-indonesia, B3-asia, B3-eropa, B3-timur-tengah, B3-lainnya | ☐ |
| P1 | D1 | ☐ |
| P2 | B4-airplane, B4-suitcase, B4-passport, B5 | ☐ |
| P2 | C1, C2-vision, C2-mission, C3, C4, C5, C6, C7 | ☐ |
| P2 | D2 | ☐ |

## Catatan teknis

- Daftar slot, ukuran, dan teks alt ada di [`src/lib/image-assets.ts`](../src/lib/image-assets.ts). Untuk menambah
  slot baru, tambahkan entri di file tersebut lalu pakai `getImage('namaKey')` di komponen.
- Gambar wilayah (B3) dan foto perusahaan (C1) juga bisa diatur admin di **Pengaturan**. Urutan prioritasnya:
  gambar yang di-upload admin → file di `public/images` → gambar default lama.
- Ukuran ideal hero: < 300 KB. Script memberi peringatan jika lebih besar.
- Mengganti gambar: timpa file di `assets-raw/`, jalankan `npm run images -- <ID>`, lalu commit dan push.

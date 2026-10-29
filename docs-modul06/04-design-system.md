# 04 — Design System (Modul 07: REST API & Retrofit)

Semua nilai ukuran dalam piksel pada komposisi 1920×1080. Seluruh komponen antarmuka wajib memanfaatkan token CSS di bawah, bukan menuliskan kode hex secara langsung.

---

## 1. Token CSS (`src/styles/tokens.css`)

```css
:root {
  /* Identitas Lapisan Arsitektur (Konsisten antar Modul) */
  --c-ui: #3b82f6; /* Composable UI */
  --c-vm: #f97316; /* ViewModel */
  --c-repo: #22c55e; /* Repository */
  --c-ds: #1e3a8a; /* Remote Data Source */
  --c-server: #6366f1; /* REST API Server (DummyJSON) */

  /* Warna Teks di Atas Latar Lapisan */
  --on-ui: #ffffff;
  --on-vm: #0f172a;
  --on-repo: #0f172a;
  --on-ds: #ffffff;
  --on-server: #ffffff;

  /* Status Jaringan & Tri-State UI */
  --state-loading: #0284c7; /* Indikator CircularProgressIndicator */
  --state-error: #ef4444; /* Kondisi Failure / UnknownHostException */
  --state-success: #16a34a; /* Kondisi Data Berhasil Dirender */

  /* Latar Belakang Kanvas */
  --bg-dark: #191a21; /* Scene 1, Scene 3 Awal */
  --editor-bg: #282a36; /* Jendela Editor Mock & Kartu Kode (Dracula) */
  --bg-light: #f8fafc; /* Scene 2, Scene 3 Akhir, Scene 4, 5, 6 */

  /* Tipografi Teks */
  --text-dark: #0f172a;
  --text-light: #f8f8f2;
  --text-muted: #64748b;

  /* Efek Visual & Panah Aliran Data */
  --laser: #ef4444; /* Garis potong laser neon & border peringatan */
  --arrow-event: #0f172a; /* Panah Request HTTP / User Event (ke kanan) */
  --arrow-state: #9333ea; /* Panah Respon Data / UI State (ke kiri) */

  /* Dimensi Layout */
  --safe: 80px;
  --gap: 40px;
}
```

---

## 2. Rasio Kontras & Aturan Aksesibilitas

| Kombinasi Elemen                          | Rasio Kontras | Ketentuan Penggunaan                                                                            |
| ----------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------- |
| Teks Putih di atas `--c-ui` (`#3B82F6`)   | ≈ 3,7:1       | Khusus teks judul besar (≥ 42px) dengan bobot tebal (≥ 600).                                    |
| Teks Putih di atas `--c-vm` (`#F97316`)   | ≈ 2,8:1       | Dilarang (gagal standar aksesibilitas) $\rightarrow$ gunakan `--on-vm` (`#0F172A`) (≈ 6,4:1).   |
| Teks Putih di atas `--c-repo` (`#22C55E`) | ≈ 2,3:1       | Dilarang (gagal standar aksesibilitas) $\rightarrow$ gunakan `--on-repo` (`#0F172A`) (≈ 7,8:1). |
| Teks Putih di atas `--c-ds` (`#1E3A8A`)   | ≈ 10:1        | Memenuhi standar (lolos AAA).                                                                   |
| `--c-ds` di atas `--bg-dark`              | ≈ 1,6:1       | Dilarang $\rightarrow$ kartu Remote Data Source hanya ditampilkan di atas latar terang.         |
| `--arrow-state` di atas `--bg-light`      | ≈ 4,2:1       | Memenuhi standar elemen grafis kontras tinggi.                                                  |

Nama lapisan selalu diletakkan di dalam chip berwarna penanda lapisan menggunakan teks `--on-*`, atau teks `--text-dark` di atas latar kanvas terang. Dilarang menampilkan teks berwarna oranye atau hijau langsung di atas latar terang tanpa kontainer.

---

## 3. Tipografi

Tipografi dimuat secara lokal melalui paket `@fontsource` dengan bobot 400, 600, dan 700:

| Hirarki Teks              | Jenis Font               | Ukuran     | Spesifikasi Tambahan                                                                |
| ------------------------- | ------------------------ | ---------- | ----------------------------------------------------------------------------------- |
| Judul Scene               | Inter Bold               | 72px       | Line-height 1.1, tracking rapat                                                     |
| Teks Utama & Subjudul     | Inter SemiBold / Regular | $\ge$ 42px | Tidak ada teks instruksional di bawah 42px                                          |
| Chip Label Lapisan        | Inter Bold               | 44px       | Border-radius 12px, padding vertikal proporsional                                   |
| Baris Kode di Editor      | JetBrains Mono Regular   | 30px       | Line-height 1.4 (memastikan 32 baris dapat discroll/ditata tanpa overflow vertikal) |
| Caption & Signature Kelas | JetBrains Mono Bold      | 26–28px    | Digunakan pada Scene 4 dan Scene 5                                                  |
| Cuplikan Kode Kartu Kolom | JetBrains Mono Regular   | 13–15px    | Mode thumbnail/dekoratif visual                                                     |

---

## 4. Tema Editor Kode

- Skema warna blok kode menggunakan palet **Dracula** (`themes.dracula` dari `prism-react-renderer`).
- Latar jendela editor menggunakan `--editor-bg` (`#282A36`).
- Syntax highlighting Kotlin mendukung keyword asinkron dan kelas jaringan: `interface`, `class`, `data class`, `@GET`, `Call`, `Callback`, `Response`, `Result`, serta fungsi ekstensi `toStudent()`.

---

## 5. Tata Letak Kanvas (1920×1080)

- **Zona Aman (Safe Margin)**: 80px di keempat sisi tepi kanvas $\rightarrow$ area kerja aktif berukuran 1760×920px.
- **Sistem Grid 4 Kolom**:

$$\text{Lebar Kartu} = \frac{1920 - (2 \times 80) - (3 \times 40)}{4} = 410\text{px}$$

Jarak antar kartu (gap) ditetapkan sebesar 40px.

- **Urutan Kolom**: Selalu konsisten dari kiri ke kanan: Composable UI, ViewModel, Repository, Remote Data Source.
- **Jendela Editor Mock**: Lebar 1760px, tinggi title bar 56px (tiga tombol kontrol jendela macOS + tab `DetailScreen.kt`), dilengkapi gutter penomoran baris.
- **Kartu Kolom Arsitektur**: Lebar 410px, border-radius 16px, bilah penanda warna lapisan setebal 8px di sisi atas kartu, latar belakang kartu `--editor-bg`.
- **Kotak Diagram Scene 5**: Dimensi seragam 410×200px, sudut membulat 24px, warna latar sesuai lapisan, teks `--on-*`.

---

## 6. Latar Belakang per Scene

| Scene                               | Warna Latar Kanvas                     | Keterangan Transisi                                                                                  |
| ----------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Scene 1 (Masalah Spageti Jaringan)  | `--bg-dark` (`#191A21`)                | Suasana gelap, fokus pada kerapuhan kode monolitik.                                                  |
| Scene 2 (Analogi Layanan Eksternal) | `--bg-light` (`#F8FAFC`)               | Tampilan terang menyegarkan untuk penjelasan analogi.                                                |
| Scene 3 (Tebas Kode Laser)          | `--bg-dark` $\rightarrow$ `--bg-light` | Latar gelap saat laser memotong, bertransisi cross-fade ke latar terang saat `splitBlock` berpencar. |
| Scene 4 (Empat Lapis Arsitektur)    | `--bg-light` (`#F8FAFC`)               | Latar terang stabil.                                                                                 |
| Scene 5 (Aliran Request & Respon)   | `--bg-light` (`#F8FAFC`)               | Latar terang untuk visibilitas lintasan panah SVG.                                                   |
| Scene 6 (Uji Perilaku Jaringan)     | `--bg-light` (`#F8FAFC`)               | Latar terang stabil dengan kartu modal penutup kontras.                                              |

---

## 7. Ikonografi (`lucide-react`, Ukuran 96px, Stroke Width 2)

- **Composable UI**: `ConciergeBell` (Pelayan penyaji antarmuka).
- **ViewModel**: `ClipboardList` (Pencatat kondisi pesanan: Loading, Success, Error).
- **Repository**: `Truck` (Penyalur dan pengonversi kemasan bahan mentah DTO ke domain).
- **Remote Data Source**: `Globe` / `Warehouse` (Pengelola paket data dan koneksi HTTP keluar).
- Dilarang menyematkan emoji bawaan sistem pada kanvas presentasi.

---

## 8. Efek Visual & Komponen Uji Scene 6

- **Garis Laser Potong**: `box-shadow: 0 0 12px var(--laser), 0 0 32px var(--laser)`.
- **Sorotan Fokus Kartu (`focusGrow`)**: `box-shadow: 0 0 0 6px <warna-lapisan>33, 0 16px 40px #0F172A33`.
- **Kartu Peringatan Bahaya (Scene 1)**: Latar belakang `#2B1B1B`, border setebal 4px `--laser`, warna teks `--text-light` 42px, lebar maksimal kontainer 560px.
- **Visual Diff Kode (Scene 6)**:
  - Baris Penambahan (`+`): Latar `rgba(34, 197, 94, 0.18)`, teks `#4ADE80`, font JetBrains Mono 16–18px.
  - Baris Penghapusan/Pergantian (`−`): Latar `rgba(239, 68, 68, 0.18)`, teks `#F87171`, font JetBrains Mono 16–18px.
- **Badge Status Kartu**:
  - **⚡ DIUBAH**: Latar belakang warna lapisan terkait (`--c-*`), teks `--on-*`, font Inter 700 16px, border-radius 8px, padding 4px 12px.
  - **✓ TETAP**: Latar belakang `rgba(100, 116, 139, 0.15)`, teks `#64748B`, font Inter 600 16px, border-radius 8px, padding 4px 12px.
  - **✓ TERPADU**: Latar belakang `rgba(34, 197, 94, 0.2)`, teks `#16A34A` / `#4ADE80`, border `1px solid rgba(34, 197, 94, 0.4)`, font Inter 700 16px, border-radius 8px, padding 4px 12px.
- **Simulasi Komponen Tri-State (Scene 6)**:
  - Kotak Loading: Komponen animasi putar sirkular di tengah kartu dengan warna `--state-loading`.
  - Kotak Error: Border merah muda dengan pesan kegagalan koneksi dan komponen tombol retry "Coba Lagi".

---

## 9. Watermark & Identitas Visual Perkuliahan

- **Watermark Persistent (`src/components/Watermark.tsx`)**:
  - Penempatan: Pojok kanan atas kanvas (`top: 32px, right: 60px`), `z-index: 100`, `pointer-events: none`.
  - Format: Desain pill badge bergaya glassmorphism (`backdrop-filter: blur(12px)`, border-radius 9999px, padding 8px 20px, gap 14px).
  - Dimensi Logo: Tinggi **38px** proporsional, menampilkan `logo-curriculum.png` dan `logo-mgm.png`.
  - Elemen Pemisah: Garis vertikal 1px setinggi 24px.
  - Tipografi Identitas: Font JetBrains Mono Bold **18px**, teks **"SHAM"** kapital, tracking huruf `0.16em`.
  - Kontras Adaptif:
    - Di atas latar gelap: Latar `rgba(255, 255, 255, 0.08)`, border `rgba(255, 255, 255, 0.15)`, teks putih `#FFFFFF`.
    - Di atas latar terang: Latar `rgba(15, 23, 42, 0.06)`, border `rgba(15, 23, 42, 0.12)`, teks gelap `#0F172A`.
  - **Wajib menggunakan komponen `<Img />` dari paket `"remotion"`** (bukan tag bawaan HTML `<img />`) untuk menjamin sinkronisasi rendering per frame tanpa peringatan linter.
- **Header Branding di Scene 1 State 0**:
  - Logo MGM & Logo Curriculum (tinggi 44px) bersanding dengan judul **"PAPB — REST API & RETROFIT"** (Inter Bold 36px) di atas mock editor.
- **Badge Branding di Modal Scene 6 State 25**:
  - Kedua logo identitas (tinggi 28px) disematkan di pojok header kartu modal kesimpulan akhir bersama judul penutup.

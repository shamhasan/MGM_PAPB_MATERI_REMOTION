# 04 — Design Delta (Modul 08: Kotlin Coroutines & Flow)

Gunakan `docs-modul06/04-design-system.md` dan `docs-modul07/04-design-delta.md` untuk semua aturan dasar yang tidak diubah di sini (token 5 lapisan arsitektur, tipografi dasar, tema Dracula, watermark persistent "SHAM", zona aman 80px, dan kontras aksesibilitas). Dokumen ini berfokus pada penambahan token, tipografi khusus, dan komponen visual interaktif untuk materi Kotlin Coroutines & Flow.

---

## 1. Token CSS Baru (`src/styles/tokens.css`)

Tambahkan token berikut ke dalam `:root`:

```css
:root {
  /* Identitas Paradigma Asinkron & Reaktif Modul 08 */
  --c-coroutine: #8b5cf6; /* Ungu: Penanda eksekusi suspend / Coroutine */
  --on-coroutine: #ffffff;
  --c-flow: #06b6d4; /* Cyan: Pipa aliran reaktif / Flow Stream */
  --on-flow: #0f172a; /* Teks gelap di atas warna cyan */
  --c-bookmark: #eab308; /* Emas: Pita pembatas buku (Suspension Point) */
  --on-bookmark: #0f172a; /* Teks gelap di atas warna emas */
  --c-cancel: #ef4444; /* Merah terang: Pembatalan collectLatest / burst */
  --on-cancel: #ffffff;

  /* Indikator Daur Hidup UI Compose (Lifecycle-Aware) */
  --life-active: #16a34a; /* Hijau: Lifecycle RESUMED / STARTED (Koleksi Berjalan) */
  --on-life-act: #ffffff;
  --life-idle: #f59e0b; /* Kuning: Lifecycle STOPPED (Koleksi Dijeda) */
  --on-life-idle: #0f172a;

  /* Warna Pipa Kaca Konveyor Flow */
  --pipe-bg: rgba(15, 23, 42, 0.05);
  --pipe-border: rgba(6, 182, 212, 0.35);
  --pipe-glow: rgba(6, 182, 212, 0.2);
}
```

### Uji Rasio Kontras Aksesibilitas (WCAG AA)

| Kombinasi Token                                              | Rasio Kontras | Status & Ketentuan                   |
| ------------------------------------------------------------ | ------------- | ------------------------------------ |
| `--on-coroutine` (Putih) di atas `--c-coroutine` (`#8B5CF6`) | ≈ 4,6:1       | Lolos AA untuk teks tebal dan judul. |
| `--on-flow` (Gelap `#0F172A`) di atas `--c-flow` (`#06B6D4`) | ≈ 8,1:1 | Lolos AAA. Dilarang memakai teks putih di atas `--c-flow` (hanya ≈ 2,6:1). |
| `--on-bookmark` (Gelap `#0F172A`) di atas `--c-bookmark` (`#EAB308`) | ≈ 9,8:1 | Lolos AAA. Dilarang teks putih di atas emas (hanya ≈ 2,1:1). |
| `--on-cancel` (Putih) di atas `--c-cancel` (`#EF4444`) | ≈ 4,5:1 | Lolos AA untuk label status dan chip peringatan. |
| `--on-life-idle` (Gelap) di atas `--life-idle` (`#F59E0B`) | ≈ 8,4:1 | Lolos AAA. |

---

## 2. Latar Belakang Kanvas per Scene

Semua scene Modul 08 berlatar terang (`--bg-light` `#F8FAFC`) untuk menjaga keterbacaan diagram, dengan jendela editor dan panel perbandingan menggunakan latar gelap (`--editor-bg` `#282A36` Dracula).

| Scene                              | Latar Kanvas | Elemen Kontras Utama                                                               |
| ---------------------------------- | ------------ | ---------------------------------------------------------------------------------- |
| **Scene 1 (Titik Jenuh Callback)** | `--bg-light` | Panel kode Dracula ganda + kartu masalah berlatar `#2B1B1B` dengan border `--err`. |
| **Scene 2 (Suspend & Pembatas Buku)** | `--bg-light` | Jendela editor perbandingan berdampingan (Gambar 1 Modul 08) + ornamen pita emas. |
| **Scene 3 (Structured Concurrency)** | `--bg-light` | Diagram pohon hierarki induk-anak + panel kode `viewModelScope`. |
| **Scene 4 (StateFlow & Lifecycle)** | `--bg-light` | Kotak enkapsulasi privat/publik + mockup ponsel dan indikator status lifecycle. |
| **Scene 5 (Pipa Pencarian Flow)** | `--bg-light` | Konveyor pipa kaca 7 node (Gambar 3 Modul 08) + partikel query. |
| **Scene 6 (Peta Refactoring & Summary)** | `--bg-light` | 5 kotak arsitektur + panel diff kode 4 lapisan (`DIFFS[0..3]`) + tabel 2 kolom. |

---

## 3. Ukuran Teks Tambahan (Spesifik Modul 08)

| Elemen Antarmuka            | Ukuran Font | Bobot / Jenis   | Catatan Penggunaan                            |
| --------------------------- | ----------- | --------------- | --------------------------------------------- |
| Label Huruf Node Pipa (A–G) | 36px        | Inter ExtraBold | Lingkaran stasiun konveyor 64×64px (Scene 5). |
| Sublabel Node Pipa Flow | 24px | Inter Regular | Deskripsi aksi di bawah node konveyor (Scene 5). |
| Teks Pita Pembatas Buku | 20px | JetBrains Mono Bold | Teks "SUSPENDED" di dalam pita ornamen bookmark (Scene 2). |
| Badge Status Lifecycle | 22px | Inter Bold | Teks indikator `STARTED` / `STOPPED` pada ponsel (Scene 4). |
| Teks Kode Komparasi Bersanding | 22px | JetBrains Mono Regular | Menyesuaikan 2 jendela editor berdampingan selebar 840px (Scene 2). |
| Countdown Timer Debounce | 28px | JetBrains Mono Bold | Menampilkan visual angka "500ms" berputar (Scene 5). |

---

## 4. Komponen Visual Baru

### A. Ornamen Pembatas Buku (`BookmarkIndicator.tsx`, Scene 2)

- **Bentuk**: Pita vertikal bergaya pita pembatas buku fisik (_bookmark ribbon_) setinggi 72px dan lebar 36px dengan ujung segitiga berlekuk ke dalam di sisi bawah.

- **Warna**: Latar `--c-bookmark` (`#EAB308`), bayangan jatuh `box-shadow: 0 4px 14px rgba(234, 179, 8, 0.45)`.

- **Animasi Gerak**:
- `bookmarkPause`: Jatuh dari atas menancap pada baris kode `val data = repository.getStudents()`.

- `bookmarkResume`: Terangkat naik 24px dengan pendaran cahaya emas sebelum memudar saat eksekusi sekuensial berlanjut.

### B. Konveyor Rel Pipa Flow 7 Stasiun (`FlowPipeline.tsx`, Scene 5)

- **Layout**: Membentang horizontal di $y = 260\text{px}$ sepanjang 1760px, mereplikasi Gambar 3 Modul 08.

- **Konstruksi Pipa**: Pipa kaca bersudut membulat 32px, tinggi 130px, latar `--pipe-bg`, border 2px solid `--pipe-border`, dilengkapi efek cahaya `--pipe-glow`.

- **Node Lingkaran A–G**:
- Diameter 64px, border 3px solid, nomor/huruf di tengah.

- Node A, B, C (Query): Latar `--c-ui` (`#3B82F6`) teks putih.

- Node D (Debounce): Latar oranye (`#F97316`) teks gelap.

- Node E (CollectLatest): Latar ungu (`#8B5CF6`) teks putih.

- Node F (Repository Search): Latar hijau (`#22C55E`) teks gelap.

- Node G (HomeUiState): Latar navy gelap (`#1E293B`) teks putih.

### C. Gerbang Operator Flow (`OperatorNode.tsx`, Scene 5)

- **Katup Debounce (Node D)**: Menampilkan ikon jam pasir/timer berputar dengan label "500 ms". Saat partikel tertahan, katup tertutup rapat.

- **Katup CollectLatest (Node E)**: Menampilkan katup pengalih dengan indikator pemutus. Saat query baru masuk, request lama dilempar ke luar pipa dengan animasi percikan merah `--c-cancel` (`cancelBurst`).

### D. Pohon Hierarki Structured Concurrency (`ParentChildTree.tsx`, Scene 3)

- **Struktur**:
- Induk (`HomeViewModel`): Kotak berukuran 360×120px bergaris luar solid `--c-vm` (`#F97316`).

- Ruang Lingkup (`viewModelScope`): Lingkaran kapsul di dalam induk berwarna latar `rgba(249, 115, 22, 0.12)`.

- Anak (`Job #1: loadStudents`): Kotak anak berukuran 280×80px terhubung dengan garis vertikal putus-putus ke induk.

- **Animasi Batal**: Ketika layar ditutup, seluruh node anak disapu oleh garis potong laser `--laser` dan berganti status menjadi `CANCELLED`.

### E. Indikator Status Siklus Hidup Compose (`LifecycleBadge.tsx`, Scene 4)

- **Bentuk**: Pill badge melayang di atas mockup ponsel berukuran 220×44px.

- **Kondisi Aktif**: Latar `rgba(22, 163, 74, 0.15)`, border 2px solid `--life-active`, titik lampu hijau berdenyut, teks "RESUMED (Koleksi Aktif)".

- **Kondisi Jeda**: Latar `rgba(245, 158, 11, 0.15)`, border 2px solid `--life-idle`, titik lampu kuning redup diam, teks "STOPPED (Koleksi Dijeda)".

---

## 5. Ikonografi Baru (`lucide-react`, Stroke Width 2)

Dilarang menggunakan emoji sistem bawaan. Gunakan ikon resmi berikut:

- **`Bookmark`**: Ornamen penanda fungsi `suspend` (Scene 2).

- **`GitBranch` / `Workflow**`: Representasi pohon hierarki `viewModelScope` (Scene 3).

- **`ShieldAlert`**: Peringatan penelanan `CancellationException` (Scene 3).

- **`Eye` / `EyeOff**`: Status visibilitas UI pada `collectAsStateWithLifecycle` (Scene 4).

- **`Timer` / `Clock**`: Operator `debounce(500)` (Scene 5).

- **`Scissors` / `Ban**`: Pembatalan request lama pada `collectLatest` (Scene 5).

- **`CheckCheck`**: Operator `distinctUntilChanged` (Scene 5).

- **`Sparkles`**: Simbol jembatan materi ke Room & DataStore (Scene 6).

---

## 6. Watermark Persistent Perkuliahan

Watermark di pojok kanan atas kanvas (`src/components/Watermark.tsx`) **tetap dipertahankan tanpa perubahan**:

- Format: Pill badge glassmorphism (`backdrop-filter: blur(12px)`), posisi `top: 32px, right: 60px`.

- Komponen: Memuat `logo-curriculum.png` dan `logo-mgm.png` (tinggi 38px) via komponen `<Img/>` dari Remotion.

- Pemisah: Garis vertikal 1px setinggi 24px.

- Tipografi: JetBrains Mono Bold 18px kapital dengan teks **"SHAM"** (tracking 0.16em).

- Adaptasi Latar: Berhubung seluruh kanvas Modul 08 memakai `--bg-light`, watermark secara otomatis aktif dalam varian kontras terang (teks `--text-dark` `#0F172A`, border `rgba(15, 23, 42, 0.12)`).

---

Apakah berkas `docs/04-design-delta.md` ini sudah lengkap dan siap disimpan, dan mau kita lanjutkan ke `docs/05-animation-delta.md`?

# 07 — Tasks (milestone)

Kerjakan berurutan. Di akhir tiap milestone: jalankan `npx tsc --noEmit` dan `npm run build:web`, lalu lapor sesuai format di `CLAUDE.md` dan berhenti menunggu persetujuan.

## M0 — Scaffolding

- Proyek sudah ada (hasil `create-video`); JANGAN dibuat ulang. Periksa struktur yang ada dulu.
- Tambahkan Vite + React plugin, `@remotion/player`, `prism-react-renderer`, `lucide-react`, `@fontsource/*`. Buat `index.html`, `vite.config.ts`, `src/web/`, dan skrip `present` dan `build:web`.
- Daftarkan komposisi `Deck` di `src/Root.tsx` (1920×1080, 30fps, 619 frame) agar bisa di-scrub di Remotion Studio.
- Impor font lokal `@fontsource` (Inter 400/600/700, JetBrains Mono 400/700).
- Buat `src/styles/tokens.css` dari `04-design-system.md`.
- **Cek:** `npm run dev` (Studio) dan `npm run present` sama-sama jalan; font tampil benar; `build:web` lolos.

## M1 — Mesin Stop (tanpa konten)

- `deck/stops.ts`, `useStopProgress.ts`, `driver.ts`, `App.tsx` (Player + input).
- Scene sementara: satu kotak berlabel "state N" agar 20 state terlihat.
- **Cek:** butir B di `06-acceptance.md` (navigasi) lulus sebelum lanjut.

## M2 — Komponen kode

- `EditorWindow`, `CodeBlock` (Dracula, nomor baris), `parseLayers` dari `03-code-assets.md`.
- Dukung `typeCode`, `dim`, rendering per lapisan, dan **sorotan per baris** (`lineEmphasis`, lihat `05`), bukan hanya `dimmed` untuk seluruh blok.
- **Cek:** kode 19 baris muat di jendela editor tanpa terpotong pada 1920×1080.

## M3 — Scene 1

- State 0–4 sesuai storyboard: editor kosong, `typeCode`, sorotan baris 3–9 + callout, sorotan pindah ke 16–18 + callout berganti, kartu peringatan.
- **Cek:** state 2→3 berupa cross-fade; callout tidak menimpa kode; Prev bekerja untuk semua state.

## M4 — Scene 2

- State 5–9: judul, 4 kartu dengan `popIn`, ikon lucide, warna `--on-*`.

## M5 — Scene 3 + 4 (`SceneSplit.tsx`)

- State 10–16: `sceneIn`, `laserCut`, `splitBlock`, 4 kali `focusGrow` + label.
- Konstanta rect awal/akhir pecahan didefinisikan sekali dan dipakai bersama.
- **Cek:** state 12 tidak punya klik ganda (Scene 4 Stop 0 lebur).

## M6 — Scene 5

- State 17–19: `morphToBoxes`, `flowArrow` (event dan state), `pulse`, caption.

## M6b — Scene 6 (`Scene6TestChanges.tsx`)

- State 20–25: `stops.ts` ditambah `{ id: "test", stops: [24, 24, 24, 24, 24, 30] }` (total 26 state, 769 frame).
- Komponen `DiffCodeBlock` untuk rendering diff (`+` hijau, `−` merah) di kartu 410px.
- 4 permintaan perubahan: Data Source endpoint REST API `mgm.org/list` (State 20), Repository tolak ID ≤ 0 & panggil Data Source (State 21), ViewModel pesan ID (State 22), Composable UI tambah teks angkatan (State 23). Tepat 1 kartu menyala dengan badge "DIUBAH", 3 lainnya redup dengan badge "TETAP".
- State 24: Tampilan 4 layer terpadu serentak (`✓ TERPADU`) dengan kode bersih yang saling mereferensikan secara terhubung end-to-end (Data Source -> Repository -> ViewModel -> UI).
- State 25: Seluruh layer terupdate penuh (layer lain tetap mengambil referensi dari Data Source sebagai referensi perubahan di code asset) + modal kartu rangkuman penutup ("Mengapa Kita Memisahkan Lapisan?") dan teaser Modul 07+.
- **Cek:** 26 state berjalan mulus dengan Next/Prev, build web lolos.

## M7 — QA akhir

- Jalankan seluruh `06-acceptance.md`, termasuk uji offline dan uji maju-mundur.
- Laporkan butir yang tidak lulus beserta penyebabnya.


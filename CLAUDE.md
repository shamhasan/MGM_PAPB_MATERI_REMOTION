# CLAUDE.md — Deck Interaktif Arsitektur Android

## Proyek

Presentasi interaktif (BUKAN video MP4) untuk kuliah Pemrograman Aplikasi Perangkat Bergerak (CIF62041), FILKOM UB, berdasarkan Modul Praktikum 06. Dosen menekan Next/Prev; animasi berjalan maju atau mundur satu `Stop` per tekanan.

Catatan: tidak ada library bernama "Antigravity" di proyek ini. Mekanisme Stop dibangun sendiri sesuai `docs/05-animation-spec.md`.

## Baca dulu (berurutan, sebelum menulis kode)

1. `docs/01-brief.md`
2. `docs/02-storyboard.md`
3. `docs/03-code-assets.md`
4. `docs/04-design-system.md`
5. `docs/05-animation-spec.md`
6. `docs/06-acceptance.md`
7. `docs/07-tasks.md` — kerjakan per milestone; berhenti dan lapor di akhir tiap milestone.

Jika dokumen bertentangan, prioritas: 02 > 05 > 04 > 03 > 01. Jangan menebak: tulis pertanyaan di akhir laporan milestone.

## Stack (terkunci; dependensi lain butuh izin)

| Kebutuhan        | Paket                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Dasar proyek     | Hasil `npx create-video@latest` (Remotion Studio + TypeScript). JANGAN membuat ulang proyek |
| Web presentasi   | Vite + React, DITAMBAHKAN di proyek yang sama (`strict: true`)                              |
| Mesin frame      | `remotion`, `@remotion/player` (hanya untuk tampilan; TIDAK untuk render MP4)               |
| Syntax highlight | `prism-react-renderer` (tema Dracula; tambahkan grammar Kotlin bila belum ada)              |
| Ikon             | `lucide-react`                                                                              |
| Font (lokal)     | `@fontsource/inter`, `@fontsource/jetbrains-mono`                                           |

## Struktur folder

Proyek berasal dari `create-video`, jadi ada dua pintu masuk: **Remotion Studio** (untuk memeriksa frame dengan scrub timeline) dan **Vite** (untuk presentasi sebenarnya). Keduanya memakai komposisi `Deck` yang sama.

```
index.html                # entry Vite (presentasi)
vite.config.ts
src/
  index.ts                # entry Remotion Studio (bawaan; registerRoot)
  Root.tsx                # daftarkan komposisi "Deck": 1920x1080, 30fps, 619 frame
  web/
    main.tsx              # entry presentasi (Vite)
    App.tsx               # Player + pemasangan input keyboard/klik
  deck/
    Deck.tsx              # komposisi utama, merangkai scene
    stops.ts              # SATU-SATUNYA tempat durasi & urutan stop
    useStopProgress.ts
    driver.ts             # rAF + seekTo (maju & mundur)
  scenes/
    Scene1Spaghetti.tsx
    Scene2Restaurant.tsx
    SceneSplit.tsx        # Scene 3 + Scene 4 (satu kanvas)
    Scene5Flow.tsx
  components/             # EditorWindow, CodeBlock, LayerCard, FlowArrow, Laser
  assets/code.ts          # kode dari docs/03
  styles/tokens.css       # variabel dari docs/04
```

## Perintah

Skrip bawaan `create-video` dipertahankan. Tambahkan skrip berikut di `package.json`:

- `npm run dev` — Remotion Studio (bawaan). Dipakai untuk scrub ke frame akhir tiap stop dan memeriksa tampilannya.
- `npm run present` → `vite` — mode presentasi (Player + keyboard).
- `npm run build:web` → `vite build` — build statis untuk dijalankan offline di kelas.
- `npx tsc --noEmit` — cek tipe (wajib bersih sebelum lapor).
  Catatan: `npm run build` bawaan adalah `remotion bundle`, BUKAN build presentasi. Jangan dipakai untuk acceptance.

## Aturan keras

1. **Waktu = fungsi dari frame global.** Semua animasi dihitung dari `useCurrentFrame()` lewat `useStopProgress`. Dilarang: `setTimeout`, CSS `transition`/`animation`, `Date.now()` untuk animasi, `player.play()`. Durasi dan urutan stop hanya boleh didefinisikan di `src/deck/stops.ts`, tidak di dalam komponen.
2. **Props Player wajib:** `controls={false}`, `clickToPlay={false}`, `doubleClickToFullscreen={false}`, `spaceKeyToPlayOrPause={false}`, `loop={false}`.
3. **Input:** `ArrowRight` / `PageDown` / `Space` / klik = Next. `ArrowLeft` / `PageUp` = Prev. Tidak ada tombol atau kontrol di layar.
4. **Narasi dosen BUKAN konten layar.** Jangan merender teks "Narasi" dari storyboard.
5. **Warna lapisan paten** (UI biru, ViewModel oranye, Repository hijau, Data Source navy). Pakai token dari `docs/04`; jangan menulis hex langsung di komponen.
6. **Offline penuh:** tanpa CDN, Google Fonts, gambar eksternal, atau request jaringan saat runtime.
7. **Bahasa:** teks di layar Bahasa Indonesia; istilah teknis (ViewModel, Repository, Composable, State) tetap Inggris; identifier kode Inggris.
8. **No scope creep:** tanpa backend, database, form, scroll, speaker notes, atau fitur di luar dokumen.
9. **TypeScript strict**, tanpa `any`.
10. **Selesai** = lolos `docs/06-acceptance.md`, termasuk `npm run build:web` dan `npx tsc --noEmit`.
11. **Skills Remotion bawaan** boleh dipakai untuk praktik terbaik Remotion (API, spring, interpolate). Jika skill menyarankan sesuatu yang bertentangan dengan dokumen ini (mis. render MP4, `TransitionSeries`, durasi berbasis waktu), dokumen ini menang.
12. Render video (`remotion render`) tidak dipakai di proyek ini. Biarkan skrip bawaannya, jangan dikembangkan.

## Format laporan milestone

Tulis: apa yang dibuat, bagaimana memverifikasinya, daftar penyimpangan dari dokumen (jika ada), dan pertanyaan terbuka.

# CLAUDE.md — Deck Interaktif Modul 07: REST API & Retrofit

## Proyek
Presentasi interaktif (BUKAN video MP4) untuk Modul Praktikum 07 (PAPB CIF62041, FILKOM UB): "Mengambil Data Eksternal dengan REST API & Retrofit". Lanjutan deck Modul 06. Dosen menekan Next/Prev; animasi maju atau mundur satu `Stop` per tekanan.

Fokus visual: **perubahan wujud data** (JSON → DTO → Student → UiState → layar) dan **batas arsitektur** (siapa boleh memanggil siapa).

## Titik awal (kerjakan sekali)
Pekerjaan ini berjalan di branch Git khusus Modul 07 yang dibuat dari branch Modul 06 terbaru (mesin Stop, driver, dan komponen sudah ada dan teruji).
1. `docs/` berisi dokumen Modul 07 (menggantikan docs Modul 06 di branch ini).
2. Dua dokumen Modul 06 masih dibutuhkan sebagai dasar dokumen delta. Pastikan keduanya ada di `docs-modul06/`: `04-design-system.md` dan `05-animation-spec.md` (salin dari branch Modul 06 sebelum `docs/` diganti). Dokumen Modul 06 lainnya tidak diperlukan.
3. PERTAHANKAN: `src/deck/` (driver dan hook tetap; isi `stops.ts` diganti), `src/components/` (CodeBlock, CodePanel, DiffPanel, EditorWindow, FlowArrow, dst.), `src/styles/tokens.css` (tambahan token ada di `docs/04-design-delta.md`), `src/web/`, skrip `package.json`.
4. Hapus scene Modul 06 (`Scene1Spaghetti`, `Scene2Restaurant`, `SceneSplit`, `SceneFlow`) hanya setelah scene Modul 07 berjalan.

## Baca dulu (berurutan, sebelum menulis kode)
1. `docs/01-brief.md`
2. `docs/02-storyboard.md`
3. `docs/03-code-assets.md`
4. `docs/04-design-delta.md` (lalu `docs-modul06/04-design-system.md` untuk bagian yang tidak berubah)
5. `docs/05-animation-delta.md` (lalu `docs-modul06/05-animation-spec.md`)
6. `docs/06-acceptance.md`
7. `docs/07-tasks.md` — kerjakan per milestone; berhenti dan lapor di akhir tiap milestone.

Jika dokumen bertentangan, prioritas: 02 > 05-delta > 04-delta > 03 > 01 > dokumen Modul 06. Jangan menebak; catat pertanyaan di akhir laporan.

## Stack (terkunci; dependensi baru butuh izin)
Sama dengan Modul 06: Vite + React + TypeScript (strict), `remotion`, `@remotion/player`, `prism-react-renderer`, `lucide-react`, `@fontsource/inter`, `@fontsource/jetbrains-mono`. Tidak ada library jaringan.

## Struktur folder (tambahan/perubahan)
```
src/
  deck/stops.ts            # diganti: SCENES Modul 07 (lihat docs/05-delta)
  scenes/
    Scene1Recap.tsx
    Scene2Cycle.tsx
    Scene3Layers.tsx
    Scene4Mapping.tsx
    Scene5Async.tsx
    Scene6States.tsx
    Scene7Errors.tsx
    Scene8Summary.tsx
  components/              # baru: PhoneMock, JsonBlock, Packet, Rail, LaneTimeline, DoorFork, StatePanel, SymptomChip
  assets/code.ts           # konstanta dari docs/03
```

## Perintah
`npm run dev` (Remotion Studio, untuk scrub frame), `npm run present` (mode presentasi), `npm run build:web` (build statis offline), `npx tsc --noEmit`. Jangan memakai `npm run build` bawaan untuk acceptance.

## Aturan keras
1. **Waktu = fungsi dari frame global** lewat `useStopProgress`. Dilarang `setTimeout`, `Date.now()` untuk animasi, `player.play()`, dan CSS transition/animation. SATU pengecualian: ornamen berputar dekoratif `.spinner` boleh memakai CSS `@keyframes` (lihat `docs/05-delta`).
2. **Props Player wajib:** `controls={false}`, `clickToPlay={false}`, `doubleClickToFullscreen={false}`, `spaceKeyToPlayOrPause={false}`, `loop={false}`.
3. **Input:** `ArrowRight`/`PageDown`/`Space`/klik = Next; `ArrowLeft`/`PageUp` = Prev; abaikan `e.repeat`; handler dipasang SATU kali dengan cleanup. Tanpa tombol di layar.
4. **Narasi dosen BUKAN konten layar.**
5. **Warna:** token dari `docs-modul06/04` dan `docs/04-delta`. Dilarang hex langsung di komponen. Panah event dan panah response memakai `--arrow-event` dan `--arrow-state`, BUKAN biru dan hijau (biru = UI, hijau = Repository). Warna `--ok`/`--err` hanya untuk Scene 5–7.
6. **Offline total.** Deck TIDAK boleh memanggil `dummyjson.com` atau jaringan apa pun. Semua JSON adalah konstanta di `src/assets/code.ts`.
7. **Bahasa:** teks layar Bahasa Indonesia; istilah teknis tetap Inggris; identifier kode Inggris.
8. **Scope:** tanpa backend, tanpa implementasi Retrofit sungguhan, tanpa Coroutines/Flow/Room (hanya label teaser), tanpa POST/PUT/DELETE. **Jangan menampilkan data sensitif palsu dari DummyJSON** (password, ssn, nomor kartu, iban, wallet), meskipun hanya contoh.
9. TypeScript strict, tanpa `any`.
10. **Selesai** = lolos `docs/06-acceptance.md`, termasuk `npm run build:web` dan `npx tsc --noEmit`.
11. Skills Remotion bawaan boleh dipakai untuk praktik terbaik API; jika bertentangan dengan dokumen ini, dokumen ini menang.
12. Render video (`remotion render`) tidak dipakai.

## Format laporan milestone
Apa yang dibuat, cara memverifikasi, penyimpangan dari dokumen (jika ada), pertanyaan terbuka.

# CLAUDE.md — Deck Interaktif Modul 08: Kotlin Coroutines & Flow

## Proyek

Presentasi interaktif (BUKAN video MP4) untuk Modul Praktikum 08 (PAPB CIF62041, FILKOM UB): "Asynchronous Programming dengan Kotlin Coroutines & Flow". Lanjutan langsung dari deck Modul 07. Dosen mengendalikan transisi dengan menekan Next/Prev; animasi maju atau mundur satu `Stop` per penekanan tombol.

Fokus visual: **evolusi komputasi asinkron** (titik jenuh callback $\rightarrow$ penangguhan linear `suspend` $\rightarrow$ disiplin pembatalan `viewModelScope` $\rightarrow$ penampung `StateFlow` $\rightarrow$ aliran pipa reaktif `Flow`) dan **integritas batas arsitektur**.

## Titik Awal (Kerjakan Sekali)

Pekerjaan ini berjalan di branch Git khusus Modul 08 yang dibuat dari branch Modul 07 terbaru (mesin Stop, driver navigasi, font, dan komponen dasar sudah teruji).

1. `docs/` berisi 7 berkas spesifikasi Modul 08 (`01-brief.md` hingga `07-tasks.md`).

2. Dokumen acuan modul sebelumnya tersimpan di `docs-modul07/` (`04-design-delta.md` dan `05-animation-delta.md`) serta `docs-modul06/` (`04-design-system.md` dan `05-animation-spec.md`).

3. **PERTAHANKAN**:

- `src/deck/driver.ts` dan hook `useStopProgress.ts` (tidak boleh diubah).

- `src/components/Watermark.tsx` (branding persisten "SHAM", logo MGM, dan logo Curriculum di pojok kanan atas).

- `src/components/` komponen dasar: `EditorWindow`, `CodeBlock`, `CodePanel`, `DiffPanel`, `PhoneMock`.

- Konfigurasi build dan dependensi `package.json`.

4. **HAPUS SCENE LAMA**: Komponen scene Modul 07 (`Scene1Recap`, `Scene2Cycle`, `Scene3Layers`, `Scene4Mapping`, `Scene5Async`, `Scene6States`, `Scene7Errors`, `Scene8Summary`) hanya boleh dihapus pada Milestone M9 setelah seluruh scene Modul 08 berfungsi stabil.

## Baca Dulu (Berurutan, Sebelum Menulis Kode)

1. `docs/01-brief.md`
2. `docs/02-storyboard.md`
3. `docs/03-code-assets.md`
4. `docs/04-design-delta.md` (lalu rujuk `docs-modul07/` dan `docs-modul06/` untuk token dasar yang tidak berubah)

5. `docs/05-animation-delta.md` (lalu rujuk aturan easing dasar di `docs-modul06/`)

6. `docs/06-acceptance.md`
7. `docs/07-tasks.md` — kerjakan strictly per milestone; laporkan hasil dan tunggu konfirmasi sebelum melangkah ke milestone berikutnya.

Jika terjadi kontradiksi antar dokumen, pedoman prioritas resolusi adalah:

**02-storyboard > 05-animation-delta > 04-design-delta > 03-code-assets > 01-brief > dokumen modul sebelumnya**.

## Stack Terkunci (Tanpa Dependensi Baru)

Sama dengan Modul 06 dan 07: Vite + React + TypeScript (strict mode), `remotion`, `@remotion/player`, `prism-react-renderer`, `lucide-react`, `@fontsource/inter`, `@fontsource/jetbrains-mono`. Dilarang menginstal library runtime HTTP atau Android pihak ketiga.

## Struktur Folder Target

```
src/
  deck/
    stops.ts               # Diperbarui: SCENES Modul 08 (31 state settled, durasi 901 frame)
    driver.ts              # Driver rAF navigasi maju-mundur
    useStopProgress.ts     # Hook kalkulasi progres stop (0 -> 1)
  scenes/
    Scene1PainPoints.tsx   # State 0-3: Aturan Main Thread & Kerapuhan Callback
    Scene2Suspend.tsx      # State 4-8: Suspend, Pembatas Buku, & Main-Safety
    Scene3Structured.tsx   # State 9-13: viewModelScope & CancellationException
    Scene4StateFlow.tsx    # State 14-18: MutableStateFlow vs StateFlow & Lifecycle UI
    Scene5FlowSearch.tsx   # State 19-24: Pipa Pencarian Reaktif Flow (Gambar 3 Modul 08)
    Scene6Summary.tsx      # State 25-30: Diff Refactoring & Jembatan ke Modul 09
  components/
    BookmarkIndicator.tsx  # Ornamen pita emas penanda suspensi baris kode
    FlowPipeline.tsx       # Konveyor rel 7 node operator Flow
    OperatorNode.tsx       # Kartu filter debounce, distinct, dan collectLatest
    LifecycleBadge.tsx     # Indikator status siklus hidup Compose (Active/Paused)
    PhoneMock.tsx          # Mockup ponsel Android interaktif
    Watermark.tsx          # Watermark persisten "SHAM" & logo perkuliahan
  assets/
    code.ts                # Seluruh konstanta kode Kotlin Modul 08 (dari docs/03)

```

## Perintah Kerja

- `npm run dev` : Menjalankan Remotion Studio untuk verifikasi visual per frame.

- `npm run present` : Menjalankan deck pada mode presentasi dosen.

- `npx tsc --noEmit` : Memastikan pengetikan TypeScript bebas error tanpa `any`.

- `npm run build:web` : Membangun bundel web statis offline untuk pengujian penerimaan.

## Aturan Keras

1. **Waktu Murni Fungsi Frame Global**: Seluruh animasi dihitung via `useStopProgress`. Dilarang menggunakan `setTimeout`, `setInterval`, `Date.now()`, `player.play()`, maupun CSS transition/animation. SATU-SATUNYA pengecualian: class `.spinner` dekoratif boleh memakai CSS `@keyframes` rotasi agar tetap berputar saat timeline diam pada state stabil.

2. **Konfigurasi Player Remotion**:
   `controls={false}`, `clickToPlay={false}`, `doubleClickToFullscreen={false}`, `spaceKeyToPlayOrPause={false}`, `loop={false}`.

3. **Navigasi Keyboard & Klik**:

- Next: `ArrowRight`, `PageDown`, `Space`, atau klik kiri kanvas.

- Prev: `ArrowLeft`, `PageUp`.

- Wajib mengabaikan `e.repeat === true` (cegah lompatan frame saat tombol ditekan lama).

- Listener dipasang tepat satu kali dengan fungsi _cleanup_ yang benar.

4. **Narasi Dosen BUKAN Teks Layar**: Naskah narasi di storyboard adalah panduan lisan dan dilarang ditampilkan sebagai elemen teks di layar presentasi.

5. **Kepatuhan Palet Warna & Aksesibilitas**:

- Seluruh warna wajib menggunakan variabel CSS dari `tokens.css` (dilarang menulis hex langsung di komponen JSX).

- Panah event = `--arrow-event`, panah response/state = `--arrow-state` (DILARANG menggunakan warna biru atau hijau untuk panah).

- Token khusus Modul 08: `--c-coroutine` (eksekusi suspend), `--c-flow` (pipa stream reaktif), `--c-bookmark` (penanda suspensi), dan `--c-cancel` (pembatalan request).

6. **Kemandirian Offline 100%**: Tidak boleh ada pemanggilan `fetch`, URL dummyjson live, maupun resource eksternal saat runtime.

7. **Standar Konten & Kebersihan Data**:

- Istilah UI dalam Bahasa Indonesia baku; istilah teknis komputasi dan identifier kode tetap Bahasa Inggris.

- Dilarang menampilkan field data sensitif DummyJSON (`password`, `ssn`, nomor kartu, dsb.).

8. **Kepatuhan Materi Praktikum**:

- Seluruh pemanggilan jaringan di data layer berstatus `suspend fun` (tanpa `Call<T>` dan `enqueue`).

- Blok catch error wajib menyertakan `catch (e: CancellationException) { throw e }`.

- State holder memakai `MutableStateFlow` (private) + `StateFlow` (public).

- Composable UI mengoleksi state via `collectAsStateWithLifecycle()`.

9. **Kriteria Selesai**: Dinyatakan selesai bila lolos seluruh butir verifikasi di `docs/06-acceptance.md`, `npx tsc --noEmit` bersih, dan `npm run build:web` berhasil.

## Format Laporan per Milestone

Setiap selesai mengeksekusi satu milestone, sajikan laporan terstruktur:

1. **Pekerjaan Selesai**: Rincian berkas yang dibuat atau dimodifikasi.

2. **Metode Verifikasi**: Perintah terminal dan hasil visual stop yang diuji.

3. **Deviasi Spesifikasi**: Penyesuaian teknis terhadap dokumen (jika ada).

4. **Pertanyaan Terbuka**: Isu yang membutuhkan konfirmasi sebelum lanjut ke milestone berikutnya.

---

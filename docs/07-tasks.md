# 07 — Tasks (Milestone, Modul 08)

Kerjakan tugas secara berurutan per milestone. Di akhir tiap milestone, jalankan verifikasi `npx tsc --noEmit` dan `npm run build:web`, sajikan laporan singkat sesuai format di `CLAUDE.md`, lalu **berhenti dan tunggu persetujuan sebelum melangkah ke milestone berikutnya**.

---

## M0 — Persiapan Lingkungan & Token CSS Baru

- Pastikan berkas dasar Modul 07 (`04-design-delta.md` dan `05-animation-delta.md`) sudah tersimpan rapi di dalam folder `docs-modul07/`.
- Tambahkan token baru Modul 08 dari `docs/04-design-delta.md` ke dalam `src/styles/tokens.css` (`--c-coroutine`, `--c-flow`, `--c-bookmark`, `--c-cancel`, `--life-active`, `--life-idle`, dan variabel pipa konveyor).
- Jalankan `npm run dev` dan `npm run present` untuk memastikan lingkungan Remotion berjalan tanpa error sebelum komponen lama disentuh.

- **Cek Verifikasi**: `npx tsc --noEmit` bersih dan token CSS terbaca di root.

## M1 — Mesin Stop & Timeline Modul 08

- Perbarui konfigurasi array `SCENES` di `src/deck/stops.ts` sesuai spesifikasi `docs/05-animation-delta.md` (6 scene: `painpoints`, `suspend`, `structured`, `stateflow`, `flowsearch`, `summary`).
- Sesuaikan durasi komposisi `Deck` di `src/Root.tsx` dan Remotion Studio menjadi tepat **901 frame** (30 FPS).
- Buat komponen placeholder sementara di `Deck.tsx` yang menampilkan teks `"State N / 30"` untuk memastikan perpindahan state berjalan stabil.

- **Cek Verifikasi**:
- Butir B di `docs/06-acceptance.md` lulus (tepat 31 state settled unik dari frame 0 hingga 900).

- Navigasi maju (`Next`), mundur (`Prev`), dan penekanan cepat tidak memicu error atau listener ganda.

## M2 — Komponen Bersama & Aset Data Kode

- Salin seluruh konstanta kode Kotlin, tipe data TypeScript, dan struktur pipa dari `docs/03-code-assets.md` ke dalam `src/assets/code.ts` (pastikan bersih dari field sensitif DummyJSON).

- Bangun komponen visual baru di `src/components/`:

- `BookmarkIndicator.tsx`: Ornamen pita emas penanda suspensi baris kode (Scene 2).

- `ParentChildTree.tsx`: Diagram pohon hierarki induk-anak `viewModelScope` (Scene 3).

- `LifecycleBadge.tsx`: Pill badge penanda status siklus hidup Compose (Active/Idle) (Scene 4).

- `OperatorNode.tsx`: Kartu node operator Flow (`debounce`, `distinctUntilChanged`, `collectLatest`) (Scene 5).

- `FlowPipeline.tsx`: Rel konveyor kaca 7 node (A–G) sesuai Gambar 3 Modul 08 (Scene 5).

- **Cek Verifikasi**: Seluruh komponen bersama terkompilasi tanpa error TypeScript (`npx tsc --noEmit`).

## M3 — Scene 1: Titik Jenuh Callback (State 0–3)

- Bangun `src/scenes/Scene1PainPoints.tsx` sesuai `docs/02-storyboard.md`:

- **State 0**: Aturan Main Thread, diagram kasir restoran & buzzer antrean, kode `enqueue`.

- **State 1**: Sorotan `onResponse`, kurva zigzag lompatan logika, kartu _Inverted Control Flow_.

- **State 2**: Kaskade kode callback 3 tingkat, kartu _Pyramid of Doom_.

- **State 3**: Simulasi tombol Back pada ponsel, garis putus-putus ke UI hancur disilang merah (`--err`), kartu _Lifecycle Blindness_.

- Hubungkan scene ke stop `painpoints` di `src/deck/stops.ts`.

- **Cek Verifikasi**: Maju-mundur State 0–3 menghasilkan transisi kartu masalah dan kode yang presisi.

## M4 — Scene 2: Konsep Suspend & Analogi Pembatas Buku (State 4–8)

- Bangun `src/scenes/Scene2Suspend.tsx` sesuai `docs/02-storyboard.md`:

- **State 4**: Komparasi berdampingan Gambar 1 Modul 08 (`COMPARE_CALLBACK` vs `COMPARE_COROUTINE`).

- **State 5**: Efek `bookmarkPause` (pita emas menancap di baris `suspend`), lajur Main Thread tetap berjalan bebas.

- **State 6**: Efek `bookmarkResume` (pita terangkat dengan pendaran cahaya), eksekusi berlanjut sekuensial ke `updateUi`.

- **State 7**: Kembalinya penanganan error via blok alami `try-catch` tanpa pembungkus `Result`.

- **State 8**: Penegasan _main-safety_ Retrofit: kode `StudentRemoteDataSource` disorot tanpa pembungkus `withContext(Dispatchers.IO)`.

- **Cek Verifikasi**: Ornamen `BookmarkIndicator` bergerak mulus dan teks kedua editor terbaca tajam pada 1080p.

## M5 — Scene 3: Structured Concurrency & viewModelScope (State 9–13)

- Bangun `src/scenes/Scene3Structured.tsx` sesuai `docs/02-storyboard.md`:

- **State 9**: Pohon hierarki induk-anak `HomeViewModel` menaungi `viewModelScope`.

- **State 10**: Pembentukan cabang pekerjaan `Job #1` yang berdenyut hijau di dalam scope.

- **State 11**: Simulasi layar ditutup (tombol Back), pembersihan ViewModel, laser potong menyapu `Job #1` menjadi "CANCELLED".

- **State 12**: Contoh salah penelanan `catch (e: Exception)` umum dengan getaran peringatan bahaya `ShieldAlert`.

- **State 13**: Baris wajib `catch (e: CancellationException) { throw e }` menyala terang dengan chip hijau _Structured Cancellation Terjaga_.

- **Cek Verifikasi**: Efek laser sapuan pembatalan dan getaran peringatan bahaya terikat murni pada frame global.

## M6 — Scene 4: StateFlow & Lifecycle-Aware Collection (State 14–18)

- Bangun `src/scenes/Scene4StateFlow.tsx` sesuai `docs/02-storyboard.md`:

- **State 14**: Rekap keterbatasan `mutableStateOf` Modul 07 dan pengenalan `StateFlow`.

- **State 15**: Diagram kotak enkapsulasi: privat `_uiState` (`MutableStateFlow`) vs publik `uiState` (`StateFlow`).

- **State 16**: Garis panah pembacaan langsung `.value` dari Composable disilang tanda merah larangan (`--err`).

- **State 17**: Koleksi via `collectAsStateWithLifecycle()`, `LifecycleBadge` menyala hijau (STARTED/RESUMED), data profil tampil di mockup ponsel.

- **State 18**: Simulasi aplikasi masuk latar belakang, `LifecycleBadge` berganti kuning (STOPPED), aliran data terhenti otomatis.

- **Cek Verifikasi**: Transisi cross-fade status badge ponsel berjalan sinkron tanpa lonjakan tata letak.

## M7 — Scene 5: Pipa Pencarian Reaktif Flow (State 19–24)

- Bangun `src/scenes/Scene5FlowSearch.tsx` sesuai `docs/02-storyboard.md`:

- **State 19**: Perbandingan konsep One-Shot vs Stream, rel konveyor 7 node (A–G) Gambar 3 Modul 08, penyilangan tombol cari manual.

- **State 20**: Efek `pipeStream`: partikel teks query `"j"`, `"ja"`, dan `"john"` memancar masuk ke pipa Flow.

- **State 21**: Efek `debounceHold`: jam pasir berputar 500 ms di Node D, partikel lama melebur ke partikel terbaru.

- **State 22**: Efek `distinctGate`: verifikasi keunikan teks, gerbang Node D membuka, partikel `"john"` meluncur ke Node E.

- **State 23**: Efek `cancelBurst`: request lama yang belum selesai meledak dibatalkan oleh `collectLatest` saat query baru tiba.

- **State 24**: Efek `collectSuccess`: data tiba di Node F, riak air memancar ke Node G (`HomeUiState`), layar ponsel menampilkan Emily Johnson.

- **Cek Verifikasi**:
- Lintasan partikel teks bergerak stabil dari kiri ke kanan melintasi ketujuh stasiun node.

- Navigasi mundur dari State 24 ke State 19 mengembalikan posisi partikel secara simetris.

## M8 — Scene 6: Peta Refactoring Lapisan & Jembatan ke Modul 09 (State 25–30)

- Bangun `src/scenes/Scene6Summary.tsx` sesuai `docs/02-storyboard.md`:

- **State 25**: 5 kotak slot arsitektur tampil berjajar dengan banner pengantar refactoring Modul 08.

- **State 26**: Kotak Remote Data Source menyala (`⚡ DIUBAH`), diff `DIFFS[0]` (penghapusan Call/enqueue $\rightarrow$ suspend).

- **State 27**: Kotak Repository menyala (`⚡ DIUBAH`), diff `DIFFS[1]` (penghapusan callback $\rightarrow$ suspend + mapper).

- **State 28**: Kotak ViewModel menyala (`⚡ DIUBAH`), diff `DIFFS[2]` (StateFlow, try-catch, dan throw CancellationException).

- **State 29**: Kotak Composable UI menyala (`⚡ DIUBAH`), diff `DIFFS[3]` (koleksi lifecycle-aware & pencarian otomatis).

- **State 30**: Seluruh kotak menyala (`✓ TERPADU`), tabel dua kolom Berubah vs Tetap, serta baris emas pengantar Modul 09 (Room Database & DataStore).

- **Cek Verifikasi**: Panel diff berganti rapi ke panel tabel ringkasan tanpa teks yang terpotong garis batas kanvas.

## M9 — QA Akhir, Pembersihan Scene Lama & Build Statis

- Hapus seluruh berkas scene usang Modul 07 (`Scene1Recap.tsx` s.d. `Scene8Summary.tsx`) dan bersihkan impor yang tidak terpakai.

- Uji kepatuhan menyeluruh terhadap dokumen `docs/06-acceptance.md`:

- Butir A: Bebas `any`, tanpa library eksternal, watermark aktif, 100% offline.

- Butir B: 31 state settled presisi, maju-mundur identik pada state uji sampel, navigasi keyboard stabil.

- Butir C: Verifikasi visual isi layar per state dari State 0 hingga State 30.

- Butir D: Kepatuhan warna lapisan, panah bukan biru/hijau, zona aman 80px, kontras WCAG terpenuhi.

- Butir E & F: Kepatuhan batasan scope dan akurasi materi Modul Praktikum 08 FILKOM UB 2026.

- Jalankan perintah build statis:

```powershell
npm run build:web

```

- Pastikan berkas hasil build di folder `dist/` atau `build/` dapat dibuka di browser tanpa koneksi internet (uji dengan mematikan WiFi).

- Sajikan laporan penutupan final proyek Modul 08.

# 06 — Acceptance Criteria (Modul 08: Kotlin Coroutines & Flow)

Centang hanya butir yang benar-benar telah diuji dan diverifikasi secara langsung.

## A. Build dan Integritas Kode

- [ ] `npm run build:web` sukses tanpa peringatan fatal; `npx tsc --noEmit` bersih tanpa kesalahan tipe data.

- [ ] Tidak ada penggunaan tipe `any`, pemanggilan `setTimeout`, `setInterval`, `player.play()`, maupun CSS `transition`/`animation` (satu-satunya pengecualian: ornamen `.spinner`).

- [ ] Tidak ada pemanggilan URL eksternal, library Android runtime, atau `fetch` di dalam folder `src/` dan file `index.html`; hasil build statis berjalan sempurna saat koneksi internet dimatikan (100% offline).

- [ ] Tidak ada field sensitif palsu DummyJSON (`password`, `ssn`, `ein`, `cardNumber`, `iban`, `wallet`, `macAddress`, `ip`) di dalam `src/assets/code.ts` maupun komponen visual.

- [ ] Komponen `Watermark.tsx` ("SHAM", logo MGM, logo Curriculum) aktif di pojok kanan atas kanvas (`top: 32px, right: 60px`) menggunakan komponen `<Img/>` dari Remotion.

## B. Navigasi & Mesin Stop

- [ ] Array `SETTLED` di `src/deck/stops.ts` berisi tepat **31 state unik** (frame 0 hingga 900); durasi total komposisi `Deck` di Remotion Studio dan `Root.tsx` tepat **901 frame** pada 30 FPS.
- [ ] Tombol Next (`→`, `PageDown`, `Space`, atau klik kiri kanvas) memajukan presentasi tepat satu state; tombol Prev (`←`, `PageUp`) memundurkan tepat satu state.

- [ ] Penekanan tombol navigasi di ujung awal (State 0) atau ujung akhir (State 30) tidak menghasilkan error atau memicu layar putih (_crash_).

- [ ] Penekanan Next saat animasi sedang berjalan seketika menyelesaikan animasi tersebut ke frame target tanpa melompati state berikutnya.

- [ ] Pengujian navigasi bolak-balik: Maju $N$ state lalu mundur $N$ state menghasilkan tampilan visual yang identik secara matematis (lakukan uji sampel pada state 3, 6, 11, 17, 23, dan 30; ornamen berputar `.spinner` dikecualikan).

- [ ] Satu penekanan tombol fisik hanya memicu satu kali navigasi state (tidak terjadi registrasi event listener ganda); flag `e.repeat === true` diabaikan sepenuhnya.

- [ ] Animasi terlihat berjalan mulus saat dijalankan via `npm run present` (misalnya: pita pembatas buku menancap halus pada State 5 dan partikel Flow meluncur pada State 20).

## C. Kepatuhan Isi per State (Sesuai `02-storyboard.md`)

| State | Kondisi Layar yang Wajib Terlihat                                                                                                                      |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **0** | Judul "Aturan Emas: Main Thread Hanya untuk UI", diagram kasir restoran memberikan buzzer antrean, panel kode `enqueue`, teks peran callback Modul 07. |
| **1** | Panel kode menyorot kurung kurawal `onResponse`, panah melengkung zigzag merah, kartu masalah "Pembalikan Alur Pikir (Inverted Control Flow)". |
| **2** | Panel kode menampilkan kaskade callback bersarang 3 tingkat, kartu masalah "Kaskade Bersarang (Pyramid of Doom)". |
| **3** | Mockup ponsel menampilkan simulasi tombol Back ditekan (layar ditutup), garis merah putus-putus ke layar disilang (`--err`), kartu "Kebutaan Daur Hidup (Lifecycle Blindness)". |
| **4** | Judul Scene 2, dua jendela editor berdampingan menampilkan Gambar 1 Modul 08 (`COMPARE_CALLBACK` vs `COMPARE_COROUTINE`), teks kode linear non-blocking. |
| **5** | Baris `val data = repository.getStudents()` tersorot, pita emas `BookmarkIndicator` jatuh menancap, Main Thread tetap berjalan dengan chip "UI Responsif". |
| **6** | Paket data server tiba, pita pembatas buku terangkat dengan pendaran cahaya emas, baris berikutnya `updateUi(data)` menyala sekuensial. |
| **7** | Editor kanan menampilkan penanganan error blok alami `try-catch` tanpa pembungkus `Result.success` / `Result.failure`. |
| **8** | Kotak penegasan "Mitos Dispatchers.IO pada Retrofit" muncul; kode `StudentRemoteDataSource` disorot sebagai _main-safe_ tanpa `withContext` manual. |
| **9** | Judul Scene 3, pohon hierarki induk-anak menampilkan kotak `HomeViewModel` menaungi lingkaran `viewModelScope`. |
| **10** | Cabang pekerjaan `launch { ... }` terbentuk di dalam scope (Job #1 berdenyut hijau), panel kode menyorot `viewModelScope.launch`. |
| **11** | Simulasi pengguna menekan Back, `HomeViewModel` hancur, garis potong laser neon menyapu Job #1 dan memunculkan stempel merah "CANCELLED". |
| **12** | Panel kode menampilkan contoh blok salah `catch (e: Exception)` umum, ikon bahaya `ShieldAlert` bergetar memperingatkan bahaya tertelannya pembatalan. |
| **13** | Baris `catch (e: CancellationException) { throw e }` menyala terang di atas catch umum, chip hijau "Structured Cancellation Terjaga" tampil. |
| **14** | Judul Scene 4, teks evaluasi keterbatasan `mutableStateOf` Modul 07, kotak pengenalan `StateFlow`. |
| **15** | Diagram enkapsulasi di ViewModel: kotak privat `_uiState` (`MutableStateFlow`) berdampingan dengan kotak publik `uiState` via `.asStateFlow()`. |
| **16** | Garis panah akses langsung dari Composable ke `_uiState.value` diberi tanda silang merah (`--err`) dengan teks larangan pembacaan statis di UI. |
| **17** | Panah ungu (`--arrow-state`) menghubungkan `StateFlow` ke Composable via `collectAsStateWithLifecycle()`, badge hijau "RESUMED (Koleksi Aktif)", profil Emily Johnson tampil. |
| **18** | Simulasi aplikasi masuk latar belakang, badge status berganti kuning "STOPPED (Koleksi Dijeda)", partikel aliran data terhenti seketika. |
| **19** | Judul Scene 5, perbandingan konsep Operasi One-Shot (`suspend`) vs Stream (`Flow`), rel konveyor pipa 7 node (A–G) muncul, tombol cari Modul 07 diberi tanda silang. |
| **20** | Partikel query teks `"j"`, `"ja"`, dan `"john"` memancar masuk dari Composable ke dalam pipa Flow (Node A, B, C aktif berurutan). |
| **21** | Partikel query tertahan di depan gerbang Node D (`debounce 500 ms`), visual jam pasir berputar, partikel lama melebur ke partikel terbaru. |
| **22** | Gerbang Node D membuka ke atas, partikel `"john"` lolos verifikasi `distinctUntilChanged` dan meluncur ke Node E (`collectLatest`). |
| **23** | Simulasi pembatalan: request lama yang belum selesai meledak (`cancelBurst`) di Node E, digantikan seketika oleh query terbaru. |
| **24** | Paket data tiba di Node F (`searchStudents`), riak air memancar ke Node G (`HomeUiState`), layar ponsel menampilkan hasil pencarian Emily Johnson. |
| **25** | Judul Scene 6, kelima kotak lapisan arsitektur tampil berjajar dengan banner "Peta Perubahan: Dari Callback ke Coroutines & Flow". |
| **26** | Kotak Remote Data Source menyala dengan badge `⚡ DIUBAH`, panel diff menampilkan `DIFFS[0]` (penghapusan Call/enqueue diganti fungsi satu baris suspend). |
| **27** | Kotak Repository menyala dengan badge `⚡ DIUBAH`, panel diff menampilkan `DIFFS[1]` (penghapusan callback diganti suspend + pemetaan DTO). |
| **28** | Kotak ViewModel menyala dengan badge `⚡ DIUBAH`, panel diff menampilkan `DIFFS[2]` (migrasi mutableStateOf ke StateFlow + try-catch dan throw CancellationException). |
| **29** | Kotak Composable UI menyala dengan badge `⚡ DIUBAH`, panel diff menampilkan `DIFFS[3]` (koleksi lifecycle-aware + penghapusan tombol cari). |
| **30** | Seluruh 5 kotak menyala dengan badge `✓ TERPADU`, panel diff cross-fade menjadi tabel ringkasan 2 kolom Berubah vs Tetap, baris penutup emas jembatan ke Room Database & DataStore. |

## D. Standar Visual & Aksesibilitas

- [ ] Urutan lapisan arsitektur selalu konsisten dari kiri ke kanan: `Composable UI` $\rightarrow$ `ViewModel` $\rightarrow$ `Repository` $\rightarrow$ `Remote Data Source` $\rightarrow$ `REST API`.

- [ ] Seluruh warna elemen menggunakan token CSS dari `tokens.css`; tidak ada kode warna hex yang ditulis langsung di komponen JSX.

- [ ] Panah event (`--arrow-event`) dan panah response/state (`--arrow-state`) **tidak menggunakan warna biru atau hijau** (biru milik UI, hijau milik Repository).

- [ ] Teks judul utama berukuran 72px; seluruh teks instruksional $\ge 42\text{px}$ (kecuali label khusus yang tercatat pada pengecualian tabel tipografi `04-design-delta.md`).

- [ ] Tidak ada elemen teks, tombol ilustrasi, atau kartu kode yang melanggar zona aman 80px di keempat sisi kanvas 1920×1080.

- [ ] Seluruh teks kode pada perbandingan editor ganda (Scene 2), panel pohon (Scene 3), dan pipa Flow (Scene 5) terbaca jelas tanpa tumpang tindih (_clipping_).

- [ ] Teks naskah narasi dosen **tidak ditampilkan di layar presentasi**.

## E. Batasan Ruang Lingkup (Non-Goals)

- [ ] Tidak ada elemen antarmuka form interaktif nyata, input ketik langsung di browser, scroll bar aktif, atau kontrol pemutar video bawaan browser.

- [ ] Tidak ada runtime Retrofit sungguhan yang dijalankan; deck murni media visualisasi instruksional.

- [ ] Tidak menampilkan kode implementasi Room Database, DataStore, atau dependency injection Hilt/Koin (hanya label teaser penutup di State 30).

## F. Akurasi Materi Praktikum (Audit Mandiri terhadap Modul 08)

- [ ] `StudentApiService` murni menggunakan kata kunci `suspend` dan tidak lagi mengimpor atau mengembalikan `Call<T>`.

- [ ] `StudentRemoteDataSource` dan `StudentRepository` mengekspos fungsi `suspend` untuk operasi _one-shot_ (`getStudents`, `getStudent`, `searchStudents`).

- [ ] Panggilan Retrofit suspend dinyatakan secara eksplisit sebagai _main-safe_ dan tidak dibungkus dengan `withContext(Dispatchers.IO)`.

- [ ] `HomeViewModel` dan `DetailViewModel` menjalankan komputasi asinkron melalui `viewModelScope.launch`.

- [ ] Blok `try-catch` di ViewModel menangkap `CancellationException` secara terpisah dan melemparnya kembali (`throw e`) agar pembatalan otomatis coroutine tetap bekerja.

- [ ] State penampung di ViewModel disimpan sebagai `private val _uiState = MutableStateFlow(...)` dan diekspos sebagai `val uiState: StateFlow = _uiState.asStateFlow()`.

- [ ] Composable UI mengoleksi state menggunakan fungsi ekstensi `collectAsStateWithLifecycle()` dari package `androidx.lifecycle.compose`.

- [ ] Pipeline pencarian di ViewModel menyusun operator secara urut: `debounce(500)` $\rightarrow$ `distinctUntilChanged()` $\rightarrow$ `collectLatest`.

- [ ] Penjelasan perilaku `collectLatest` dinyatakan dengan benar: membatalkan blok koleksi sebelumnya bila query baru tiba.

- [ ] Model domain tetap menggunakan `Student(id, name, email, university)` dan pemetaan dari `UserDto` dilakukan di dalam layer Repository.

---

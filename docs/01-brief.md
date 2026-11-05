# 01 — Brief: Deck Interaktif Modul 08 (Asynchronous Programming dengan Kotlin Coroutines & Flow)

## 1. Tujuan

Alat bantu ajar interaktif perkuliahan dan praktikum yang mendemonstrasikan **evolusi pemrograman asinkron di Android**: beralih dari kerapuhan pola callback (`Call.enqueue` di Modul 07) menuju arsitektur modern yang linear, terstruktur, dan reaktif menggunakan **Kotlin Coroutines dan Flow**. Praktikan dipandu memahami bahwa Coroutine bukan sekadar _syntax sugar_, melainkan solusi fundamental terhadap masalah _inverted control flow_, _callback hell_, dan _lifecycle blindness_.

## 2. Hubungan dengan Modul 07

Modul 08 melanjutkan arsitektur proyek `NavigationLab` dari Modul 07. Lapisan dan kontrak dependency (`UI → ViewModel → Repository → Remote Data Source → REST API`) tetap dipertahankan, namun seluruh mekanisme komunikasi asinkron dirombak total:

- `Call<T>` dan `enqueue` pada Retrofit serta Remote Data Source digantikan oleh fungsi `suspend`.

- Callback bersarang dan pembungkus `Result<T>` dihilangkan; alur data menjadi sekuensial linear dengan blok alami `try-catch`.

- State holder Compose (`mutableStateOf`) ditingkatkan menjadi `MutableStateFlow` (private) dan `StateFlow` (public) yang dikoleksi secara _lifecycle-aware_.

- Fitur pencarian berbasis tombol manual Modul 07 berevolusi menjadi pipa stream reaktif otomatis berbasis operator Flow.

## 3. Audiens

Mahasiswa S-1 Teknik Informatika / Sistem Informasi FILKOM Universitas Brawijaya pada mata kuliah Pemrograman Aplikasi Perangkat Bergerak (CIF62041) yang telah menyelesaikan Modul 06 (Arsitektur Layering) dan Modul 07 (REST API & Retrofit Callback).

## 4. Sumber Kebenaran Materi

Modul Praktikum 08 (Tahun 2026). Seluruh penamaan kelas, fungsi, dan identifier wajib identik dengan modul:

| Bagian       | Nama Resmi di Modul 08                                                              |
| ------------ | ----------------------------------------------------------------------------------- |
| Service REST | `StudentApiService` (`@GET("users")`, `@GET("users/{id}")`, `@GET("users/search")`) |
| Data Layer | `StudentRemoteDataSource` (fungsi `suspend`: `getStudents()`, `getStudent()`, `searchStudents()`) |
| Repository | `StudentRepository`, `DefaultStudentRepository` (fungsi `suspend` mengembalikan `List<Student>` dan `Student`) |
| DTO & Model | `UserResponse`, `UserDto` (`data/remote/dto`), `Student(id, name, email, university)` |
| Mapper | `fun UserDto.toStudent()` |
| ViewModel | `HomeViewModel`, `DetailViewModel` (menggunakan `viewModelScope.launch`) |
| State Holder | `_uiState` (`MutableStateFlow`), `uiState` (`StateFlow<HomeUiState>`), `searchQuery` (`StateFlow<String>`) |
| UI Collection | Composable `HomeScreen`, `DetailScreen` menggunakan `collectAsStateWithLifecycle()` |
| Operator Flow | `debounce(500)`, `distinctUntilChanged()`, `collectLatest` pada `observeSearch()` |
| Error & Pembatalan | Blok `try-catch` dengan klausul wajib `catch (e: CancellationException) { throw e }` |

**Arah Dependency & Aliran Data:**

`UI (Compose) → ViewModel (viewModelScope) → Repository (suspend) → Remote Data Source (suspend) → REST API (HTTP/JSON)`.

Event/Request mengalir ke kanan; State/Response mengalir ke kiri via StateFlow dan nilai kembalian `suspend`.

## 5. Cakupan Alur Materi (6 Scene)

Alur disusun berdasarkan pendekatan pedagogis _"Masalah $\rightarrow$ Solusi Sementara $\rightarrow$ Titik Jenuh $\rightarrow$ Solusi Ideal"_:

1. **Scene 1 — Titik Jenuh Callback (Fondasi & Kerapuhan Modul 07)**:

- Mengingatkan aturan emas Android: Main Thread tidak boleh dibebani operasi I/O (analogi kasir restoran cepat saji dan buzzer antrean).

- Tiga kerapuhan fatal callback: _Inverted Control Flow_ (lompatan membaca logika), _Pyramid of Doom_ (kaskade lambda bertingkat), dan _Lifecycle Blindness_ (pemanggilan UI yang sudah hancur berujung leak/crash).

2. **Scene 2 — Jembatan Konseptual: Coroutines & Kata Kunci `suspend**`:

- Perbandingan berdampingan (_side-by-side_) kode Callback vs Coroutine (Gambar 1 Modul 08).

- Analogi pembatas buku (_bookmark_): fungsi `suspend` menangguhkan eksekusi tanpa memblokir thread pemanggil.

- Penulisan gaya linear non-blocking (`val data = repository.getStudents()`) dan kembalinya penanganan error via blok `try-catch`.

- Penegasan _main-safety_ Retrofit: panggilan suspend Retrofit aman dipanggil langsung tanpa pembungkus `withContext(Dispatchers.IO)`.

3. **Scene 3 — Disiplin Structured Concurrency (`viewModelScope`)**:

- Pohon hierarki pekerjaan: coroutine terikat pada lifecycle pemiliknya (`viewModelScope`).

- Pembatalan otomatis: ketika pengguna menekan tombol Back / layar ditutup, seluruh proses anak dibatalkan secara bersih.

- Bahaya menelan `CancellationException`: keharusan melempar ulang exception pembatalan (`throw e`) agar rantai pembatalan tidak rusak.

4. **Scene 4 — Evolusi Penampung State (`StateFlow` & Lifecycle-Aware)**:

- Dari `mutableStateOf` menjadi `MutableStateFlow` privat di ViewModel dan `StateFlow` read-only untuk UI.

- Konsumsi UI berbasis daur hidup: Composable mengoleksi state menggunakan `collectAsStateWithLifecycle()` yang otomatis aktif saat UI terlihat dan berhenti saat UI di latar belakang.

5. **Scene 5 — Aliran Data Reaktif (Pencarian Otomatis dengan Flow)**:

- Membedakan kebutuhan _One-Shot_ (`suspend`) dengan _Data Stream_ (`Flow`).

- Visualisasi konveyor pipa operator pencarian (Gambar 3 Modul 08): `searchQuery` $\rightarrow$ `debounce(500)` $\rightarrow$ `distinctUntilChanged()` $\rightarrow$ `collectLatest` $\rightarrow$ `repository.searchStudents()`.

- Perilaku `collectLatest`: membatalkan request lama yang sedang berjalan saat input teks baru tiba.

6. **Scene 6 — Peta Refactoring Lapisan & Jembatan ke Modul 09**:

- Diff panel menyeluruh sebelum vs sesudah refactoring pada 4 lapisan aplikasi.

- Rangkuman Berubah vs Tetap pada Modul 08.

- Jembatan materi: Coroutines dan Flow yang dipelajari akan menjadi fondasi utama penyimpanan lokal Room Database dan DataStore pada Modul 09.

## 6. Spesifikasi Teknis

- Platform: Vite + React + TypeScript (strict) + Remotion (`@remotion/player`).

- Target Tampilan: 1920×1080 (16:9), 30 FPS.

- Navigasi: Berbasis Stop Engine linear (`useStopProgress`), dikendalikan melalui keyboard (`ArrowRight`/`PageDown`/`Space` untuk Next, `ArrowLeft`/`PageUp` untuk Prev) dan klik mouse.

- Kemandirian Jaringan: 100% offline, tanpa `fetch` atau panggilan HTTP live ke DummyJSON. Seluruh simulasi data menggunakan konstanta di `src/assets/code.ts`.

## 7. Non-Goals (Batasan Ruang Lingkup)

- Tidak ada implementasi runtime Android yang dijalankan di dalam browser; deck adalah media visualisasi arsitektural.

- Tidak membahas operasi mutasi REST (POST, PUT, DELETE).

- Tidak membahas implementasi Room Database, DataStore, atau dependency injection Hilt/Koin (Room dan DataStore dikunci sebagai materi Modul 09).

- Tidak ada elemen form, scroll bar aktif, tombol kontrol browser bawaan, atau teks narasi dosen di layar.

- Dilarang menampilkan field data sensitif DummyJSON (`password`, `ssn`, nomor kartu kredit, IP) pada seluruh cuplikan kode.

## 8. Koreksi Miskonsepsi yang Dijaga

- **Coroutine bukanlah thread baru**: Coroutine adalah tugas komputasi kooperatif ringan yang berjalan di atas thread pool yang sudah ada.

- **`suspend` tidak memblokir Main Thread**: Kata kunci `suspend` menandai titik jeda (_suspension point_) yang melepaskan thread untuk tugas rendering lainnya.

- **Retrofit suspend sudah _main-safe_**: Mahasiswa dilarang membungkus panggilan API Retrofit dengan `withContext(Dispatchers.IO)` secara berlebihan karena Retrofit menanganinya secara asinkron di balik layar.

- **`CancellationException` tidak boleh diubah menjadi pesan error UI**: Pembatalan adalah mekanisme kendali normal dalam coroutine; exception ini wajib di-_throw_ kembali.

- **`StateFlow` tidak boleh dibaca dengan `.value` langsung di Composable**: Nilai harus dikoleksi menggunakan `collectAsStateWithLifecycle()` agar recomposition berjalan reaktif dan hemat baterai.

- **Perbedaan One-Shot dan Stream**: Operasi ambil data profil cukup memakai fungsi `suspend`; pencarian query teks yang terus berubah memerlukan `Flow`.

## 9. Kriteria Sukses

- Dosen dapat mendemonstrasikan transisi konsep dari callback Modul 07 ke Coroutines & Flow Modul 08 secara mulus tanpa ketergantungan internet.

- Navigasi maju-mundur menghasilkan visual yang konsisten dan stabil pada resolusi proyektor 1080p.

- Seluruh terminologi, alur data, dan struktur kode identik dengan Modul Praktikum 08 FILKOM UB 2026.

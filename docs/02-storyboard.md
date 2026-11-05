# 02 — Storyboard Modul 08: Kotlin Coroutines & Flow

## Aturan Umum

- `Stop 0` = kondisi awal scene (transisi masuk `sceneIn`, kecuali Scene 1 Stop 0)[cite: 26]. `Stop N` = kondisi setelah $N$ kali Next di dalam scene[cite: 26].
- **Frames** = durasi transisi (30 FPS) MENUJU stop tersebut[cite: 26]. Angka sebenarnya didefinisikan di `src/deck/stops.ts`; tabel ini harus identik[cite: 26].
- **Narasi** adalah naskah lisan dosen dan **TIDAK ditampilkan di layar**[cite: 24, 26].
- Semua scene berlatar terang (`--bg-light`), kecuali panel kode dan diagram editor yang menggunakan latar gelap (`--editor-bg` / Dracula)[cite: 26, 28, 30].
- Grid 5 slot arsitektur: lebar slot 320px, jarak antar slot 40px ($5 \times 320 + 4 \times 40 = 1760\text{px}$, zona aman 80px di kedua sisi)[cite: 26, 28, 30]. Urutan lapisan kiri ke kanan: `UI (Compose)` $\rightarrow$ `ViewModel` $\rightarrow$ `Repository` $\rightarrow$ `Remote Data Source` $\rightarrow$ `REST API`[cite: 13, 26].
- Spesifikasi aset kode, teks panel, dan tipe data merujuk penuh pada `docs/03-code-assets.md`[cite: 26].

---

## Peta State Global (31 State, 30 Kali Next, Durasi 901 Frame)

| #   | Scene.Stop | Frames | Frame Akhir (_Settled_) | Topik Bahasan                                                                               |
| --- | ---------- | ------ | ----------------------- | ------------------------------------------------------------------------------------------- |
| 0   | 1.0        | 0      | 0                       | Aturan Emas Main Thread & Analogi Kasir/Buzzer[cite: 11, 26]                                |
| 1   | 1.1        | 30     | 30                      | Titik Jenuh 1: _Inverted Control Flow_ (Pembalikan Alur Pikir)[cite: 11]                    |
| 2   | 1.2        | 30     | 60                      | Titik Jenuh 2: _Pyramid of Doom_ (Kaskade Callback Bersarang)[cite: 11]                     |
| 3   | 1.3        | 30     | 90                      | Titik Jenuh 3: _Lifecycle Blindness_ & Risiko Kebocoran Memori[cite: 11]                    |
| 4   | 2.0        | 24     | 114                     | Komparasi Berdampingan: Callback vs Coroutine (Gambar 1 Modul 08)[cite: 11]                 |
| 5   | 2.1        | 36     | 150                     | Analogi Pembatas Buku (_Bookmark_): Penangguhan Eksekusi `suspend`[cite: 11]                |
| 6   | 2.2        | 36     | 186                     | Data Siap: Pembatas Buku Diangkat, Main Thread Melanjutkan Alur Linear[cite: 11]            |
| 7   | 2.3        | 30     | 216                     | Kembalinya Blok Alami `try-catch` Menggantikan `Result<T>`[cite: 11, 15]                    |
| 8   | 2.4        | 24     | 240                     | Penegasan _Main-Safety_: Retrofit Suspend Tanpa `Dispatchers.IO` Manual[cite: 14]           |
| 9   | 3.0        | 24     | 264                     | Fondasi _Structured Concurrency_: Hirarki Induk-Anak di `viewModelScope`[cite: 11, 16]      |
| 10  | 3.1        | 30     | 294                     | Peluncuran Pekerjaan: `viewModelScope.launch` Mengikat Pekerjaan Asinkron[cite: 11, 15]     |
| 11  | 3.2        | 30     | 324                     | Layar Ditutup: Pembersihan Otomatis Tanpa _Memory Leak_[cite: 11, 16]                       |
| 12  | 3.3        | 36     | 360                     | Bahaya Menelan Exception: Blok `catch (e: Exception)` Tanpa Re-throw[cite: 15, 21]          |
| 13  | 3.4        | 30     | 390                     | Aturan Mutlak Modul 08: `catch (e: CancellationException) { throw e }`[cite: 15, 21]        |
| 14  | 4.0        | 24     | 414                     | Evolusi Penampung State: Keterbatasan `mutableStateOf` Modul 07[cite: 10, 15]               |
| 15  | 4.1        | 30     | 444                     | Enkapsulasi: `_uiState` (Mutable privat) vs `uiState` (StateFlow publik)[cite: 11, 15]      |
| 16  | 4.2        | 30     | 474                     | Larangan Akses Langsung: Mengapa `.value` Berbahaya di Composable UI[cite: 11, 16]          |
| 17  | 4.3        | 36     | 510                     | Koleksi Sadar Siklus Hidup: `collectAsStateWithLifecycle()` Aktif di Layar[cite: 11, 16]    |
| 18  | 4.4        | 30     | 540                     | Otomasi Hemat Daya: Aliran Terhenti Saat Aplikasi Masuk Latar Belakang[cite: 11, 16]        |
| 19  | 5.0        | 24     | 564                     | Kebutuhan Transaksi Data: _One-Shot_ (`suspend`) vs _Stream_ Reaktif (`Flow`)[cite: 11, 17] |
| 20  | 5.1        | 30     | 594                     | Aliran Teks Masuk: StateFlow Query Menerima Karakter "j", "jo", "john"[cite: 17, 18]        |
| 21  | 5.2        | 36     | 630                     | Operator `debounce(500)`: Menahan Eksekusi Sebelum Pengguna Berhenti Ketik[cite: 17, 18]    |
| 22  | 5.3        | 30     | 660                     | Operator `distinctUntilChanged()`: Menyaring Input Teks yang Tidak Berubah[cite: 17, 18]    |
| 23  | 5.4        | 36     | 696                     | Operator `collectLatest`: Membatalkan Request Lama Saat Query Baru Tiba[cite: 11, 17, 18]   |
| 24  | 5.5        | 30     | 726                     | Eksekusi Pencarian Reaktif: Data REST API Menghasilkan State Terbaru[cite: 17, 18]          |
| 25  | 6.0        | 24     | 750                     | Peta Refactoring 5 Lapisan Arsitektur Modul 08[cite: 13, 20]                                |
| 26  | 6.1        | 30     | 780                     | Diff Lapisan Data: Service & Remote Data Source Murni `suspend`[cite: 14, 20]               |
| 27  | 6.2        | 30     | 810                     | Diff Lapisan Domain: Repository Mengekspos Model `Student` Linear[cite: 15, 20]             |
| 28  | 6.3        | 30     | 840                     | Diff Lapisan Presentasi: ViewModel Mengelola StateFlow & Launch Scope[cite: 15, 20]         |
| 29  | 6.4        | 30     | 870                     | Diff Lapisan UI: Compose Mengoleksi State Reaktif Tanpa Tombol Cari[cite: 16, 18, 20]       |
| 30  | 6.5        | 30     | 900                     | Rangkuman Final & Jembatan ke Modul 09 (Room Database & DataStore)[cite: 20, 21]            |

Total frame = 900 frame transisi ($900 + 1 = 901$ frame durasi komposisi Remotion pada 30 FPS)[cite: 26, 29].

---

## Scene 1 — Titik Jenuh Callback (Pain Points Modul 07)

**Tujuan**: Mengingatkan kembali aturan mutlak Android Main Thread lalu membongkar 3 kerapuhan mendasar arsitektur callback Modul 07 sebelum mengenalkan coroutine[cite: 11, 26].

**Layout**:

- Judul scene di atas ($y = 80\text{px}$)[cite: 26, 30].
- Area kiri ($x = 80\text{px}$, lebar 860px): Diagram ilustrasi jalur waktu Main Thread vs Background Thread (analogi kasir restoran dan buzzer antrean)[cite: 26].
- Area kanan ($x = 980\text{px}$, lebar 860px): Panel kode Dracula menampilkan cuplikan callback Modul 07 dengan kartu peringatan masalah[cite: 26, 30].

| Stop | Aksi                          | Yang Tampil di Layar                                                                                                                                                                                                                                                                                                                                                                                                                       | Frames |
| ---- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 0    | n/a                           | Judul "Aturan Emas: Main Thread Hanya untuk UI". Diagram kasir: kasir melayani antrean tanpa memasak ayam; memberikan _buzzer_ antrean (token penyeranta). Panel kanan: cuplikan kode `api.getUsers().enqueue(...)`[cite: 11, 26, 27]. Teks bawah: "Modul 07: Callback melepas beban jaringan ke background thread agar UI tidak mengalami ANR."[cite: 11, 26]                                                                             | 0      |
| 1    | `focusGrow` + `callout`       | Diagram kasir meredup. Panel kode menampilkan sorotan pada kurung kurawal `onResponse { ... }`[cite: 27]. Panah melengkung zigzag merah menunjuk lompatan alur eksekusi. Kartu masalah 1 muncul: **"Pembalikan Alur Pikir (Inverted Control Flow)"** — kode tidak dieksekusi secara linear; logika melompat ke dalam kurung kurawal saat respon tiba[cite: 11].                                                                            | 30     |
| 2    | `codePanel` swap + `popIn`    | Panel kanan berganti menampilkan piramida kode bersarang 3 tingkat: `getUserId { user -> getProfile(user) { profile -> getPosts(...) { ... } } }`. Indentasi kode menjorok ekstrem ke kanan. Kartu masalah 2 muncul: **"Kaskade Bersarang (Pyramid of Doom)"** — alur berantai membuat pemeliharaan kode menjadi sangat rapuh[cite: 11].                                                                                                   | 30     |
| 3    | `phoneState` + `arcForbidden` | Mockup ponsel muncul di kiri menampilkan transisi layar ditutup (tombol Back ditekan)[cite: 26, 29]. Garis putus-putus merah dari background thread berusaha mengirim data ke layar yang sudah hancur. Tanda silang merah besar (`--err`) muncul. Kartu masalah 3: **"Kebutaan Daur Hidup (Lifecycle Blindness)"** — callback tidak peduli apakah layar masih hidup, memicu kebocoran memori (_memory leak_) atau crash[cite: 11, 26, 29]. | 30     |

**Narasi Dosen:**

- Stop 0: _"Di Modul 07 kita belajar bahwa Main Thread tidak boleh di-block oleh operasi jaringan. Solusi awalnya adalah callback: seperti kasir memberi buzzer antrean kepada pembeli."[cite: 11, 26]_
- Stop 1: _"Namun callback punya titik jenuh. Pertama: pembalikan alur pikir. Otak manusia membaca kode dari atas ke bawah, tetapi callback memaksa kita melompat ke dalam kurung kurawal masa depan."[cite: 11]_
- Stop 2: _"Kedua: callback hell. Begitu kita butuh request data yang saling bergantung secara berurutan, kodenya menjorok ke kanan membentuk piramida yang mengerikan."[cite: 11]_
- Stop 3: _"Yang paling berbahaya: callback itu buta siklus hidup. Ketika pengguna menekan tombol Back dan layar ditutup, callback jaringan yang baru selesai tetap berusaha menyentuh UI yang sudah mati. Kita butuh solusi yang lebih cerdas."[cite: 11]_

---

## Scene 2 — Konsep Suspend & Analogi Pembatas Buku

**Tujuan**: Memperkenalkan kata kunci `suspend` sebagai mekanisme penangguhan kooperatif (_pause & resume_) yang menjaga penulisan kode tetap linear tanpa memblokir thread[cite: 10, 11].

**Layout**:

- Judul scene di atas: _"Kotlin Coroutines: Pause & Resume Tanpa Memblokir"_[cite: 10, 11].
- Dua jendela editor berdampingan ($y = 220\text{px}$, tinggi 640px, masing-masing lebar 840px)[cite: 11, 30]:
  - Kiri: Callback Modul 07 (`COMPARE_CALLBACK`)[cite: 11, 27].
  - Kanan: Coroutine Modul 08 (`COMPARE_COROUTINE`)[cite: 11, 27].
- Jalur visualisasi Main Thread di bagian bawah ($y = 900\text{px}$)[cite: 26, 30].

| Stop | Aksi                           | Yang Tampil di Layar                                                                                                                                                                                                                                                                                                                                                      | Frames |
| ---- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 0    | `sceneIn`                      | Perbandingan berdampingan (Gambar 1 Modul 08)[cite: 11]. Editor kiri: blok `repository.getStudents { result -> ... }` dengan lambda `onSuccess` & `onFailure`[cite: 11, 27]. Editor kanan: `viewModelScope.launch { val data = repository.getStudents(); updateUi(data) }`[cite: 11, 27]. Teks bawah: "Gaya sekuensial linear, perilaku asinkron non-blocking."[cite: 11] | 24     |
| 1    | `bookmarkPause` + `laneBranch` | Fokus membesar pada editor kanan. Saat baris `val data = repository.getStudents()` dieksekusi, ornamen pita emas **Pembatas Buku (`--c-bookmark`)** menancap pada baris tersebut[cite: 11, 15]. Garis Main Thread di bawah tetap berjalan lancar menggambar UI (chip `UI Responsif`). Badge status: _"Thread Dilepas (Suspended)"_[cite: 10, 11].                         | 36     |
| 2    | `bookmarkResume` + `pulse`     | Paket data dari server tiba di latar belakang[cite: 26, 29]. Pita emas pembatas buku terangkat dengan efek kilau halus. Eksekusi berlanjut persis di baris berikutnya: `updateUi(data)` dipanggil secara sekuensial[cite: 11]. Badge status: _"Melanjutkan Eksekusi (Resumed)"_[cite: 10, 11].                                                                            | 36     |
| 3    | `codePanel` swap               | Editor kanan berganti menampilkan fungsi lengkap dengan blok `try-catch` alami: `try { val data = repository.getStudents(); updateUi(data) } catch (e: Exception) { showError(e) }`[cite: 11, 15]. Teks penjelas: "Tidak ada lagi pembungkus `Result.success` / `Result.failure`. Penanganan error kembali ke sintaksis alami bahasa Kotlin."[cite: 11, 15]               | 30     |
| 4    | `popIn` + `layerTag`           | Kotak penegasan arsitektur muncul di bawah: **"Mitos Dispatchers.IO pada Retrofit"**[cite: 14]. Kode `StudentRemoteDataSource` disorot[cite: 14]. Teks: "Retrofit suspend sudah secara otomatis aman dijalankan di Main Thread (_main-safe_). Dilarang membungkus panggilan Retrofit dengan `withContext(Dispatchers.IO)`."[cite: 14]                                     | 24     |

**Narasi Dosen:**

- Stop 0: _"Perhatikan Gambar 1 dari modul praktikum kita. Di sebelah kiri adalah kode callback Modul 07, di sebelah kanan adalah Coroutine. Keduanya sama-sama asinkron dan non-blocking, tetapi coroutine dibaca lurus dari atas ke bawah."[cite: 11]_
- Stop 1: _"Bagaimana coroutine bekerja tanpa memblokir thread? Ingat analogi Pembatas Buku. Saat fungsi suspend dipanggil, coroutine menaruh pembatas buku di baris itu, lalu melepaskan thread agar bisa dipakai menggambar UI."[cite: 10, 11]_
- Stop 2: _"Begitu internet selesai mengunduh data, pembatas buku diangkat dan eksekusi dilanjutkan tepat di baris berikutnya. Kode yang tadinya asinkron terasa seperti kode biasa."[cite: 10, 11]_
- Stop 3: _"Keuntungan besarnya: kita tidak perlu lagi membungkus kode dengan Result.onSuccess atau onFailure. Penanganan error kembali menggunakan try-catch yang sudah sangat kita kenal."[cite: 11, 15]_
- Stop 4: _"Catatan penting dari modul: fungsi suspend milik Retrofit sudah main-safe secara bawaan. Jangan latah menambahkan withContext(Dispatchers.IO) untuk panggilan API Retrofit."[cite: 14]_

---

## Scene 3 — Disiplin Structured Concurrency (`viewModelScope`)

**Tujuan**: Memahami hierarki lifecycle pembatalan otomatis coroutine pada `ViewModel` serta aturan mutlak penanganan `CancellationException`[cite: 10, 11, 15, 16].

**Layout**:

- Judul scene di atas: _"Structured Concurrency & Batas Siklus Hidup"_[cite: 10, 11].
- Kiri ($x = 80\text{px}$, lebar 800px): Pohon hierarki induk-anak (_Parent-Child Scope Tree_) antara `ViewModel`, `viewModelScope`, dan _Coroutine Job_[cite: 11, 16].
- Kanan ($x = 940\text{px}$, lebar 900px): Panel kode Dracula menampilkan implementasi `loadStudents()` di `HomeViewModel.kt`[cite: 15, 30].

| Stop | Aksi                       | Yang Tampil di Layar                                                                                                                                                                                                                                                                                                                                                                                                                                         | Frames |
| ---- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 0    | `sceneIn`                  | Pohon hierarki di kiri: kotak induk `HomeViewModel` menaungi lingkaran `viewModelScope`[cite: 15, 16]. Panel kanan: deklarasi `class HomeViewModel : ViewModel()` dan pemanggilan fungsi[cite: 15]. Teks bawah: "Coroutine tidak boleh bekerja secara liar tanpa batas lifecycle."[cite: 10, 11]                                                                                                                                                             | 24     |
| 1    | `flowArrow` + `popIn`      | Di dalam `viewModelScope`, cabang pekerjaan `launch { ... }` terbentuk (Job #1: Ambil Mahasiswa)[cite: 15]. Node pekerjaan berdenyut hijau (`--ok`). Panel kanan menyorot baris `viewModelScope.launch { ... }`[cite: 15]. Teks: "Pekerjaan asinkron terikat kuat pada siklus hidup ViewModel penampungnya."[cite: 11, 16]                                                                                                                                   | 30     |
| 2    | `focusBox` + `laserCut`    | Simulasi pengguna menekan tombol Back pada ponsel: `HomeViewModel` hancur (`onCleared` dipicu)[cite: 16]. Garis pembatalan neon menyapu pohon hierarki: `viewModelScope` dibersihkan, dan Job #1 seketika dibatalkan secara otomatis[cite: 16]. Teks: "Pekerjaan dibatalkan otomatis saat ViewModel dibersihkan. Memory leak tereliminasi."[cite: 11, 16]                                                                                                    | 30     |
| 3    | `codePanel` swap + `pulse` | Panel kanan menampilkan contoh blok catch yang SALAH: `catch (e: Exception) { _uiState.value = HomeUiState(errorMessage = e.message) }`[cite: 15, 21]. Peringatan bahaya merah berkedip: _"Peringatan: CancellationException ikut tertelan!"_[cite: 18, 21] Teks: "Ketika pekerjaan dibatalkan, Kotlin melempar CancellationException. Jika ditelan oleh catch Exception umum, mekanisme pembatalan terganggu dan UI menampilkan error palsu."[cite: 18, 21] | 36     |
| 4    | `keyLines` + `layerTag`    | Panel kanan diperbarui dengan kode BENAR Modul 08: baris `catch (e: CancellationException) { throw e }` menyala terang di atas `catch (e: Exception)`[cite: 15, 18]. Chip verifikasi hijau muncul: _"Structured Cancellation Terjaga"_[cite: 21]. Teks: "Aturan mutlak: tangkap dan lempar ulang (throw) CancellationException agar coroutine berhenti dengan bersih."[cite: 15, 18, 21]                                                                     | 30     |

**Narasi Dosen:**

- Stop 0: _"Di dunia Android modern, kita menerapkan Structured Concurrency. Setiap coroutine wajib memiliki atasan yang bertanggung jawab terhadap siklus hidupnya."[cite: 11]_
- Stop 1: _"Pada arsitektur aplikasi kita, atasan itu adalah viewModelScope. Saat ViewModel memanggil viewModelScope.launch, ia melahirkan pekerjaan anak yang terpantau."[cite: 11, 15, 16]_
- Stop 2: _"Ketika pengguna menekan Back dan layar ditutup, ViewModel dihancurkan. Secara otomatis, viewModelScope membatalkan seluruh request jaringan yang masih berjalan. Tidak ada memory leak, tidak ada crash."[cite: 11, 16]_
- Stop 3: _"Namun ada jebakan fatal yang sering dilakukan mahasiswa: menulis catch (e: Exception) biasa. Padahal, pembatalan coroutine bekerja dengan cara melempar CancellationException di balik layar."[cite: 18, 21]_
- Stop 4: _"Jika exception itu tertelan, coroutine mengira terjadi error jaringan biasa dan menampilkan pesan gagal di layar. Modul 08 mewajibkan: tangkap CancellationException secara terpisah dan lempar kembali dengan throw e."[cite: 15, 18, 21]_

---

## Scene 4 — Penampung State: `StateFlow` & Lifecycle-Aware

**Tujuan**: Memahami evolusi state holder dari `mutableStateOf` ke `StateFlow`, pentingnya enkapsulasi hak akses, dan penggunaan `collectAsStateWithLifecycle()` di Compose[cite: 10, 11, 15, 16].

**Layout**:

- Judul scene di atas: _"Evolusi State: Dari Compose State ke StateFlow"_[cite: 10, 11].
- Area kiri ($x = 80\text{px}$, lebar 860px): Diagram kotak enkapsulasi di ViewModel dan konektor aliran data reaktif[cite: 13, 15].
- Area kanan ($x = 980\text{px}$, lebar 860px): Mockup ponsel Compose berdampingan dengan panel kode `HomeScreen.kt`[cite: 16, 26, 30].

| Stop | Aksi                        | Yang Tampil di Layar                                                                                                                                                                                                                                                                                                                                                         | Frames |
| ---- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 0    | `sceneIn`                   | Rekap Modul 07: `mutableStateOf` di dalam ViewModel[cite: 15]. Kotak penjelas: "Di Modul 07 state terikat langsung ke pustaka Compose runtime di dalam ViewModel. Di Modul 08 kita meningkatkan state menjadi aliran standar Kotlin Coroutines: `StateFlow`."[cite: 10, 11, 15]                                                                                              | 24     |
| 1    | `splitBlock` + `fieldLight` | Diagram enkapsulasi di ViewModel muncul[cite: 15]:<br>- Lapisan dalam: `_uiState` berlabel merah `private val` bertipe `MutableStateFlow` (dapat diubah oleh ViewModel saja)[cite: 11, 15].<br>- Lapisan luar: `uiState` berlabel hijau `public val` bertipe `StateFlow` via `.asStateFlow()` (read-only untuk UI)[cite: 11, 15].                                            | 30     |
| 2    | `arcForbidden` + `popIn`    | Garis akses langsung dari UI ke `_uiState.value` digambar dengan tanda silang merah (`--err`)[cite: 26, 29]. Teks: "Dilarang membaca `.value` secara statis di Composable UI. UI tidak akan merender ulang secara reaktif ketika ada emisi data baru."[cite: 11, 16]                                                                                                         | 30     |
| 3    | `flowArrow` + `phoneState`  | Garis koneksi ungu (`--arrow-state`) menghubungkan `StateFlow` ke Composable `HomeScreen` melalui `collectAsStateWithLifecycle()`[cite: 11, 16, 28]. Mockup ponsel menyala terang menampilkan indikator status hijau: _"Lifecycle: STARTED / RESUMED (Koleksi Aktif)"_[cite: 11, 16]. Data profil mahasiswa tampil di layar ponsel[cite: 16, 26].                            | 36     |
| 4    | `dim` + `layerTag`          | Ponsel dialihkan ke kondisi latar belakang (aplikasi di-minimize)[cite: 16]. Lampu indikator status meredup menjadi kuning: _"Lifecycle: STOPPED (Koleksi Dijeda)"_[cite: 16]. Aliran panah berhenti seketika. Teks: "`collectAsStateWithLifecycle()` menghentikan konsumsi data saat UI tidak terlihat di layar. Menghemat baterai dan siklus CPU perangkat."[cite: 11, 16] | 30     |

**Narasi Dosen:**

- Stop 0: _"Di Modul 07 kita memakai mutableStateOf. Namun untuk arsitektur yang bersih dan independen, penampung state di ViewModel kita ganti menjadi StateFlow."[cite: 10, 11, 15]_
- Stop 1: _"Terapkan prinsip enkapsulasi: MutableStateFlow disimpan private dengan awalan underscore agar hanya ViewModel yang bisa mengubah nilai, sedangkan UI hanya menerima StateFlow yang bersifat read-only."[cite: 11, 15]_
- Stop 2: _"Jangan sekali-kali membaca StateFlow dengan memanggil .value langsung di dalam Composable. Nilai itu hanya dibaca satu kali dan antarmuka kalian tidak akan ter-update ketika data baru tiba."[cite: 11, 16]_
- Stop 3: _"Cara yang benar adalah mengoleksinya menggunakan collectAsStateWithLifecycle(). Selama layar aktif berada di depan pengguna, setiap perubahan state akan langsung dirender menjadi piksel."[cite: 11, 16]_
- Stop 4: _"Hebatnya fungsi ini: begitu pengguna memencet tombol Home dan aplikasi masuk ke background, koleksi state langsung dihentikan otomatis. Baterai pengguna tidak terkuras sia-sia."[cite: 11, 16]_

---

## Scene 5 — Aliran Data Reaktif (Pencarian Otomatis dengan Flow)

**Tujuan**: Membedakan transaksi _one-shot_ dengan _data stream_, lalu membedah pipeline operator Flow pada pencarian reaktif (Gambar 3 Modul 08)[cite: 10, 11, 17].

**Layout**:

- Judul scene di atas: _"Pencarian Reaktif: Mengalirkan Data Lewat Pipa Flow"_[cite: 10, 17].
- Rel Konveyor Pipa Aliran (Gambar 3 Modul 08) di tengah ($y = 260\text{px}$ sampai $y = 560\text{px}$, 7 node lingkaran huruf A–G)[cite: 17]:
  - ① Node A: `"j"` $\rightarrow$ ② Node B: `"ja"` $\rightarrow$ ③ Node C: `"john"` $\rightarrow$ ④ Node D: `debounce(500)` $\rightarrow$ ⑤ Node E: `collectLatest` $\rightarrow$ ⑥ Node F: `searchStudents()` $\rightarrow$ ⑦ Node G: `HomeUiState`[cite: 17].
- Panel kode `observeSearch()` di bawah ($y = 600\text{px}$, tinggi 380px)[cite: 18, 30].

| Stop | Aksi                            | Yang Tampil di Layar                                                                                                                                                                                                                                                                                                                                                                    | Frames |
| ---- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 0    | `sceneIn`                       | Judul dan perbandingan konsep: **Operasi One-Shot** (ambil list/detail cukup satu fungsi `suspend`) vs **Aliran Reaktif / Stream** (ketikan teks pencarian yang terus memancar dari waktu ke waktu membutuhkan `Flow`)[cite: 10, 11]. Rel pipa 7 stasiun muncul dalam kondisi nonaktif[cite: 17]. Tombol "Cari" Modul 07 diberi tanda silang (dihapus)[cite: 18].                       | 24     |
| 1    | `packetFly` + `pipeStream`      | Pengguna mengetik cepat di TextField: partikel teks `"j"`, `"ja"`, dan `"john"` memancar dari `searchQuery` menuju pipa Flow (Node A, B, dan C aktif berurutan)[cite: 17, 18, 29]. Panel kode menyorot `searchQuery.debounce(500)`[cite: 18].                                                                                                                                           | 30     |
| 2    | `debounceHold`                  | Partikel `"j"` dan `"ja"` tertahan dan melebur di gerbang Node D (**debounce 500 ms**)[cite: 17]. Jam pasir animasi berputar selama 500 ms[cite: 17, 18]. Teks: "Debounce menahan eksekusi. Selama pengguna masih terus mengetik sebelum 500 ms berlalu, tidak ada request jaringan yang dikirim."[cite: 17, 18]                                                                        | 36     |
| 3    | `pulse` + `gateCheck`           | Pengguna berhenti mengetik kata `"john"`[cite: 17, 18]. Filter `distinctUntilChanged()` memeriksa teks: lolos karena berbeda dari query sebelumnya[cite: 17, 18]. Partikel `"john"` meluncur melewati Node D menuju Node E (`collectLatest`)[cite: 17].                                                                                                                                 | 30     |
| 4    | `cancelBurst` + `collectCancel` | Skenario pembatalan: ketika sebuah request lama untuk query `"joh"` masih menunggu balasan server, partikel baru `"john"` tiba di `collectLatest`[cite: 17, 19]. Request lama meledak/padam seketika (`cancelBurst`), dan blok eksekusi digantikan oleh query terbaru[cite: 17, 19]. Teks: "`collectLatest` membatalkan pekerjaan sebelumnya bila nilai baru datang."[cite: 11, 17, 19] | 36     |
| 5    | `flowArrow` + `phoneState`      | Partikel `"john"` masuk ke Node F (`repository.searchStudents("john")`), lalu menghasilkan Node G (`HomeUiState` dengan daftar profil hasil pencarian)[cite: 17, 18]. Mockup ponsel menampilkan kartu mahasiswa Emily Johnson dan kawan-kawan secara otomatis tanpa sentuhan tombol[cite: 18, 26].                                                                                      | 30     |

**Narasi Dosen:**

- Stop 0: _"Untuk memuat data profil atau detail, kita cukup memakai suspend function karena transaksinya one-shot: minta sekali, terima sekali, selesai. Tetapi bagaimana dengan fitur pencarian teks yang terus mengalir huruf demi huruf? Di sinilah Flow berperan sebagai pipa air reaktif."[cite: 10, 11]_
- Stop 1: _"Lihat Gambar 3 dari modul. Tombol Cari manual dari Modul 07 kita buang. Sekarang, setiap perubahan huruf di TextField langsung memancarkan nilai baru ke dalam pipa Flow."[cite: 17, 18]_
- Stop 2: _"Bayangkan jika setiap huruf langsung menembak server: server DummyJSON akan kewalahan. Operator debounce(500) bertindak sebagai bendungan yang menahan air sampai pengguna berhenti mengetik selama setengah detik."[cite: 17, 18]_
- Stop 3: _"Operator distinctUntilChanged memastikan kita tidak memproses kata yang sama berulang kali bila teksnya tidak berubah."[cite: 17, 18]_
- Stop 4: _"Inilah keajaiban collectLatest: jika request lama belum selesai dan pengguna mengetik huruf baru, request lama langsung dibatalkan secara bersih. Aplikasi hanya mengolah hasil yang paling relevan."[cite: 11, 17, 19]_
- Stop 5: _"Hasil pencarian mengalir langsung ke HomeUiState dan layar ter-update otomatis. Bersih, reaktif, dan sangat hemat kuota internet."[cite: 17, 18]_

---

## Scene 6 — Peta Refactoring & Jembatan ke Modul 09

**Tujuan**: Memeriksa perubahan kode sebelum vs sesudah pada seluruh lapisan dan membuktikan janji arsitektur Modul 08 sebelum melangkah ke penyimpanan lokal Room Database[cite: 13, 20, 21].

**Layout**:

- Baris atas ($y = 80\text{px}$): 5 kotak lapisan arsitektur (lebar 320px)[cite: 26, 30].
- Lencana status ($y = 200\text{px}$): Penanda status tiap lapisan (`⚡ DIUBAH` / `✓ TETAP`)[cite: 26, 30].
- Banner judul refactoring ($y = 270\text{px}$)[cite: 26].
- Panel Visual Diff ($x = 80\text{px}$, $y = 360\text{px}$, dimensi $1760 \times 620\text{px}$)[cite: 26, 30].

| Stop | Aksi                     | Yang Tampil di Layar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Frames |
| ---- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 0    | `sceneIn`                | Kelima kotak lapisan tampil berjajar. Banner: _"Peta Perubahan: Dari Callback Modul 07 ke Coroutines & Flow Modul 08"_[cite: 10, 13, 26]. Panel menampilkan teks: "Kita periksa perbedaan kode di tiap lapisan, dari data layer paling bawah hingga presentation layer."[cite: 13, 26]                                                                                                                                                                                                                                                                                                                                                                                                                                         | 24     |
| 1    | `focusBox` + `diffPanel` | Kotak **Remote Data Source** menyala (`⚡ DIUBAH`)[cite: 26, 30]. Banner: _"Remote Data Source: Menghapus Call & Callback, Murni Suspend"_[cite: 14, 26]. Panel diff menampilkan `DIFFS[0]`: baris `Call<UserResponse>` dan `enqueue` merah dihapus ($-$), digantikan fungsi satu baris `suspend fun getUsers() = api.getUsers().users` hijau ($+$)[cite: 14, 27].                                                                                                                                                                                                                                                                                                                                                             | 30     |
| 2    | `focusBox` + `diffPanel` | Kotak **Repository** menyala (`⚡ DIUBAH`)[cite: 26, 30]. Banner: _"Repository: Kontrak Suspend & Pemetaan DTO ke Domain"_[cite: 15, 26]. Panel diff menampilkan `DIFFS[1]`: lambda callback dihapus, fungsi suspend memetakan DTO via `.map { it.toStudent() }` secara linear[cite: 15, 27].                                                                                                                                                                                                                                                                                                                                                                                                                                  | 30     |
| 3    | `focusBox` + `diffPanel` | Kotak **ViewModel** menyala (`⚡ DIUBAH`)[cite: 26, 30]. Banner: _"ViewModel: viewModelScope, StateFlow, dan Penanganan Error Alami"_[cite: 15, 26]. Panel diff menampilkan `DIFFS[2]`: migrasi `mutableStateOf` ke `MutableStateFlow` privat dan blok `try-catch` terstruktur dengan re-throw `CancellationException`[cite: 15, 27].                                                                                                                                                                                                                                                                                                                                                                                          | 30     |
| 4    | `focusBox` + `diffPanel` | Kotak **Composable UI** menyala (`⚡ DIUBAH`)[cite: 26, 30]. Banner: _"UI Layer: Pengoleksian Sadar Daur Hidup & TextField Reaktif"_[cite: 16, 18, 26]. Panel diff menampilkan `DIFFS[3]`: pembacaan state via `collectAsStateWithLifecycle()`, penghapusan tombol cari manual, dan penghubungan langsung ke query Flow[cite: 16, 18, 27].                                                                                                                                                                                                                                                                                                                                                                                     | 30     |
| 5    | `summaryPanel`           | Seluruh kotak menyala terang (`✓ TERPADU`)[cite: 26, 30]. Panel diff berganti menjadi tabel 2 kolom **Berubah vs Tetap** (`SUMMARY_ITEMS`)[cite: 26, 27]:<br>- **Berubah**: Call/enqueue $\rightarrow$ suspend, Result $\rightarrow$ try-catch, mutableStateOf $\rightarrow$ StateFlow, UI $\rightarrow$ collectAsStateWithLifecycle, Tombol cari $\rightarrow$ Flow pipeline[cite: 10, 11, 14, 15, 16, 18, 27].<br>- **Tetap**: Aliran dependency `UI → VM → Repo → RDS`, Model `Student(id, name, email, university)`, UI tidak mengenal Retrofit, Navigasi Home-Detail-Back[cite: 13, 20, 27].<br>Baris bawah emas: **"Berikutnya: Menyimpan Data Offline dengan Room Database & DataStore (Modul 09)"**[cite: 21, 26, 27]. | 30     |

**Narasi Dosen:**

- Stop 0: _"Mari kita rekap perubahan arsitektur aplikasi kita secara menyeluruh. Kita periksa lapis demi lapis apa yang berubah dan apa yang tetap."[cite: 13, 26]_
- Stop 1: _"Di Remote Data Source, kode kita menyusut drastis. Call dan Callback resmi dibuang; fungsinya sekarang murni suspend satu baris."[cite: 14]_
- Stop 2: _"Repository tidak lagi menerima fungsi callback lambda. Ia mengeksekusi suspend service lalu memetakan DTO ke Student secara elegan."[cite: 15]_
- Stop 3: _"ViewModel kini sepenuhnya mengendalikan asinkron lewat viewModelScope. State dipegang oleh StateFlow dan error ditangani oleh blok try-catch yang aman dari pembatalan."[cite: 15]_
- Stop 4: _"Di UI, Composable kita mengoleksi state secara hemat baterai dengan collectAsStateWithLifecycle, dan TextField langsung memicu pencarian otomatis."[cite: 16, 18]_
- Stop 5: _"Janji arsitektur Android terbukti: kita merombak total paradigma komputasi asinkron, tetapi batasan lapisan antarmuka tetap kokoh. Coroutine dan Flow yang kalian kuasai hari ini akan menjadi senjata utama kita di Modul 09 saat kita menghubungkan aplikasi ke database lokal Room dan DataStore!"[cite: 13, 20, 21]_

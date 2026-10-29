# 02 — Storyboard Modul 07

## Aturan umum
- `Stop 0` = kondisi awal scene (transisi masuk `sceneIn`, kecuali Scene 1). `Stop N` = kondisi setelah N kali Next di dalam scene.
- **Frames** = durasi transisi (30 fps) MENUJU stop itu. Angka sebenarnya ada di `src/deck/stops.ts`; tabel ini harus identik.
- **Narasi** adalah naskah lisan dosen, TIDAK ditampilkan di layar.
- Semua scene berlatar terang (`--bg-light`); panel kode berlatar gelap (`--editor-bg`).
- Grid 5 slot: lebar slot 320px, jarak 40px (5×320 + 4×40 = 1760, zona aman 80px). Urutan lapisan kiri→kanan: UI, ViewModel, Repository, Remote Data Source, REST API.
- Nama efek didefinisikan di `05-animation-delta.md` dan `docs-modul06/05-animation-spec.md`.
- Spesifikasi data (JSON, kode, teks panel) ada di `03-code-assets.md`.

## Peta state global (39 state, 38 kali Next)
| # | Scene.Stop | Frames | Frame akhir (settled) |
|---|---|---|---|
| 0 | 1.0 | 0 | 0 |
| 1 | 1.1 | 30 | 30 |
| 2 | 2.0 | 18 | 48 |
| 3 | 2.1 | 36 | 84 |
| 4 | 2.2 | 36 | 120 |
| 5 | 2.3 | 36 | 156 |
| 6 | 2.4 | 36 | 192 |
| 7 | 3.0 | 24 | 216 |
| 8 | 3.1 | 60 | 276 |
| 9 | 3.2 | 60 | 336 |
| 10 | 3.3 | 30 | 366 |
| 11 | 3.4 | 30 | 396 |
| 12 | 4.0 | 24 | 420 |
| 13 | 4.1 | 30 | 450 |
| 14 | 4.2 | 30 | 480 |
| 15 | 4.3 | 36 | 516 |
| 16 | 4.4 | 30 | 546 |
| 17 | 5.0 | 24 | 570 |
| 18 | 5.1 | 36 | 606 |
| 19 | 5.2 | 36 | 642 |
| 20 | 5.3 | 36 | 678 |
| 21 | 5.4 | 36 | 714 |
| 22 | 5.5 | 36 | 750 |
| 23 | 6.0 | 24 | 774 |
| 24 | 6.1 | 30 | 804 |
| 25 | 6.2 | 30 | 834 |
| 26 | 6.3 | 24 | 858 |
| 27 | 6.4 | 30 | 888 |
| 28 | 7.0 | 24 | 912 |
| 29 | 7.1 | 30 | 942 |
| 30 | 7.2 | 30 | 972 |
| 31 | 7.3 | 30 | 1002 |
| 32 | 7.4 | 30 | 1032 |
| 33 | 8.0 | 24 | 1056 |
| 34 | 8.1 | 30 | 1086 |
| 35 | 8.2 | 30 | 1116 |
| 36 | 8.3 | 30 | 1146 |
| 37 | 8.4 | 30 | 1176 |
| 38 | 8.5 | 30 | 1206 |

Total frame = 1206 (durasi komposisi = 1207). Tidak ada stop ber-frame 0 selain state pertama.

---

## Scene 1 — Rekap: dari In-Memory ke REST (pendukung)
**Tujuan:** menyambungkan Modul 06 ke Modul 07 dan menanam pertanyaan: apa yang berubah, apa yang tetap?

| Stop | Aksi | Yang tampil | Frames |
|---|---|---|---|
| 0 | n/a | Judul "Modul 07: Data dari Internet". Empat kotak slot 1–4: UI (biru), ViewModel (oranye), Repository (hijau), Data Source (navy, sublabel "in-memory list"). Slot 5 kosong. Teks bawah: "Modul 06: semua data berasal dari dalam aplikasi" | 0 |
| 1 | `boxSwap` + `slideIn` | Kotak Data Source berganti menjadi **Remote Data Source** (sublabel `StudentRemoteDataSource`). Kotak ke-5 **REST API** (slate, sublabel "DummyJSON") masuk dari kanan. Garis putus-putus vertikal antara slot 4 dan 5 berlabel "batas aplikasi". Teks bawah: "Apa yang berubah? Apa yang tetap?" | 30 |

**Narasi:**
- Stop 0: "Di Modul 06 semua data hidup di dalam aplikasi, dan kita sudah memisahkan empat layer."
- Stop 1: "Hari ini sumber datanya pindah ke internet. Di Modul 06 kita berjanji: saat sumber data diganti, UI tidak perlu tahu. Mari kita buktikan, lapis demi lapis."

## Scene 2 — Siklus Request–Response
**Tujuan:** menunjukkan perjalanan satu permintaan data dan perubahan wujudnya: teks → objek → tampilan.

**Layout:** rel 5 stasiun di atas (y=80, tiap stasiun 320px: ikon 96px, nomor, nama Inter Bold 44, subjudul Inter 30). Panggung muatan di bawah (x=80, y=340, 1760×630) menampilkan "apa yang sedang berjalan". Token kecil berpindah antar stasiun.
Stasiun: ① **App** (`Smartphone`, "memanggil endpoint") · ② **HTTP GET** (chip method, "/users?limit=10") · ③ **Server** (`Cloud`, "mengirim JSON") · ④ **Converter** (`Cog`, "JSON → object") · ⑤ **UI State** (`Smartphone`, "ditampilkan di Compose").

| Stop | Aksi | Yang tampil | Frames |
|---|---|---|---|
| 0 | `sceneIn` | Rel dengan ① aktif, lainnya redup. Panggung: teks "Aplikasi ingin menampilkan daftar mahasiswa. Datanya ada di server, bukan di dalam aplikasi." | 18 |
| 1 | `railStep` ①→③ + `packetFly` | Token bergerak ① → ② → ③. Panggung: paket permintaan besar `GET /users?limit=10`, badge `HTTP GET`, baris `https://dummyjson.com` | 36 |
| 2 | `railStep` (tetap di ③) + `jsonReveal` | Panggung: blok JSON mentah (16 baris, `03`) muncul linear; chip `200 OK` (`--ok`). Teks bawah: "Status code + body JSON harus dicek: sukses maupun gagal" | 36 |
| 3 | `shrinkIntoMachine` | Token ke ④. Blok JSON mengecil dan masuk ke ikon `Cog` (berputar mengikuti progres). Di kanan muncul objek `UserResponse(...)` (`03`) | 36 |
| 4 | `railStep` ⑤ + `phoneState` | Token ke ⑤. Panggung: mockup ponsel menampilkan kartu profil (Emily Johnson, email, university). Teks samping: "Sebelum tampil, DTO dipetakan menjadi Student (Scene 4)" | 36 |

**Narasi:**
- Stop 0: "Aplikasi butuh data, tetapi datanya ada di server. Bagaimana perjalanannya?"
- Stop 1: "Aplikasi mengirim HTTP GET ke endpoint `/users`, dengan parameter `limit` 10."
- Stop 2: "Server membalas dengan teks JSON mentah dan status code. Ini hanya teks, belum objek Kotlin. Status code dan body sama-sama harus dicek."
- Stop 3: "Converter Gson membaca teks itu dan membentuk objek Kotlin: `UserResponse` berisi daftar `UserDto`."
- Stop 4: "Objek itu diteruskan sampai menjadi UI State, lalu dirender Compose sebagai kartu profil."

## Scene 3 — Aliran Data Lintas Layer
**Tujuan:** aturan pemisahan tanggung jawab dan larangan jalan pintas. Menunjukkan perubahan wujud data di tiap layer.

**Layout:** judul di atas (y=80). 5 kotak lapisan (320×220, y=330–550) memakai warna lapisan; REST API berwarna slate dengan garis tepi putus-putus dan caption "di luar aplikasi". Kotak Remote Data Source memuat sub-label `StudentApiService · RetrofitClient`. Di dalam tiap kotak: nama (Inter Bold 44) + caption mono 26 (berganti tiap stop). Panah event di atas kotak (y=290), panah response di bawah kotak (y=590). Teks aturan di bawah (y=700+, 42px).

| Stop | Aksi | Yang tampil | Frames |
|---|---|---|---|
| 0 | `sceneIn` | Judul "Aliran Data Lintas Layer", 5 kotak, konektor tipis antar kotak. Caption kosong | 24 |
| 1 | `flowArrow` (event) + `pulse` | Panah `--arrow-event` dari UI ke REST API, label "Event / Request". Caption berurutan: UI "klik / buka layar", ViewModel `loadStudents()`, Repository `getStudents(callback)`, Remote DS `api.getUsers().enqueue(…)`, REST API `GET /users?limit=10` | 60 |
| 2 | `flowArrow` (response) + `pulse` + `shapeShift` | Panah `--arrow-state` dari REST API ke UI, label "Response / State". Caption berganti sesuai wujud data: REST API "JSON (teks)", Remote DS `Result<List<UserDto>>`, Repository `Result<List<Student>>`, ViewModel `HomeUiState`, UI "dirender" | 60 |
| 3 | `arcForbidden` #1 | Panah dan caption memudar. Busur putus-putus dari UI langsung ke Remote DS (`StudentApiService`), tanda silang merah (`--err`) di tengah busur. Teks: "UI dilarang memanggil Retrofit atau `StudentApiService`". Teks kecil mono: "HomeScreen/DetailScreen tidak boleh mengimpor `retrofit2`" | 30 |
| 4 | `arcForbidden` #2 | Busur kedua dari ViewModel langsung ke Remote DS (melompati Repository), tanda silang merah. Teks: "ViewModel meminta data lewat Repository, bukan langsung ke Remote Data Source". Busur pertama tetap tampil (redup) | 30 |

**Narasi:**
- Stop 0: "Lima layer, satu arah. Event bergerak ke kanan, response bergerak ke kiri."
- Stop 1: "Event dari layar turun lapis demi lapis. Hanya Remote Data Source yang menyentuh Retrofit dan benar-benar memanggil server."
- Stop 2: "Responsnya naik, dan wujudnya berubah di tiap layer: teks JSON, lalu DTO, lalu Student, lalu state, lalu piksel di layar."
- Stop 3: "Godaan terbesar: memanggil Retrofit langsung dari layar. Dilarang. Cek mudahnya: `HomeScreen` tidak boleh mengimpor `retrofit2` atau `StudentApiService`."
- Stop 4: "ViewModel juga tidak boleh melompati Repository. Repository tetap satu-satunya pintu akses data."

## Scene 4 — Transformasi DTO ke Student
**Tujuan:** membedakan kontrak API yang kaku (DTO) dari model yang dibutuhkan aplikasi (`Student`).

**Layout:** tiga kolom: JSON (x=80, lebar 580), DTO (x=750, lebar 520), Student (x=1360, lebar 480). Kode JSON mono 24px (lihat `03`). Area bawah (y=620–980): kode mapper dan keterangan.

| Stop | Aksi | Yang tampil | Frames |
|---|---|---|---|
| 0 | `sceneIn` | Kolom kiri: JSON ringkas (14 baris) dengan banyak field. Caption: "JSON mentah: banyak field, tidak semuanya dibutuhkan" | 24 |
| 1 | `fieldLight` | Muncul kotak `UserResponse(users, total, skip, limit)` di kolom tengah atas. Pada JSON, `users` menyala ke `List<UserDto>`; `total`, `skip`, `limit` menyala dengan label "metadata paging, milik pembungkus" | 30 |
| 2 | `fieldLight` | Muncul `UserDto(id, firstName, lastName, email, university)`. Hanya 5 field itu yang menyala di JSON; `age`, `phone`, `address`, dst. meredup dengan label "tidak dipakai". Keterangan: `data/remote/dto` | 30 |
| 3 | `gateMerge` | Gerbang `toStudent()` di antara kolom tengah dan kanan. `firstName` dan `lastName` bergabung menjadi `name` ("Emily Johnson"); `id`, `email`, `university` lewat apa adanya. Keluar kartu `Student(id, name, email, university)`. Kode mapper (`03`) muncul di bawah | 36 |
| 4 | `layerTag` | Penanda lapisan: ikon kotak **Repository** (hijau) menyala di atas gerbang dengan teks "Repository yang memetakan DTO → Student". Tiga poin (42px): "UI hanya mengenal Student" · "API berubah? cukup ubah DTO + mapper" · "Student sudah berubah dari program/year menjadi email/university" | 30 |

**Narasi:**
- Stop 0: "Server mengirim banyak field. Aplikasi kita hanya butuh sebagian."
- Stop 1: "Pembungkusnya `UserResponse`. Perhatikan: `total`, `skip`, dan `limit` milik pembungkus ini, bukan milik tiap user."
- Stop 2: "`UserDto` hanya memilih lima field yang kita butuhkan. Bentuknya mengikuti kontrak API, makanya ia tinggal di folder `data/remote/dto`."
- Stop 3: "Mapper `toStudent()` menggabungkan nama depan dan belakang, lalu menghasilkan `Student`, model yang dipakai aplikasi."
- Stop 4: "Yang memanggil mapper adalah Repository. UI hanya pernah melihat `Student`, jadi kalau kontrak API berubah, yang disentuh hanya DTO dan mapper."

## Scene 5 — Callback Asinkron
**Tujuan:** alasan memakai `Call.enqueue` dan cara hasilnya kembali sebagai `Result`.

**Layout:** atas (y=80–470): dua lajur waktu kiri→kanan: **Jalur utama (UI)** dan **Jalur jaringan**. Bawah (y=500–960): panel kode (`03`), tinggi ±460, tanpa header.

| Stop | Aksi | Yang tampil | Frames |
|---|---|---|---|
| 0 | `sceneIn` | Dua lajur kosong, judul "Kenapa memakai enqueue?". Lajur utama berisi balok-balok "gambar layar" yang berjalan (progres) | 24 |
| 1 | `freezeLane` | Contoh SALAH: permintaan ditunggu di jalur utama. Lajur utama tersumbat (belang merah) dengan ikon beku dan label "UI membeku". Panel kode: contoh `execute()` (`03`) berlabel SALAH. Teks: "Di Android memicu NetworkOnMainThreadException" | 36 |
| 2 | `laneBranch` | Contoh BENAR: permintaan bercabang turun ke jalur jaringan, jalur utama terus berjalan dengan chip "isLoading = true" dan spinner. Panel kode: `isLoading = true` lalu `repository.getStudents { … }` (`03`). Label "non-blocking" | 36 |
| 3 | `doorFork` | Ujung jalur jaringan bercabang menjadi dua pintu: **onResponse** ("server membalas, apa pun status-nya") dan **onFailure** ("gagal sebelum ada balasan, mis. internet mati"). Panel kode: kode `enqueue` penuh, baris kunci 2 dan 10 | 36 |
| 4 | `gateCheck` | Di pintu onResponse muncul gerbang `isSuccessful && body != null`. Lolos → jalur `--ok` ke `Result.success(body.users)`. Tidak lolos (mis. HTTP 404) → jalur `--err` ke `Result.failure("HTTP 404")`. Pintu onFailure → `Result.failure(t)`. Semua jalur gagal bermuara ke satu keranjang `Result.failure`. Panel: baris kunci 4, 5, 7 | 36 |
| 5 | `laneReturn` | Hasil `Result` melompat balik ke jalur utama menjadi pembaruan `uiState`. Teks: "Callback mengembalikan hasil; ViewModel memperbarui state; layar digambar ulang". Panel kode: `onSuccess`/`onFailure` pada ViewModel, baris kunci 3 dan 5 | 36 |

**Narasi:**
- Stop 0: "Permintaan ke internet butuh waktu: bisa detik, bisa gagal. Bagaimana aplikasi menunggunya?"
- Stop 1: "Kalau jalur utama ikut menunggu, layar membeku. Di Android ini bahkan bisa membuat aplikasi crash."
- Stop 2: "Dengan `enqueue`, permintaan berjalan di jalur sendiri. Layar tetap hidup dan menampilkan loading."
- Stop 3: "Ketika selesai, hasilnya masuk lewat salah satu dari dua pintu: `onResponse` atau `onFailure`."
- Stop 4: "Hati-hati: `onResponse` bukan berarti sukses. Status 404 juga masuk sini. Kita cek `isSuccessful` dan body. Semua kegagalan, dari mana pun asalnya, dibungkus menjadi satu bentuk: `Result.failure`."
- Stop 5: "Hasil itu kembali ke jalur utama, ViewModel memperbarui state, dan layar digambar ulang. Callback ini bersifat sementara; di materi berikutnya digantikan Coroutines dan Flow."

## Scene 6 — Tiga Kondisi Layar
**Tujuan:** layar tidak boleh mengira data selalu ada.

**Layout:** kiri mockup ponsel (x=140, y=120, 440×800). Kanan (x=680, lebar 1160): panel state (y=120, tinggi ±220) dan panel `when` (y=370, tinggi ±520). Cabang `when` yang aktif disorot (`keyLines`).

| Stop | Aksi | Yang tampil | Frames |
|---|---|---|---|
| 0 | `sceneIn` | Ponsel kosong (bar "Home"). Panel state: `HomeUiState()` bawaan. Panel `when` tanpa sorotan. Judul "Layar tidak boleh mengira data selalu ada" | 24 |
| 1 | `phoneState` | **Loading.** Ponsel: spinner berputar di tengah. Panel state: `isLoading = true`. Cabang 1 menyala | 30 |
| 2 | `phoneState` | **Error (internet mati).** Chip `WifiOff`. Ponsel: teks error + tombol "Coba Lagi". State: `isLoading = false`, `errorMessage = "Unable to resolve host…"`. Cabang 2 menyala | 30 |
| 3 | `phoneState` + `tap` | **Coba Lagi ditekan.** Tombol berkedip (riak), lalu kembali ke loading. State: `uiState.copy(isLoading = true, errorMessage = null)`. Callout: `onRetry = homeViewModel::loadStudents`. Cabang 1 menyala | 24 |
| 4 | `phoneState` | **Sukses.** Ponsel: daftar baris "1 - Emily Johnson" dst. (LazyColumn). State: `students = [10 item]`, `isLoading = false`, `errorMessage = null`. Cabang 3 menyala | 30 |

**Narasi:**
- Stop 0: "Layar tidak boleh mengira datanya selalu ada. State kita punya tiga kemungkinan: loading, error, dan data."
- Stop 1: "Saat request berjalan, `isLoading` true, dan layar menampilkan spinner. Urutan cabang `when` penting: loading dicek paling dulu."
- Stop 2: "Internet mati: pesan masuk ke `errorMessage` dan layar menampilkan error beserta tombol Coba Lagi."
- Stop 3: "Tekan Coba Lagi: state kembali ke loading dan request diulang."
- Stop 4: "Sukses: `students` terisi dan `LazyColumn` menampilkan daftar. UI hanya membaca state."

## Scene 7 — Dari Mana Error Berasal? (pendukung)
**Tujuan:** memetakan gejala di tabel troubleshooting modul ke tempat terjadinya. Boleh dipangkas.

**Layout:** baris atas 5 kotak ringkas (320×90, y=80). Bagian tengah (y=210–520): dua pintu (onResponse dengan gerbang `isSuccessful`, onFailure) dan keranjang hasil `Result.success`/`Result.failure`. Bawah (y=560–960): kartu gejala dan kartu perbaikan.

| Stop | Aksi | Yang tampil | Frames |
|---|---|---|---|
| 0 | `sceneIn` | Peta kosong. Judul "Dari mana error berasal?" Teks bawah: "Apa pun penyebabnya, ujungnya `Result.failure` → `errorMessage` → layar error + Coba Lagi" | 24 |
| 1 | `symptomDrop` | Chip `UnknownHostException` jatuh ke pintu **onFailure**. Perbaikan: "Cek koneksi internet dan permission INTERNET" | 30 |
| 2 | `symptomDrop` | Chip `HTTP 404` jatuh ke pintu **onResponse**, gerbang `isSuccessful = false`. Perbaikan: "Cek base URL, path @GET, @Path, dan ID" | 30 |
| 3 | `symptomDrop` | Chip `Expected BEGIN_OBJECT…` menyorot kotak Remote DS (Gson/DTO), lalu jatuh ke **onFailure**. Perbaikan: "Samakan DTO dengan struktur JSON" | 30 |
| 4 | `symptomDrop` | Chip `Cleartext HTTP traffic not permitted` jatuh ke **onFailure**. Perbaikan: "Gunakan endpoint HTTPS" | 30 |

**Narasi:** Stop 1–4: satu kalimat per gejala: lokasi terjadinya, pintu yang dilalui, dan perbaikannya. Penutup di Stop 4: "Semua jalan menuju satu bentuk, `Result.failure`, jadi layar cukup punya satu cabang error."

## Scene 8 — Peta Perubahan dan Jembatan (pendukung penutup)
**Tujuan:** membuktikan janji Modul 06 dan menyiapkan materi berikutnya.

**Layout:** sama dengan Modul 06 Scene 6, tetapi 5 kotak slot (320×110, y=80), lencana status (y=198), banner (y=276), panel diff (x=80, y=372, 1760×600).

| Stop | Aksi | Yang tampil | Frames |
|---|---|---|---|
| 0 | `sceneIn` | Baris kotak. Banner: "Apa yang berubah dari Modul 06?". Panel berisi teks "Kita periksa lapis demi lapis, dari bawah ke atas" | 24 |
| 1 | `focusBox` + `diffPanel` | Kotak Remote Data Source menyala, lencana "diganti". Banner: "Data Source → Remote Data Source". Diff `DIFFS[0]` | 30 |
| 2 | `focusBox` + `diffPanel` | Repository, lencana "menyesuaikan". Banner: "Repository: kontrak jadi asinkron + memetakan DTO". Diff `DIFFS[1]` | 30 |
| 3 | `focusBox` + `diffPanel` | ViewModel, lencana "menyesuaikan". Banner: "ViewModel: ikut asinkron, mengelola loading dan error". Diff `DIFFS[2]` | 30 |
| 4 | `focusBox` + `diffPanel` | UI, lencana "hampir tetap". Banner: "UI: tidak mengenal Retrofit, hanya render state". Diff `DIFFS[3]` | 30 |
| 5 | `summaryPanel` | Semua kotak terang. Kotak REST API berlencana "baru". Panel dua kolom **Berubah** vs **Tetap** (`03`). Baris bawah: "Berikutnya: callback → Kotlin Coroutines & Flow" (label, tanpa kode) | 30 |

**Narasi:**
- Stop 1–4: satu kalimat per lapisan sesuai banner; tegaskan bahwa perubahan merambat hanya sejauh kebutuhan asinkron, dan UI tidak pernah mengimpor Retrofit.
- Stop 5: "Janji Modul 06 terbukti: perubahan terlokalisasi, UI tidak mengenal Retrofit, dan navigasi Home, Detail, Back tidak berubah. Callback ini sementara; berikutnya kita sederhanakan dengan Coroutines dan Flow."

# 02 — Storyboard

## Aturan umum

- `Stop 0` = kondisi awal scene. `Stop N` = kondisi setelah N kali Next di dalam scene.
- Kolom **Frames** = durasi transisi (30 fps) MENUJU stop tersebut. Nilai sebenarnya ada di `src/deck/stops.ts`; tabel ini harus identik dengannya.
- **Stop 0 scene yang visualnya identik dengan akhir scene sebelumnya tidak menjadi klik tersendiri** (Frames = 0). Hanya berlaku untuk Scene 4 Stop 0.
- Baris **Narasi** adalah naskah lisan dosen. JANGAN ditampilkan di layar.
- Nama efek (`typeCode`, `dim`, dst.) didefinisikan di `05-animation-spec.md`.

## Peta state global (26 state, 25 kali Next)

| #   | Scene.Stop | Frames | #   | Scene.Stop | Frames |
| --- | ---------- | ------ | --- | ---------- | ------ |
| 0   | 1.0        | 0      | 13  | 4.1        | 24     |
| 1   | 1.1        | 90     | 14  | 4.2        | 24     |
| 2   | 1.2        | 24     | 15  | 4.3        | 24     |
| 3   | 1.3        | 24     | 16  | 4.4        | 24     |
| 4   | 1.4        | 24     | 17  | 5.0        | 24     |
| 5   | 2.0        | 18     | 18  | 5.1        | 60     |
| 6   | 2.1        | 24     | 19  | 5.2        | 60     |
| 7   | 2.2        | 24     | 20  | 6.0        | 24     |
| 8   | 2.3        | 24     | 21  | 6.1        | 24     |
| 9   | 2.4        | 24     | 22  | 6.2        | 24     |
| 10  | 3.0        | 18     | 23  | 6.3        | 24     |
| 11  | 3.1        | 48     | 24  | 6.4        | 24     |
| 12  | 3.2        | 36     | 25  | 6.5        | 30     |
| (≡12)| 4.0       | 0      |     |            |        |

Total frame = 768 (durasi komposisi = 769).

---

## Scene 1 — Masalah "Spageti Code"

**Tujuan:** menunjukkan bahwa dua pekerjaan berbeda (data dan tampilan) menumpuk di satu fungsi, sehingga satu perubahan menyentuh bagian yang tidak terkait. **Latar:** gelap (`--bg-dark`).

Nomor baris di bawah merujuk ke baris tampil di `03-code-assets.md` (setelah marker dihapus): baris **3–9** = data dan pencarian, baris **16–18** = tampilan.

| Stop | Aksi                                           | Yang tampil                                                                                                                                                                                                                                              | Frames |
| ---- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 0    | n/a                                            | Jendela editor mock (title bar + tab `DetailScreen.kt` + nomor baris), kosong                                                                                                                                                                            | 0      |
| 1    | `typeCode`                                     | Seluruh fungsi `DetailScreen` terketik (tanpa komentar marker)                                                                                                                                                                                           | 90     |
| 2    | `dim` + `highlightLines` + `callout`           | Semua baris meredup (0.3) KECUALI baris 3–9 yang menyala (latar `#FFFFFF20`). Callout di kanan: **"Ganti sumber data → ubah baris 3–9"**                                                                                                                 | 24     |
| 3    | `highlightLines` bergeser + `callout` berganti | Sorotan pindah (cross-fade) ke baris 16–18; baris 3–9 meredup. Callout berganti: **"Ubah tampilan → ubah baris 16–18"**                                                                                                                                  | 24     |
| 4    | `dim` + kartu peringatan                       | Semua baris meredup (0.3), callout hilang. Kartu border merah di tengah: judul **"Satu fungsi, banyak alasan untuk berubah"**; tiga baris: "Dua pekerjaan berbeda, satu tempat" · "Ubah satu, yang lain ikut berisiko" · "Sulit dites dengan data palsu" | 24     |

Aturan callout: lebar maksimum 560px, rata kanan di dalam jendela editor (jarak 40px dari tepi), sejajar vertikal dengan tengah rentang baris yang disorot, gaya kartu peringatan (lihat 04 bagian 8). Baris kode terpanjang berakhir sekitar 1010px dari tepi kiri editor, jadi callout tidak boleh menimpa kode.

**Narasi (tidak ditampilkan):**

- Sebelum klik: "Kita mulai dari cara yang paling sering dipakai saat baru belajar: semuanya ditulis di satu tempat."
- Stop 1: "Ini satu fungsi `DetailScreen`: data mahasiswa, cara mencarinya, state, dan tampilannya. Semuanya jalan, dan untuk aplikasi sekecil ini itu wajar."
- Stop 2: "Mau ganti list ini ke database? Kita bongkar baris 3 sampai 9."
- Stop 3: "Mau ubah tampilan? Kita buka baris 16 sampai 18, di fungsi yang sama."
- Stop 4: "Dua pekerjaan berbeda tinggal di satu tempat. Ubah satu, yang lain ikut berisiko. Bayangkan ini 500 baris."

## Scene 2 — Filosofi Restoran

**Tujuan:** analogi 4 peran → 4 lapis. **Latar:** terang (`--bg-light`). Layout: judul di atas, 4 kartu sejajar (410px, gap 40px), urutan kiri→kanan sama dengan Scene 5.

| Stop | Aksi      | Yang tampil                                                                                                    | Frames |
| ---- | --------- | -------------------------------------------------------------------------------------------------------------- | ------ |
| 0    | `sceneIn` | Judul "Prinsip Restoran" + subjudul "Satu peran, satu tanggung jawab"                                          | 18     |
| 1    | `popIn`   | Kartu **Pelayan** (biru, ikon `ConciergeBell`). "Tugas: Menyajikan hidangan" · chip "(UI)"                     | 24     |
| 2    | `popIn`   | Kartu **Pencatat Pesanan** (oranye, `ClipboardList`). "Tugas: Menyimpan status meja & orderan" · "(ViewModel)" | 24     |
| 3    | `popIn`   | Kartu **Bagian Pengadaan** (hijau, `Truck`). "Tugas: Mengatur dari mana bahan diambil" · "(Repository)"        | 24     |
| 4    | `popIn`   | Kartu **Gudang** (navy, `Warehouse`). "Tugas: Tempat fisik bahan baku" · "(Data Source)"                       | 24     |

**Narasi:** "Setiap peran punya satu tanggung jawab pasti. Pelayan tidak ikut mengurus gudang."

## Scene 3 — Tebas Kode

**Tujuan:** memotong kode satu file menjadi 4 pecahan logis. **Latar:** gelap, lalu menjadi terang pada Stop 2.

| Stop | Aksi         | Yang tampil                                                                                                                           | Frames     |
| ---- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------- | ------------------------------------------------------------------------------- | --- |
| 0    | `sceneIn`    | Kode spageti utuh (kondisi akhir Scene 1 Stop 1, tidak meredup, tanpa kartu peringatan) di tengah layar                               | 18         |
| 1    | `laserCut`   | Tiga garis neon merah memotong berurutan di batas `datasource                                                                         | repository | viewmodel | ui`. Tiap bagian mendapat garis warna lapisan di tepi kiri (TANPA nama lapisan) | 48  |
| 2    | `splitBlock` | Empat pecahan memisah dan menjadi 4 kartu sejajar, urutan kiri→kanan: UI, ViewModel, Repository, Data Source. Latar beralih ke terang | 36         |

**Narasi:** "Kita pisahkan kodenya. Kenapa? Supaya saat sumber data diganti, tampilan tidak perlu disentuh sama sekali."

## Scene 4 — Empat Lapis Arsitektur Android

**Tujuan:** mengunci istilah dan isi tiap lapisan. **Satu kanvas dengan Scene 3** (komponen yang sama, `SceneSplit.tsx`).

Stop 0 ≡ akhir Scene 3 Stop 2 (4 kartu tanpa label; tidak ada klik tersendiri).

| Stop | Aksi                           | Yang tampil (label muncul di bawah kartu dan tetap tampil)                            | Frames |
| ---- | ------------------------------ | ------------------------------------------------------------------------------------- | ------ |
| 1    | `focusGrow` kartu paling kanan | Chip navy **Data Source** · "Sumber data (in-memory list)" · `StudentLocalDataSource` | 24     |
| 2    | `focusGrow` kartu ke-3         | Chip hijau **Repository** · "Satu pintu akses data" · `StudentRepository`             | 24     |
| 3    | `focusGrow` kartu ke-2         | Chip oranye **ViewModel** · "State holder tingkat layar" · `DetailViewModel`          | 24     |
| 4    | `focusGrow` kartu paling kiri  | Chip biru **Composable UI** · "Menampilkan state & mengirim event" · `DetailScreen`   | 24     |

Setiap stop: kartu yang sebelumnya fokus kembali ke ukuran normal tetapi labelnya tetap tampil. Urutan penjelasan sengaja dari bawah ke atas (urutan membangun di modul), berbeda dari Scene 2 yang atas ke bawah (sudut pandang pelanggan).

**Narasi:** "Dari paling bawah: Data Source menyimpan datanya, Repository menjadi satu pintu aksesnya, ViewModel memegang state layar, dan Composable hanya menampilkan."

## Scene 5 — Aliran Eksekusi

**Tujuan:** arah dependency dan aliran data. **Latar:** terang.

| Stop | Aksi                | Yang tampil                                                                                                                                                                                                                                                                                                      | Frames |
| ---- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 0    | `morphToBoxes`      | Kartu mengecil/menyatu menjadi 4 kotak seragam (410×200) berisi nama lapisan saja. Judul "Aliran Eksekusi". Konektor abu-abu tipis antar kotak. Teks bawah: "Arah dependency: UI → ViewModel → Repository → Data Source"                                                                                         | 24     |
| 1    | `flowArrow` (event) | Panah gelap di atas kotak, dari UI ke Data Source. Label di atas panah: **"User Event / Request"**. Saat panah melewati tiap kotak, kotak berdenyut (`pulse`) dan caption kode muncul di bawahnya: UI `onClick`, ViewModel `loadStudent(id)`, Repository `getStudentById(id)`, Data Source `students.find { … }` | 60     |
| 2    | `flowArrow` (state) | Panah ungu di bawah kotak, dari Data Source ke UI (arah mundur). Label: **"Model Data → UI State"**. Kotak berdenyut urutan terbalik; caption berganti (crossfade): Data Source `Student`, Repository `Student`, ViewModel `DetailUiState`, UI "render ke layar"                                                 | 60     |

**Narasi:** "Aksi user bergerak ke dalam, data yang sudah matang bergerak ke luar untuk dirender. Sistematis dan bersih."

## Scene 6 — Uji Perubahan (Bukti Pemisahan & Kode Terpadu)

**Tujuan:** membuktikan secara visual bahwa arsitektur 4 lapis berhasil mengisolasi perubahan—setiap permintaan hanya menyentuh satu lapisan terisolasi, sementara 3 lapisan lainnya sama sekali tidak disentuh (membalas langsung masalah di Scene 1). Ditutup dengan tampilan 4 kartu terpadu yang saling terhubung bersih dari Data Source s.d. UI serta rangkuman arsitektur. **Latar:** terang (`--bg-light`).

**Layout:**
- Judul di atas: **"Uji Perubahan: Bukti Pemisahan"**.
- Banner atas dinamis: teks permintaan perubahan yang sedang diuji.
- 4 kartu lapisan berjajar 410px, gap 40px (urutan kiri→kanan: UI, ViewModel, Repository, Data Source).
- Kartu yang disasar: menyala penuh (scale 1.02, border warna lapisan, badge **"⚡ DIUBAH"**, dan cuplikan diff kode).
- Tiga kartu lainnya: meredup (opacity 0.35, badge **"✓ TETAP"**, tanpa perubahan kode).
- Pada Stop 4 (State 24): Keempat kartu menyala bersamaan (opacity 1.0, scale 1.0, badge **"✓ TERPADU"**), menampilkan kode terbaru yang saling mereferensikan secara utuh.
- Pada Stop 5 (State 25): Menampilkan **seluruh 4 layer sudah terupdate penuh** (tidak hanya Data Source; Repository, ViewModel, dan UI terupdate dan tetap mengambil referensi dari Data Source sebagai referensi perubahan di code asset) yang tetap terlihat jelas di kartu masing-masing, sementara modal kartu rangkuman penutup kontras arsitektur muncul di tengah.

| Stop | Aksi | Yang tampil | Frames |
| ---- | ---- | ----------- | ------ |
| 0 | `testChange1` | Banner: **"Permintaan 1: Ambil data dari server via REST API (mgm.org/list)"**. Kartu **Data Source** menyala: diff `- listOf(...)` diganti `+ client.get("mgm.org/list")`. Kartu UI, ViewModel, Repository redup dengan badge "✓ TETAP". | 24 |
| 1 | `testChange2` | Banner: **"Permintaan 2: Tolak ID yang tidak valid (≤ 0)"**. Kartu **Repository** menyala: diff `- dataSource.getStudentById(id)` diganti `+ if (id <= 0) null else dataSource.getStudents().find { it.id == id }`. Kartu UI, ViewModel, Data Source redup "✓ TETAP". | 24 |
| 2 | `testChange3` | Banner: **"Permintaan 3: Pesan error sebutkan ID-nya"**. Kartu **ViewModel** menyala: diff `- "Mahasiswa tidak ditemukan"` diganti `+ "Mahasiswa #$studentId tidak ditemukan"`. Kartu UI, Repository, Data Source redup "✓ TETAP". | 24 |
| 3 | `testChange4` | Banner: **"Permintaan 4: Tampilkan angkatan di layar"**. Kartu **UI** menyala: diff `+ Text("Angkatan: ${student?.year ?: \"-\"}")`. Kartu ViewModel, Repository, Data Source redup "✓ TETAP". | 24 |
| 4 | `unifiedCode` | Banner: **"Hasil Akhir: 4 Lapisan Bekerja Sama secara Harmonis"**. **Keempat kartu menyala bersamaan** (`✓ TERPADU`) tanpa tanda diff. Menampilkan kode final bersih yang saling bersambung: Data Source (`mgm.org/list`) → Repository (mengambil dari Data Source & memfilter) → ViewModel (mengambil dari Repository & mengelola state ber-ID) → UI (merender nama & angkatan). | 24 |
| 5 | `summaryModal` | **Kesimpulan Arsitektur**: **Seluruh 4 layer ditampilkan dalam kondisi sudah terupdate penuh** (ga cuma Data Source, layer lain tetap mengambil dari Data Source sebagai referensi perubahan di code asset). Modal kartu penutup muncul di tengah (latar `#2B1B1B`, border 4px `--laser`): judul **"Mengapa Kita Memisahkan Lapisan?"**, kontras: *"Di versi Spageti (Scene 1): 4 permintaan mengacak-acak 1 fungsi yang sama"* vs *"Di arsitektur berlapis: Tiap permintaan hanya mengubah 1 lapisan tanpa efek samping"*. Ditambah teaser Modul 07+ (Room DB / Retrofit). | 30 |

**Narasi (tidak ditampilkan):**
- Stop 0: "Sekarang mari kita buktikan. Mau ganti in-memory list ke server REST API di mgm.org/list? Cukup ubah implementasi di Data Source. UI, ViewModel, dan Repository tidak perlu tahu dan tidak perlu diedit."
- Stop 1: "Ada aturan bisnis baru: tolak ID kurang dari sama dengan nol? Cukup ubah Repository sebagai pintu gerbang data. Tampilan dan data source tetap aman."
- Stop 2: "Ingin pesan error lebih informatif menyebutkan ID-nya? Cukup ubah state di ViewModel. UI hanya merender apa yang diberikan ViewModel."
- Stop 3: "Desainer ingin menampilkan tahun angkatan? Karena datanya sudah ada di model, kita cukup tambah satu Text di UI Composable tanpa mengutak-atik logika bisnis."
- Stop 4: "Lihat hasil akhirnya: dari Data Source memanggil mgm.org/list, Repository memvalidasi, ViewModel mengelola state, hingga Composable UI menampilkan ke layar. Keempatnya saling terhubung bersih tanpa saling mengacak-acak file lain!"
- Stop 5: "Bahkan ketika di modul berikutnya kita mengganti sumber data ke Room Database atau Retrofit, seluruh arsitektur ini tetap kokoh. Inilah kekuatan arsitektur Android!"

---

## Catatan revisi dari versi sebelumnya

- **Penyelarasan 26 State & Branding**: Seluruh 6 scene kembali ke index dan kalkulasi frame asli (State 0 s.d. 25, total frame 768 / durasi 769 frame).
- **Watermark Persistent**: Terletak di pojok kanan atas di seluruh scene dengan ukuran logo diperbesar (tinggi 38px) dan teks font JetBrains Mono Bold diperbesar (18px) kapital "SHAM", menggunakan komponen `<Img />` Remotion.
- **Branding di Scene 1 State 0**: Header branding elegan memuat logo MGM, logo Curriculum, dan title **"PAPB - ARSITEKTUR"** saat editor mock terbuka.
- **Branding di Scene 6 State 25**: Badge logo MGM + Curriculum + title "PAPB - ARSITEKTUR" pada kartu modal penutup rangkuman.
- Scene 6: 6 stop (State 20–25), menampilkan kode terpadu dan rangkuman penutup.


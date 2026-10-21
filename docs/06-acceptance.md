# 06 — Acceptance Criteria

Agen wajib memeriksa seluruh butir sebelum menyatakan selesai. Centang hanya yang benar-benar diuji.

## A. Build dan kode

- [ ] `npm run build:web` sukses tanpa error.
- [ ] `npx tsc --noEmit` bersih.
- [ ] Tidak ada `any`, `setTimeout`, CSS `transition`/`@keyframes`, atau `player.play()` di `src/`.
- [ ] Tidak ada URL eksternal di `src/` maupun `index.html` (font, CDN, gambar).
- [ ] Hasil `build:web` (disajikan statis) berjalan dengan jaringan dimatikan dan font tetap tampil (Inter, JetBrains Mono).

## B. Navigasi

- [ ] `SETTLED` berisi tepat 26 state; durasi komposisi 769 frame (komposisi `Deck` di Remotion Studio juga 769 frame).
- [ ] Next (`→`, `PageDown`, `Space`, klik) maju satu state; Prev (`←`, `PageUp`) mundur satu state.
- [ ] Next pada state terakhir dan Prev pada state pertama tidak melakukan apa pun dan tidak error.
- [ ] Menekan Next saat animasi berjalan hanya menyelesaikan animasi itu (tidak melompat dua state).
- [ ] Maju N kali lalu mundur N kali menghasilkan tampilan yang identik dengan state asal (uji pada state 3, 9, 12, 16, 19, 22, 24, 25).
- [ ] Klik, Space, dan double-click tidak memicu perilaku bawaan Player (play/pause/fullscreen).
- [ ] Animasi benar-benar terlihat berjalan: pada Scene 1 Stop 1, sekitar 1 dan 2 detik setelah Next, layar menampilkan SEBAGIAN kode (bukan kosong, bukan penuh). Uji di `npm run present`, bukan hanya di Studio.
- [ ] Satu tekanan Next tepat memicu satu animasi (log di `next()` hanya tercetak sekali per tekanan).

## C. Isi (cocokkan dengan `02-storyboard.md`)

| State | Harus terlihat                                                                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------ |
| 0     | Jendela editor mock kosong; memuat header branding perkuliahan (logo MGM, logo Curriculum, title "PAPB - ARSITEKTUR"); watermark persistent "SHAM" di pojok kanan atas |
| 1     | Seluruh fungsi `DetailScreen` terketik penuh, 19 baris, tanpa komentar marker                                                  |
| 2     | Hanya baris 3–9 yang terang; baris lain redup (0.3); callout "Ganti sumber data → ubah baris 3–9" di kanan, tidak menimpa kode |
| 3     | Hanya baris 16–18 yang terang; callout berganti "Ubah tampilan → ubah baris 16–18"                                             |
| 4     | Semua baris redup + kartu merah "Satu fungsi, banyak alasan untuk berubah" dengan 3 baris teks; callout hilang                 |
| 5     | Latar terang, judul "Prinsip Restoran"                                                                                         |
| 6–9   | Kartu Pelayan (biru), Pencatat Pesanan (oranye), Bagian Pengadaan (hijau), Gudang (navy) muncul berurutan, kiri→kanan          |
| 10    | Kode spageti utuh, tidak redup, latar gelap                                                                                    |
| 11    | Tiga garis laser; 4 bagian bergaris warna lapisan tanpa nama                                                                   |
| 12    | 4 kartu sejajar kiri→kanan: UI, ViewModel, Repository, Data Source; latar terang; tanpa label                                  |
| 13–16 | Label muncul berurutan: Data Source, Repository, ViewModel, Composable UI; label sebelumnya tetap tampil                       |
| 17    | 4 kotak seragam + konektor + teks arah dependency                                                                              |
| 18    | Panah event ke kanan + label "User Event / Request" + caption kode                                                             |
| 19    | Panah state ke kiri (ungu) + label "Model Data → UI State"                                                                     |
| 20    | Banner Permintaan 1; hanya Data Source menyala (diff `−`/`+` endpoint REST API `mgm.org/list`); UI, VM, Repo redup bertanda "TETAP" |
| 21    | Banner Permintaan 2; hanya Repository menyala (diff `−`/`+` tolak ID ≤ 0 dan ambil dari Data Source); UI, VM, DS redup bertanda "TETAP" |
| 22    | Banner Permintaan 3; hanya ViewModel menyala (diff `−`/`+` pesan error sebutkan ID); UI, Repo, DS redup bertanda "TETAP" |
| 23    | Banner Permintaan 4; hanya UI menyala (diff `+` tampilkan angkatan); VM, Repo, DS redup bertanda "TETAP" |
| 24    | Banner Hasil Akhir; keempat kartu menyala bersamaan bertanda "TERPADU" dengan kode bersih tanpa tanda diff yang terhubung (Data Source -> Repository -> ViewModel -> UI) |
| 25    | Seluruh 4 layer menampilkan kode terupdate penuh (UI, ViewModel, Repository mengambil dari Data Source `mgm.org/list`) + modal kesimpulan arsitektur ("Mengapa Kita Memisahkan Lapisan?") dan badge branding |

Tambahan untuk Scene 1:

- [ ] Transisi state 2 → 3 berupa cross-fade (baris 3–9 meredup sementara 16–18 menyala), bukan lompat.
- [ ] Callout tidak menimpa baris kode terpanjang pada 1920×1080.
- [ ] Sorotan berpindah mundur dengan benar saat Prev (state 3 → 2 → 1).

Tambahan untuk Scene 6:

- [ ] Pada tiap stop 20–23, tepat SATU kartu berstatus "DIUBAH" dengan diff, 3 kartu lainnya berstatus "TETAP" dan redup.
- [ ] Format diff jelas membedakan baris hijau (`+`) dan merah (`−`).
- [ ] Di state 24, keempat kartu menyala bersamaan berstatus "TERPADU" dengan kode bersih yang saling bersambung (Data Source -> Repo -> VM -> UI).
- [ ] Di state 25, seluruh 4 layer (bukan cuma Data Source) menampilkan kode yang sudah terupdate penuh, dengan layer lain tetap mengambil referensi dari Data Source sebagai referensi perubahan di code asset, berdampingan dengan modal kesimpulan arsitektur ("Mengapa Kita Memisahkan Lapisan?").

## D. Visual

- [ ] Urutan lapisan kiri→kanan selalu UI → ViewModel → Repository → Data Source.
- [ ] Warna lapisan sesuai token; teks di atas warna lapisan memakai `--on-*`.
- [ ] Teks utama ≥ 42px; kode editor 30px; tidak ada teks (selain kode mode thumbnail) di bawah ukuran minimum.
- [ ] Tidak ada teks atau elemen keluar dari zona aman 80px, atau terpotong, pada 1920×1080.
- [ ] Tampilan benar pada viewport 1920×1080, 1280×720, dan rasio lebar (letterbox tidak menampilkan putih terang di scene gelap).
- [ ] Teks "Narasi" tidak muncul di layar.

## E. Kepatuhan scope

- [ ] Tidak ada tombol, form, scroll, menu, atau elemen interaktif di layar.
- [ ] Tidak ada backend, database, atau fetch jaringan.
- [ ] Tidak ada fitur di luar dokumen 01–05.

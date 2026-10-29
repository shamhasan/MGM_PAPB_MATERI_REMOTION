# 06 — Acceptance Criteria (Modul 07)

Centang hanya butir yang benar-benar diuji.

## A. Build dan kode
- [x] `npm run build:web` sukses; `npx tsc --noEmit` bersih.
- [x] Tidak ada `any`, `setTimeout`, `player.play()`, atau CSS animation/transition (selain `.spinner`).
- [x] Tidak ada URL eksternal atau `fetch` di `src/` dan `index.html`; hasil build jalan dengan jaringan dimatikan dan font tetap tampil.
- [x] Tidak ada field sensitif DummyJSON di `src/assets/code.ts` (password, ssn, ein, cardNumber, iban, wallet, macAddress, ip).

## B. Navigasi
- [x] `SETTLED` berisi tepat 39 state; durasi komposisi 1207 frame (komposisi `Deck` di Studio juga 1207).
- [x] Next (`→`, `PageDown`, `Space`, klik) maju satu state; Prev (`←`, `PageUp`) mundur satu state; di ujung tidak error.
- [x] Next saat animasi berjalan hanya menyelesaikan animasi itu.
- [x] Maju N lalu mundur N menghasilkan tampilan identik (uji pada state 6, 11, 16, 22, 27, 32, 38). Spinner dikecualikan.
- [x] Satu tekanan = satu panggilan `next()` (tidak ada listener ganda); `e.repeat` diabaikan.
- [x] Animasi benar-benar terlihat berjalan di `npm run present` (bukan hanya di Studio): misalnya state 4 menampilkan JSON terketik sebagian pada ±0,6 detik setelah Next.

## C. Isi per state (cocokkan `02-storyboard.md`)
| State | Harus terlihat |
|---|---|
| 0 | Judul, 4 kotak (Data Source "in-memory list"), slot 5 kosong |
| 1 | Remote Data Source + kotak REST API (putus-putus) + "batas aplikasi" + teks "Apa yang berubah?" |
| 2 | Rel 5 stasiun, ① aktif, teks pembuka |
| 3 | Token ke ③, paket `GET /users?limit=10` |
| 4 | Blok JSON 16 baris + chip `200 OK` + teks status code |
| 5 | JSON masuk Cog; objek `UserResponse(...)` di kanan |
| 6 | Token ke ⑤; ponsel dengan kartu Emily Johnson |
| 7 | Judul Scene 3, 5 kotak tanpa caption |
| 8 | Panah event gelap + caption event per kotak |
| 9 | Panah response ungu + caption wujud data per kotak |
| 10 | Busur UI → Remote DS dengan tanda silang merah + teks larangan |
| 11 | Busur kedua ViewModel → Remote DS + teks; busur pertama redup |
| 12 | JSON ringkas 14 baris + caption |
| 13 | `UserResponse` tampil; `users` dan `total/skip/limit` menyala |
| 14 | `UserDto` tampil; hanya 5 field menyala, sisanya "tidak dipakai" |
| 15 | Gerbang `toStudent()`; nama tergabung; kartu `Student`; kode mapper |
| 16 | Tag Repository + tiga poin |
| 17 | Dua lajur + judul |
| 18 | Lajur utama tersumbat + kode `execute()` berlabel SALAH |
| 19 | Cabang ke lajur jaringan; chip `isLoading = true` + spinner; kode `ASYNC_CODE` |
| 20 | Dua pintu `onResponse` dan `onFailure`; kode `enqueue` dengan baris kunci 2 dan 10 |
| 21 | Gerbang `isSuccessful && body != null`; jalur `--ok` dan `--err`; baris kunci 4, 5, 7 |
| 22 | Hasil kembali ke lajur utama; kode `VM_CODE` dengan baris kunci 3 dan 5 |
| 23 | Ponsel kosong + panel state default + judul |
| 24 | Spinner; `isLoading = true`; cabang 1 menyala |
| 25 | Error + tombol Coba Lagi; `errorMessage = "Unable to resolve host…"`; cabang 2 |
| 26 | Tombol ditekan lalu loading; `copy(isLoading = true, …)`; callout `onRetry`; cabang 1 |
| 27 | Daftar baris "1 - Emily Johnson" dst.; `students = [10 item]`; cabang 3 |
| 28 | Peta pintu kosong + judul + teks "ujungnya Result.failure" |
| 29–32 | Chip gejala berturut-turut ke target yang benar (onFailure, onResponse+gerbang gagal, onFailure + sorot Remote DS, onFailure) dengan kartu perbaikan sesuai `03` |
| 33 | Baris kotak + banner "Apa yang berubah dari Modul 06?" |
| 34–37 | Satu kotak menyala per state (Remote DS, Repository, ViewModel, UI) dengan lencana dan diff `DIFFS[0..3]` |
| 38 | Ringkasan dua kolom Berubah/Tetap + "Berikutnya: callback → Kotlin Coroutines & Flow" (label saja) |

## D. Visual
- [x] Urutan lapisan kiri→kanan: UI, ViewModel, Repository, Remote Data Source, REST API.
- [x] Warna lapisan sesuai token; teks di atas warna lapisan memakai token `--on-*`.
- [x] Panah event dan response BUKAN biru/hijau.
- [x] Teks utama ≥ 42px (kecuali pengecualian di `04-delta`); tidak ada teks atau elemen keluar zona aman 80px atau terpotong pada 1920×1080.
- [x] Kode di panel, kolom Scene 4, dan JSON tidak terpotong dan terbaca.
- [x] Tampilan benar pada 1920×1080 dan 1280×720; teks "Narasi" tidak muncul.

## E. Kepatuhan scope
- [x] Tidak ada tombol, form, scroll, atau elemen interaktif di layar.
- [x] Tidak ada kode Retrofit yang dijalankan, tidak ada Coroutines/Flow/Room selain label teaser.

## F. Akurasi materi (periksa manual terhadap modul)
- [x] `total`, `skip`, `limit` ditampilkan sebagai milik `UserResponse`, bukan `UserDto`.
- [x] Scene 5 menyatakan bahwa `onResponse` bisa berisi kegagalan (status non-2xx) dan bahwa semua kegagalan menjadi `Result.failure`.
- [x] Pemetaan DTO → Student ditunjukkan terjadi di Repository.
- [x] `Student` memakai `email` dan `university` (bukan `program`/`year`).
- [x] Urutan cabang `when` (isLoading, errorMessage, else) sama dengan modul.

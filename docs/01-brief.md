# 01 — Project Brief: Deck Interaktif Arsitektur Android

## 1. Tujuan

Alat bantu ajar visual untuk menunjukkan **mengapa dan bagaimana** kode Android satu file dipecah menjadi 4 lapis (UI, ViewModel, Repository, Data Source). Dosen mengendalikan jalannya animasi langkah demi langkah tanpa berpindah slide statis.

## 2. Audiens

Mahasiswa FILKOM UB pada mata kuliah Pemrograman Aplikasi Perangkat Bergerak. Sudah paham sintaks dasar Kotlin/Compose, belum paham pemisahan arsitektur.

## 3. Sumber kebenaran materi

Modul Praktikum 06 — Arsitektur Aplikasi Android. Nama yang dipakai di layar harus sama dengan modul:

| Lapisan     | Nama di Modul 06                                | Tanggung jawab (kata modul, diringkas)                        |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------- |
| UI          | `DetailScreen` (Composable)                     | Menampilkan state, mengirim event, tidak memuat data langsung |
| ViewModel   | `DetailViewModel`, `DetailUiState`              | State holder tingkat layar, memanggil repository              |
| Repository  | `StudentRepository`, `DefaultStudentRepository` | Satu pintu akses data                                         |
| Data Source | `StudentLocalDataSource` / `StudentRemoteDataSource` | Sumber data (in-memory list / endpoint REST API `mgm.org/list`) |

Arah dependency: `UI → ViewModel → Repository → Data Source`. User event bergerak ke dalam, UI state bergerak ke luar.

## 4. Spesifikasi

| Item               | Nilai                                                            |
| ------------------ | ---------------------------------------------------------------- |
| Stack              | Vite + React + TypeScript + `@remotion/player`                   |
| Output             | Web statis interaktif, jalan offline (bukan MP4)                 |
| Resolusi komposisi | 1920×1080 (16:9), FPS 30                                         |
| Navigasi           | Berbasis Stop: Next/Prev dari keyboard atau klik                 |
| Skala tampilan     | Player di-scale mengikuti viewport; sisa ruang diisi latar polos |

## 5. Alur

6 scene, 26 state (25 kali Next), estimasi bawaan ±13 menit presentasi:

1. Spageti Code (masalah: semua perubahan jatuh ke satu fungsi; pembuka memuat header branding perkuliahan: logo MGM, logo Curriculum, title "PAPB - ARSITEKTUR")
2. Filosofi Restoran (analogi 4 peran)
3. Tebas Kode (pemotongan) dan 4. Empat Lapis (istilah + isi) — satu kanvas
5. Aliran Eksekusi (event masuk, state keluar)
6. Uji Perubahan (bukti pemisahan tanggung jawab: 4 permintaan perubahan hanya menyentuh 1 lapisan terisolasi termasuk REST API `mgm.org/list`, integrasi 4 lapisan terpadu yang saling bersambung, serta kesimpulan penutup dengan seluruh 4 layer terupdate dan badge branding)

Seluruh scene dilengkapi **Watermark Persistent** di pojok kanan atas memuat logo Curriculum mini + logo MGM mini + teks kapital "SHAM".

## 6. Glosarium

- **Scene**: satu bagian presentasi.
- **Stop / State**: kondisi layar yang stabil; Next menggerakkan ke state berikutnya.
- **Layer**: salah satu dari 4 lapisan arsitektur.

## 7. Non-goals (dilarang)

- Backend, database nyata, Room, SQLite, Firebase, REST API fungsional. Teaser Room/REST di Scene 6 murni label visual arsitektur masa depan tanpa koneksi nyata. Semua data adalah string/konstanta.
- Render atau ekspor video (MP4, GIF, server-side render).
- Tombol di layar, form, scroll, menu, speaker notes, tampilan narasi.

## 8. Risiko yang diketahui

- Lisensi Remotion untuk institusi: cek syarat di remotion.pro sebelum dipakai resmi di kampus.
- Kode pada mode 4 kolom berukuran kecil dan bersifat dekoratif; informasi dibawa oleh label (lihat 04).

## 9. Kriteria sukses

Dosen dapat menjalankan seluruh 6 scene hanya dengan keyboard/klik, di proyektor 1080p, tanpa internet, tanpa error, dan maju/mundur menghasilkan tampilan yang sama persis untuk state yang sama.

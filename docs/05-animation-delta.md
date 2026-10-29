# 05 — Animation Delta (Modul 07)

Mesin Stop, driver, `useStopProgress`, easing, dan kosakata efek Modul 06 TIDAK berubah (`docs-modul06/05-animation-spec.md`, termasuk bagian "Jebakan umum"). Dokumen ini mengganti `stops.ts` dan menambah efek.

## 1. `src/deck/stops.ts`
```ts
export const FPS = 30;
export const SCENES = [
  { id: 'recap',   stops: [0, 30] },
  { id: 'cycle',   stops: [18, 36, 36, 36, 36] },
  { id: 'layers',  stops: [24, 60, 60, 30, 30] },
  { id: 'mapping', stops: [24, 30, 30, 36, 30] },
  { id: 'async',   stops: [24, 36, 36, 36, 36, 36] },
  { id: 'states',  stops: [24, 30, 30, 24, 30] },
  { id: 'errors',  stops: [24, 30, 30, 30, 30] },
  { id: 'summary', stops: [24, 30, 30, 30, 30, 30] },
] as const;
// SETTLED harus berisi 39 item; TOTAL_FRAMES = 1207 (1206 + 1)
```
Tidak ada stop ber-frame 0 selain stop pertama, jadi tidak ada penggabungan state. Menghapus scene pendukung (1, 7, 8) cukup dengan menghapus barisnya; semua nomor state turunan ikut menyesuaikan.

## 2. Pengecualian: ornamen berputar
Saat state stabil, frame timeline diam, sehingga animasi berbasis frame tidak bergerak. Hanya untuk elemen `.spinner` (Scene 5 Stop 2 dan Scene 6), CSS `@keyframes` rotasi 1 putaran/detik DIPERBOLEHKAN. Elemen lain tetap dilarang memakai CSS animation. `.spinner` dikecualikan dari uji "maju-mundur identik".

## 3. Efek yang dipakai ulang dari Modul 06
`sceneIn`, `popIn`, `flowArrow`, `pulse`, `focusBox`, `diffPanel`, `codePanel` (termasuk `keyLines`), `typeCode` (untuk `jsonReveal`), `boxSwap` serupa `teaserSwap`. Spesifikasi di dokumen Modul 06; berikut hanya penyesuaian dan efek baru.

## 4. Efek baru
Semua efek adalah fungsi dari `useStopProgress(scene, stop)` (progres 0→1, `easeSpring` untuk posisi/skala dan linear untuk reveal teks).

| Efek | Dipakai di | Spesifikasi |
|---|---|---|
| `slideIn` | 1.1 | Kotak ke-5 (REST API) masuk dari kanan layar ke slot 5 (`easeSpring`), garis putus-putus "batas aplikasi" fade-in |
| `boxSwap` | 1.1 | Kotak Data Source: isi lama keluar ke atas (opacity 1→0, translateY −16), isi baru masuk dari bawah |
| `railStep` | 2.1–2.4 | Token (lingkaran 40px `--text-dark`) bergerak antar pusat stasiun (`easeSpring`). Stasiun yang dilewati berpindah dari "aktif" ke "lewat" |
| `packetFly` | 2.1 | Chip paket `GET /users?limit=10` muncul di stasiun ①, terbang ke ③ mengikuti token (translateX), meninggalkan jejak redup |
| `jsonReveal` | 2.2 | Seperti `typeCode`: jumlah karakter terlihat = `floor(p × total)`, seluruh teks dirender sejak awal (opacity 0 untuk yang belum tampil). Chip `200 OK` fade-in pada separuh akhir |
| `shrinkIntoMachine` | 2.3 | Separuh pertama: blok JSON scale 1→0.25 dan bergerak ke pusat ikon `Cog` sambil opacity 1→0. `Cog` berputar `360° × p`. Separuh kedua: objek `RESPONSE_OBJECT` fade-in dan geser dari `Cog` ke kanan |
| `phoneState` | 2.4, 6.1–6.4 | Isi layar ponsel cross-fade 12 frame. Pada 6.3 (`tap`): tombol scale 1→0.94→1 + riak lingkaran, lalu layar beralih ke loading |
| `shapeShift` | 3.2 | Saat panah response melewati sebuah kotak, caption lama keluar ke atas dan caption wujud data baru masuk dari bawah (cross-fade 8 frame) |
| `arcForbidden` | 3.3, 3.4 | Busur putus-putus SVG `pathLength={1}` digambar dari kotak asal ke kotak tujuan di atas deretan kotak (puncak y≈190). Setelah p ≥ 0.8, tanda silang `X` (`--err`, 120px) muncul dengan `easeSpring` scale 0→1 di puncak busur. Busur sebelumnya meredup ke 0.4 |
| `fieldLight` | 4.1, 4.2 | Per baris JSON ada nilai `emphasis` 0–1: baris yang dipilih menyala (latar `#FFFFFF20`, opacity 1), lainnya opacity 0.35. Label ("metadata paging", "tidak dipakai") fade-in di samping baris |
| `gateMerge` | 4.3 | Chip `firstName` dan `lastName` bergerak ke tengah gerbang `toStudent()`, bertumpuk, lalu cross-fade menjadi chip `name = "Emily Johnson"`. Chip `id`, `email`, `university` lewat tanpa berubah. Kartu `Student` fade-in di kolom kanan |
| `layerTag` | 4.4 | Ikon kotak Repository (hijau) pop-in di atas gerbang (`popIn`), tiga poin fade-in berurutan (jeda 6 frame) |
| `freezeLane` | 5.1 | Lajur utama: balok berhenti bergerak di tengah, belang `--err` fade-in, ikon beku muncul. Lajur jaringan kosong |
| `laneBranch` | 5.2 | Belang hilang. Garis cabang `pathLength` dari lajur utama turun ke lajur jaringan; balok lajur utama kembali bergerak; chip `isLoading = true` + spinner muncul di lajur utama |
| `doorFork` | 5.3 | Ujung lajur jaringan bercabang (garis `pathLength`) ke dua pintu yang `popIn` berurutan (jeda 8 frame) |
| `gateCheck` | 5.4 | Gerbang belah ketupat pop-in di pintu onResponse. Dua token berjalan: satu lolos (jalur `--ok`) ke `Result.success`, satu tidak (jalur `--err`) ke `Result.failure("HTTP 404")`. Jalur onFailure menyala `--err` ke keranjang yang sama |
| `laneReturn` | 5.5 | Token `Result` melompat (parabola) kembali ke lajur utama dan menjadi chip `uiState = …`; balok "gambar layar" berikutnya berkedip menandakan penggambaran ulang |
| `symptomDrop` | 7.1–7.4 | Chip gejala jatuh dari atas (translateY −120→0, `easeSpring`) ke target. Target menyala (border 6px `--err`, atau `--ok` bila gerbang lolos). Kartu perbaikan fade-in naik 16px setelah p ≥ 0.6. Chip sebelumnya memudar ke 0 |
| `summaryPanel` | 8.5 | Panel diff cross-fade ke ringkasan dua kolom (Berubah/Tetap). Baris bawah fade-in terakhir |

## 5. Catatan implementasi
- Semua elemen di panggung dihitung dari konstanta tata letak (rect slot, koordinat pintu), bukan diukur dari DOM saat runtime.
- Reverse (Prev) otomatis simetris karena semua efek adalah fungsi murni dari frame, kecuali `.spinner`.
- Jangan menambah stop atau mengubah frame tanpa memperbarui `02-storyboard.md`.

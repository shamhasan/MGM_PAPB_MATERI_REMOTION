# 04 — Design System

Semua nilai dalam piksel pada komposisi 1920×1080. Komponen wajib memakai token CSS di bawah, bukan hex langsung.

## 1. Token (`src/styles/tokens.css`)

```css
:root {
  /* Lapisan (paten, tidak boleh diubah) */
  --c-ui: #3b82f6; /* UI / Composable */
  --c-vm: #f97316; /* ViewModel */
  --c-repo: #22c55e; /* Repository */
  --c-ds: #1e3a8a; /* Data Source */

  /* Warna teks DI ATAS warna lapisan */
  --on-ui: #ffffff;
  --on-vm: #0f172a;
  --on-repo: #0f172a;
  --on-ds: #ffffff;

  /* Latar */
  --bg-dark: #191a21; /* Scene 1, awal Scene 3 */
  --editor-bg: #282a36; /* jendela editor & kartu kode (Dracula) */
  --bg-light: #f8fafc; /* Scene 2, akhir Scene 3, 4, 5 */

  /* Teks */
  --text-dark: #0f172a;
  --text-light: #f8f8f2;
  --text-muted: #64748b;

  /* Efek */
  --laser: #ef4444; /* garis potong + border kartu peringatan */
  --arrow-event: #0f172a; /* panah user event */
  --arrow-state: #a855f7; /* panah UI state */

  /* Layout */
  --safe: 80px;
  --gap: 40px;
}
```

## 2. Kontras (alasan token `--on-*`)

| Kombinasi                       | Rasio   | Keputusan                                              |
| ------------------------------- | ------- | ------------------------------------------------------ |
| Putih di `--c-ui`               | ≈ 3,7:1 | Boleh hanya untuk teks besar (≥ 42px), berat ≥ 600     |
| Putih di `--c-vm`               | ≈ 2,8:1 | GAGAL → pakai `--on-vm` (≈ 6,4:1)                      |
| Putih di `--c-repo`             | ≈ 2,3:1 | GAGAL → pakai `--on-repo` (≈ 7,8:1)                    |
| Putih di `--c-ds`               | ≈ 10:1  | OK                                                     |
| `--c-ds` di atas `--bg-dark`    | ≈ 1,6:1 | GAGAL → kartu Data Source hanya tampil di latar terang |
| `--arrow-state` di `--bg-light` | ≈ 3,8:1 | OK (grafis ≥ 3:1)                                      |

Aturan: nama lapisan selalu ditulis di dalam chip/kotak berwarna lapisan memakai `--on-*`, atau sebagai teks `--text-dark` di atas latar terang. Jangan menulis teks berwarna oranye/hijau di atas latar terang.

## 3. Tipografi (font lokal via `@fontsource`, bobot 400/600/700)

| Peran                              | Font           | Ukuran | Catatan                          |
| ---------------------------------- | -------------- | ------ | -------------------------------- |
| Judul                              | Inter Bold     | 72     |                                  |
| Teks utama                         | Inter          | min 42 | tidak ada teks utama di bawah 42 |
| Chip nama lapisan                  | Inter Bold     | 44     |                                  |
| Kode di editor                     | JetBrains Mono | 30     | line-height 1.4                  |
| Caption kode (nama kelas, Scene 5) | JetBrains Mono | 26–28  |                                  |
| Kode di kartu (mode thumbnail)     | JetBrains Mono | 13–15  | dekoratif; boleh < min           |

Alasan 30px/1.4: 19 baris × 42px ≈ 800px + title bar 56px ≈ 856px ≤ tinggi aman 920px. Ukuran 36px/1.5 membuat tinggi lebih dari 1080px dan melanggar acceptance.

## 4. Tema kode

Dracula via `prism-react-renderer` (`themes.dracula`). Latar editor `--editor-bg`. Kotlin tidak ada bawaan di beberapa versi: tambahkan grammar Kotlin; bila tetap gagal, pakai tokenizer sederhana (keyword, string, komentar) buatan sendiri, tetap dengan palet Dracula.

## 5. Layout

- Zona aman: 80px dari tiap tepi → area kerja 1760×920.
- Grid 4 kolom: lebar kartu = (1920 − 2×80 − 3×40) / 4 = **410px**, gap 40px.
- Urutan kiri→kanan selalu: UI, ViewModel, Repository, Data Source.
- Jendela editor: lebar 1760, title bar 56px (tiga titik + tab `DetailScreen.kt`), gutter nomor baris.
- Kartu kode: latar `--editor-bg`, sudut 16px, bilah warna lapisan 8px di sisi atas.
- Kartu restoran / kotak Scene 5: latar warna lapisan, teks `--on-*`, sudut 24px.

## 6. Latar per scene

| Scene          | Latar                                                  |
| -------------- | ------------------------------------------------------ |
| 1              | `--bg-dark`                                            |
| 2              | `--bg-light`                                           |
| 3 Stop 0–1     | `--bg-dark`                                            |
| 3 Stop 2, 4, 5 | `--bg-light` (cross-fade dari gelap saat `splitBlock`) |
| 6              | `--bg-light`                                           |

## 7. Ikon (lucide-react, stroke 2, ukuran 96)

Pelayan `ConciergeBell` · Pencatat Pesanan `ClipboardList` · Bagian Pengadaan `Truck` · Gudang `Warehouse`. Tanpa emoji.

## 8. Efek

- Glow laser: `box-shadow: 0 0 12px var(--laser), 0 0 32px var(--laser)`.
- Glow fokus kartu: `0 0 0 6px <warna lapisan>33, 0 16px 40px #0F172A33`.
- Kartu peringatan dan callout Scene 1: latar `#2B1B1B`, border 4px `--laser`, teks `--text-light` 42px. Callout lebar maks 560px.
- Sorotan baris (`highlightLines`): latar `#FFFFFF20` pada baris yang disorot; baris lain opacity 0.3.
- Visual Diff (Scene 6):
  - Baris ditambah (`+`): latar `rgba(34, 197, 94, 0.18)`, teks `#4ADE80`, font JetBrains Mono 16–18px.
  - Baris diganti/dihapus (`-`): latar `rgba(239, 68, 68, 0.18)`, teks `#F87171`, font JetBrains Mono 16–18px.
- Badge Status Kartu (Scene 6):
  - **⚡ DIUBAH**: latar warna lapisan (`--c-*`), teks `--on-*`, font Inter 700 16px, border radius 8px, padding 4px 12px, bayangan halus.
  - **✓ TETAP**: latar `rgba(100, 116, 139, 0.15)`, teks `#64748B`, font Inter 600 16px, border radius 8px, padding 4px 12px.
  - **✓ TERPADU** (State 24–25): latar `rgba(34, 197, 94, 0.2)`, teks `#16A34A` / `#4ADE80`, border `1px solid rgba(34, 197, 94, 0.4)`, font Inter 700 16px, border radius 8px, padding 4px 12px.
- Kartu Rangkuman Penutup (Scene 6 Stop 5 / State 25): gaya modal kartu kontras di tengah (lebar 1240px, latar `#2B1B1B`, border 4px `--laser`, box-shadow kuat, teks `--text-light` 42px). Seluruh 4 kartu terpadu tetap tampak utuh di latar belakang.

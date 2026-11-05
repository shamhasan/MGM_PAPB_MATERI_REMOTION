# 04 — Design Delta (Modul 07)

Pakai `docs-modul06/04-design-system.md` untuk semua yang tidak disebut di sini (token lapisan, tipografi, tema Dracula, panel kode, diff, lencana). Dokumen ini hanya menambah dan mengubah.

## 1. Token baru (tambahkan ke `tokens.css`)
```css
:root {
  --c-api:  #475569;  /* REST API (di luar aplikasi) */
  --on-api: #FFFFFF;
  --ok:     #16A34A;  /* sukses (Scene 5-7) */
  --on-ok:  #0F172A;
  --err:    #DC2626;  /* gagal (Scene 5-7) */
  --on-err: #FFFFFF;
}
```
| Kombinasi | Rasio | Keputusan |
|---|---|---|
| Putih di `--c-api` | ≈ 7,6:1 | OK |
| `--on-ok` (gelap) di `--ok` | ≈ 5,4:1 | OK. Jangan pakai teks putih di `--ok` (≈ 3,3:1) |
| Putih di `--err` | ≈ 4,8:1 | OK |

Aturan warna:
- Panah event = `--arrow-event`, panah response = `--arrow-state` (sama dengan Modul 06). JANGAN biru atau hijau: biru = UI, hijau = Repository.
- `--ok` dan `--err` hanya untuk status sukses/gagal (Scene 5–7) dan tidak boleh berdampingan langsung dengan kotak Repository hijau tanpa label.
- REST API memakai `--c-api` dengan garis tepi putus-putus 4px dan caption "di luar aplikasi".

## 2. Latar
Semua scene berlatar `--bg-light`. Panel kode, JSON, dan mockup kode tetap `--editor-bg`.

## 3. Ukuran teks tambahan
| Elemen | Ukuran | Catatan |
|---|---|---|
| Subjudul stasiun (Scene 2) | Inter 30 | pengecualian label |
| Isi mockup ponsel | Inter 28 | ilustrasi; minimal 26 |
| JSON/kode di kolom Scene 4 | JetBrains Mono 24 | pengecualian kolom sempit |
| Caption di dalam kotak (Scene 3) | JetBrains Mono 26 | 2 baris maksimum |
| Panel state (Scene 6) | JetBrains Mono 28 | |

## 4. Komponen baru
- **Rel stasiun (Scene 2):** 5 slot 320px pada y=80. Tiap slot: lingkaran bernomor 56px, ikon lucide 96px, nama Inter Bold 44, subjudul Inter 30. Aktif = lingkaran `--text-dark` terisi; lewat = terisi redup; belum = garis tepi.
- **Panggung muatan:** x=80, y=340, 1760×630, latar `--editor-bg` untuk JSON/kode, latar `--bg-light` untuk ponsel.
- **Mockup ponsel:** 440×800, sudut 48px, bezel 12px `--text-dark`, layar putih, bar atas 64px berjudul "Home". Posisi: Scene 2 di tengah panggung; Scene 6 di x=140, y=120.
- **Kotak lapisan:** gunakan komponen Modul 06; tambahkan varian `api` (`--c-api`, tepi putus-putus).
- **Lajur waktu (Scene 5):** dua lajur setinggi 120px, label di kiri ("Jalur utama (UI)", "Jalur jaringan"). Balok "gambar layar" 48×48 di jalur utama. Lajur tersumbat: belang diagonal `--err`.
- **Pintu (Scene 5 dan 7):** persegi panjang 360×140 sudut 16px dengan nama mono 32 (`onResponse`, `onFailure`). Menyala: border 6px (`--ok` untuk jalur sukses, `--err` untuk jalur gagal). Gerbang `isSuccessful && body != null`: belah ketupat 56px dengan teks mono 28 di sampingnya.
- **Chip gejala (Scene 7):** latar `--text-dark`, teks `--text-light` mono 36, border kiri 8px `--err`. Kartu perbaikan: latar putih, border 4px `--ok`, teks Inter 42 `--text-dark`.
- **Panel state (Scene 6):** gaya panel kode (bagian 9 Modul 06), header tanpa deskripsi; satu baris per field.
- **Spinner:** lingkaran 96px, busur 270°, `--text-dark`. Kelas `.spinner` (lihat pengecualian di `05-delta`).

## 5. Ikon (lucide-react)
`Smartphone`, `Cloud`, `Server`, `Cog`, `Braces`, `WifiOff`, `X`, `Check`. Tanpa emoji.

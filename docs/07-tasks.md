# 07 — Tasks (milestone, Modul 07)

Kerjakan berurutan. Di akhir tiap milestone: `npx tsc --noEmit` dan `npm run build:web`, lapor sesuai `CLAUDE.md`, lalu berhenti menunggu persetujuan.

## M0 — Siapkan dari salinan Modul 06
- Lakukan langkah "Titik awal" di `CLAUDE.md`: pastikan berada di branch Modul 07 (dari branch Modul 06 terbaru) dan `docs-modul06/` berisi `04-design-system.md` dan `05-animation-spec.md`.
- Pastikan `npm run dev` dan `npm run present` masih jalan dengan scene lama sebelum menghapusnya.
- Tambahkan token baru dari `docs/04-delta` ke `tokens.css`.

## M1 — Mesin Stop Modul 07
- Ganti isi `stops.ts` sesuai `docs/05-delta`; perbarui durasi komposisi di `Root.tsx` menjadi 1207 frame.
- Scene sementara: satu kotak berlabel "state N".
- **Cek:** butir B di `06-acceptance.md` lulus (39 state, maju-mundur, Next cepat).

## M2 — Komponen bersama
- `PhoneMock`, `JsonBlock` (reveal linear + sorotan per baris), `StatePanel`, `Rail`, `Packet`, `DoorFork`, `SymptomChip`, varian kotak `api`.
- Isi `src/assets/code.ts` persis dari `docs/03` (tanpa field sensitif).
- **Cek:** JSON 16 baris dan kode 13 baris muat tanpa terpotong pada 1920×1080.

## M3 — Scene 1 dan 2 (state 0–6)
- Rekap, lalu rel 5 stasiun dengan `railStep`, `packetFly`, `jsonReveal`, `shrinkIntoMachine`, `phoneState`.

## M4 — Scene 3 (state 7–11)
- 5 kotak, `flowArrow` event dan response, `shapeShift`, `arcForbidden` x2.
- **Cek:** warna panah bukan biru/hijau; tanda silang tidak menimpa teks.

## M5 — Scene 4 (state 12–16)
- Tiga kolom, `fieldLight`, `gateMerge`, `layerTag`, kode mapper.
- **Cek:** `total`, `skip`, `limit` menyala bersama `UserResponse`, bukan `UserDto`.

## M6 — Scene 5 (state 17–22)
- Dua lajur, `freezeLane`, `laneBranch`, `doorFork`, `gateCheck`, `laneReturn`, panel kode dengan baris kunci.
- **Cek:** gerbang `isSuccessful` terlihat; spinner berputar saat state stabil.

## M7 — Scene 6 (state 23–27)
- Ponsel + panel state + panel `when` dengan sorotan cabang; alur loading → error → retry → sukses.

## M8 — Scene 7 dan 8 (state 28–38)
- Peta kesalahan dengan `symptomDrop`; peta perubahan dengan `focusBox`, `diffPanel`, `summaryPanel`.
- **Cek:** state 38 tidak menampilkan kode Coroutines/Flow.

## M9 — QA akhir
- Jalankan seluruh `06-acceptance.md` (termasuk uji offline dan butir F akurasi materi).
- Hapus scene Modul 06 yang tidak terpakai. Laporkan butir yang tidak lulus beserta penyebabnya.

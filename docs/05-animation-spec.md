# 05 — Animation Spec

Remotion tidak punya fitur "stops". Mekanismenya dibuat sendiri dengan model berikut.

## 1. Model: satu timeline global, berhenti di titik-titik tertentu

- Seluruh deck adalah satu komposisi Remotion (1920×1080, 30 fps) dengan satu timeline global.
- Setiap stop menempati rentang frame `[start, end]`. Tampilan stop yang "stabil" adalah frame `end`.
- Player **tidak pernah diputar** (`play()` dilarang). Perpindahan dilakukan oleh `driver.ts` yang menggerakkan frame dengan `requestAnimationFrame` + `seekTo`, maju maupun mundur. Karena semua animasi adalah fungsi murni dari frame, mundur otomatis simetris.

### `src/deck/stops.ts`

```ts
export const FPS = 30;

// angka = frame transisi MENUJU stop tersebut (sama dengan 02-storyboard.md)
export const SCENES = [
  { id: "spaghetti", stops: [0, 90, 24, 24, 24] },
  { id: "restaurant", stops: [18, 24, 24, 24, 24] },
  { id: "cut", stops: [18, 48, 36] },
  { id: "layers", stops: [0, 24, 24, 24, 24] }, // stop 0 ≡ akhir 'cut'.2
  { id: "flow", stops: [24, 60, 60] },
  { id: "test", stops: [24, 24, 24, 24, 24, 30] },
] as const;

// Turunkan dari SCENES (jangan tulis tangan):
// TIMELINE: { scene, stop, start, end }[]   → end = start + frames
// SETTLED:  number[]  → nilai `end` unik & terurut = daftar state (harus 26 item)
// TOTAL_FRAMES = SETTLED.at(-1)! + 1       → durasi komposisi (769)
```

Stop ber-frame 0 (selain yang pertama) otomatis lebur ke state sebelumnya karena nilai `end` sama.

### `src/deck/useStopProgress.ts`

```ts
export function useStopProgress(scene: number, stop: number): number {
  const frame = useCurrentFrame();
  const { start, end } = lookup(scene, stop);
  if (end === start) return frame >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (frame - start) / (end - start)));
}
// 0 sebelum stop dimulai · 0→1 saat transisi · 1 sesudahnya
```

Komponen scene hanya boleh membaca `useStopProgress`; tidak boleh menghitung frame global sendiri.

### `src/deck/driver.ts`

```ts
let idx = 0,
  raf = 0,
  target: number | null = null;

function animateTo(p: PlayerRef, to: number) {
  cancelAnimationFrame(raf);
  target = to;
  const from = p.getCurrentFrame(),
    dir = Math.sign(to - from),
    t0 = performance.now();
  const tick = (now: number) => {
    const f = from + dir * Math.floor(((now - t0) / 1000) * FPS);
    const c = dir > 0 ? Math.min(f, to) : Math.max(f, to);
    p.seekTo(c);
    if (c !== to) raf = requestAnimationFrame(tick);
    else target = null;
  };
  raf = requestAnimationFrame(tick);
}
// next(): jika target !== null → seekTo(target) lalu STOP (tekanan ini hanya menyelesaikan animasi).
//         jika tidak → idx = min(idx+1, SETTLED.length-1); animateTo(SETTLED[idx]).
// prev(): sama, dengan idx = max(idx-1, 0).
```

Mundur dan maju memakai kecepatan yang sama.

## 2. Pembungkus Player (`App.tsx`)

`controls={false}` `clickToPlay={false}` `doubleClickToFullscreen={false}` `spaceKeyToPlayOrPause={false}` `loop={false}`. Wrapper menjaga rasio 16:9 dan skala mengikuti viewport; latar halaman = latar scene aktif atau netral `--bg-dark`.

Input: `ArrowRight`/`PageDown`/`Space`/klik → `next()`; `ArrowLeft`/`PageUp` → `prev()`. Tanpa UI.

## 3. Easing

- Posisi/skala: `spring` dengan `{ stiffness: 120, damping: 14 }` dan `durationInFrames` = durasi stop, supaya selesai tepat di akhir stop. Hitung dengan helper:

```ts
const easeSpring = (p: number, frames: number) =>
  spring({
    frame: p * frames,
    fps: FPS,
    durationInFrames: frames,
    config: { stiffness: 120, damping: 14 },
  });
```

- Opacity: `interpolate(p, [0,1], [0,1], { easing: Easing.out(Easing.cubic), extrapolateLeft:'clamp', extrapolateRight:'clamp' })`. Opacity wajib di-clamp 0–1.
- Overshoot spring hanya boleh pada translate/scale, dan tidak boleh melewati zona aman.
- `typeCode` dan `laserCut` memakai progres linear (bukan spring).

## 4. Kosakata animasi

| Efek             | Dipakai di | Spesifikasi                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sceneIn`        | 2.0, 3.0   | Konten scene baru fade-in (opacity) selama 18 frame; konten scene lama fade-out bersamaan. Scene 4 dan 5 bukan `sceneIn`                                                                                                                                                                                                                                                                                                                                            |
| `typeCode`       | 1.1        | Jumlah karakter terlihat = `floor(p × totalKarakter)` (linear, 90 frame ≈ 6–7 karakter/frame). Seluruh teks dirender sejak awal dan karakter yang belum muncul disembunyikan (opacity 0) agar tata letak tidak melompat. Boleh menambah kursor berkedip berbasis frame (`frame % 30 < 15`)                                                                                                                                                                          |
| `dim`            | 1.2–1.4    | Opacity elemen yang diredupkan turun ke 0.3                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `highlightLines` | 1.2, 1.3   | Sorotan PER BARIS. Setiap baris punya nilai `emphasis` 0–1 yang diinterpolasi oleh progres stop. Opacity baris = `0.3 + 0.7·emphasis`; latar baris = `#FFFFFF20` × `emphasis`. Stop 1: semua baris 1 (tanpa sorotan). Stop 2: baris 3–9 → 1, lainnya → 0 (meredup). Stop 3: baris 3–9 → 0 dan baris 16–18 → 1 bersamaan (cross-fade). Stop 4: semua → 0. `CodeBlock` menerima `lineEmphasis?: (lineIdx: number) => number`, bukan hanya `dimmed` untuk seluruh blok |
| `callout`        | 1.2, 1.3   | Kartu teks kecil (gaya kartu peringatan) di sisi kanan jendela editor, sejajar dengan tengah rentang baris yang disorot. Fade-in + naik 16px (24 frame). Pada pergantian stop, callout lama fade-out dan callout baru fade-in bersamaan. Tidak boleh menimpa kode                                                                                                                                                                                                   |
| `popIn`          | 2.1–2.4    | Opacity 0→1, scale 0.85→1 (`easeSpring`), translateY 24→0                                                                                                                                                                                                                                                                                                                                                                                                           |
| `laserCut`       | 3.1        | 3 garis horizontal `--laser` + glow, masing-masing menyapu kiri→kanan selama 16 frame, berurutan. Setelah garis lewat, bagian itu mendapat bilah warna lapisan 8px di kiri dan celah 12px dari bagian di bawahnya                                                                                                                                                                                                                                                   |
| `splitBlock`     | 3.2        | Setiap pecahan berpindah dari posisinya di editor ke slot kolomnya. Gunakan **posisi absolut** dengan nilai `translate`/`scale` yang diinterpolasi antara rect awal dan rect akhir (konstanta yang dihitung dari layout di 04). Jangan menganimasikan layout flex. Latar `--bg-dark` → `--bg-light` bersamaan. Bingkai editor dan baris pembungkus memudar                                                                                                          |
| `focusGrow`      | 4.1–4.4    | Kartu fokus: scale 1→1.12 + glow warna lapisan + z-index naik. Kartu fokus sebelumnya: scale kembali ke 1. Label (chip + deskripsi + nama kelas) fade-in dan naik 16px, lalu menetap                                                                                                                                                                                                                                                                                |
| `morphToBoxes`   | 5.0        | Kartu kode Scene 4 menjadi kotak seragam 410×200: isi kode dan label memudar, nama lapisan muncul di tengah kotak; judul dan konektor fade-in                                                                                                                                                                                                                                                                                                                       |
| `flowArrow`      | 5.1, 5.2   | SVG `<path pathLength={1} strokeDasharray={1} strokeDashoffset={1−p}>`. (Jangan memakai persen; atribut ini tidak menerimanya.) Kepala panah berupa elemen terpisah yang diposisikan di ujung path dan muncul saat `p ≥ 0.9`. Event: ke kanan, `--arrow-event`, di atas kotak. State: ke kiri, `--arrow-state`, di bawah kotak                                                                                                                                      |
| `pulse`          | 5.1, 5.2   | Saat ujung panah melewati pusat sebuah kotak (p mendekati posisi relatif kotak): scale `1 + 0.05·sin(π·q)`, glow naik, caption fade-in                                                                                                                                                                                                                                                                                                                              |
| `testChange`     | 6.0–6.3    | Kartu yang diubah: scale 1→1.02 (`easeSpring`), border warna lapisan, badge **"⚡ DIUBAH"** pop-in, kode diff muncul (`+` hijau, `-` merah). 3 kartu lain meredup (opacity 0.35) dengan badge **"✓ TETAP"**. Banner permintaan di atas fade-in dan translateY 12→0                                                                                                                                                                                            |
| `unifiedCode`    | 6.4        | **Keempat kartu menyala serentak**: opacity 0.35→1.0, scale 1.0, border warna masing-masing, badge **"✓ TERPADU"** pop-in, menampilkan kode final bersih yang saling mereferensikan end-to-end dari Data Source (`mgm.org/list`) s.d. UI. Banner atas: *"Hasil Akhir: 4 Lapisan Bekerja Sama secara Harmonis"*                                                                                                                                              |
| `summaryModal`   | 6.5        | Modal rangkuman penutup kontras arsitektur vs spageti muncul di tengah layar: scale 0.88→1 (`easeSpring`), translateY 24→0, opacity 0→1, dengan keempat kartu terpadu tetap tampak utuh di latar belakang                                                                                                                                                                                                                                                         |

## 5. Hal yang dilarang

CSS `transition`/`@keyframes`, `setTimeout`, animasi berbasis waktu nyata di komponen, `player.play()`, library animasi lain.

## 6. Jebakan umum (wajib dihindari)

1. **Listener ganda.** React StrictMode (mode dev) menjalankan `useEffect` dua kali. Pasang SATU handler untuk keyboard dan klik, dan selalu beri cleanup `removeEventListener`. Gejala jika salah: tiap Next dihitung dua kali, aturan "Next saat animasi berjalan = selesaikan animasi" langsung aktif, dan animasi tampak melompat ke akhir.
2. **Auto-repeat tombol.** Abaikan `keydown` dengan `e.repeat === true`.
3. **Remount Player.** Jangan simpan `idx`/`target` di React state pada `App` (re-render memicu remount). Pakai `useRef` atau variabel modul. Prop `component` Player harus referensi stabil, bukan arrow function inline.
4. **Frame lokal.** Jangan membungkus scene dengan `<Sequence>` jika `useStopProgress` membaca `useCurrentFrame()`; hook harus membaca frame global.
5. **`typeCode`** memakai progres linear dari `useStopProgress`, bukan spring dan bukan state React.

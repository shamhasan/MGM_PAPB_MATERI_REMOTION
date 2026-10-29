# 05 — Animation Spec (Modul 07: REST API & Retrofit)

Remotion tidak memiliki mekanisme bawaan untuk transisi berbasis _presentation stops_. Sistem navigasi langkah-demi-langkah dibangun mandiri di atas satu timeline global linier menggunakan arsitektur berikut.

---

## 1. Model Timeline Global & Titik Henti (Stops)

- Seluruh presentasi dikemas ke dalam satu komposisi Remotion tunggal dengan resolusi 1920×1080 pada 30 FPS.
- Setiap stop menduduki interval frame tertentu `[start, end]`. Kondisi tampilan yang stabil tercapai tepat di frame `end`.
- Pemutar Remotion **dilarang keras diputar otomatis** (`player.play()` tidak boleh dipanggil). Transisi antar-state sepenuhnya digerakkan oleh `driver.ts` menggunakan kombinasi `requestAnimationFrame` dan `seekTo`.
- Seluruh animasi merupakan fungsi matematika murni dari nomor frame, sehingga navigasi mundur (_Prev_) otomatis bergerak simetris dengan navigasi maju (_Next_).

### Konfigurasi Stop (`src/deck/stops.ts`)

```ts
export const FPS = 30;

// Nilai angka merepresentasikan frame transisi MENUJU stop tersebut
export const SCENES = [
  { id: "spaghetti", stops: [0, 90, 24, 24, 24] }, // Scene 1: 5 stop (State 0-4)
  { id: "logistics", stops: [18, 24, 24, 24, 24] }, // Scene 2: 5 stop (State 5-9)
  { id: "cut", stops: [18, 48, 36] }, // Scene 3: 3 stop (State 10-12)
  { id: "layers", stops: [0, 24, 24, 24, 24] }, // Scene 4: Stop 0 lebur dengan cut.2
  { id: "flow", stops: [24, 60, 60] }, // Scene 5: 3 stop (State 17-19)
  { id: "test", stops: [24, 24, 24, 24, 24, 30] }, // Scene 6: 6 stop (State 20-25)
] as const;

// Struktur otomatis (dihitung oleh helper, bukan manual):
// TIMELINE: { scene, stop, start, end }[]   -> end = start + frames
// SETTLED:  number[]                        -> array frame 'end' unik (tepat 26 state)
// TOTAL_FRAMES = SETTLED.at(-1)! + 1        -> total frame komposisi (tepat 769 frame)
```

Stop bernilai 0 frame pada Scene 4 Stop 0 secara otomatis melebur ke state sebelumnya karena nomor frame akhir yang sama.

---

## 2. Pengambilan Progres Stop (`useStopProgress.ts`)

```ts
export function useStopProgress(scene: number, stop: number): number {
  const frame = useCurrentFrame();
  const { start, end } = lookup(scene, stop);
  if (end === start) return frame >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (frame - start) / (end - start)));
}
```

Setiap komponen scene hanya diperbolehkan membaca nilai progres ternormalisasi (0 $\rightarrow$ 1) dari `useStopProgress` dan dilarang mengkalkulasi nomor frame global secara mandiri.

---

## 3. Logika Transisi Halus (`src/deck/driver.ts`)

```ts
let idx = 0;
let raf = 0;
let target: number | null = null;

function animateTo(p: PlayerRef, to: number) {
  cancelAnimationFrame(raf);
  target = to;
  const from = p.getCurrentFrame();
  const dir = Math.sign(to - from);
  const t0 = performance.now();

  const tick = (now: number) => {
    const f = from + dir * Math.floor(((now - t0) / 1000) * FPS);
    const c = dir > 0 ? Math.min(f, to) : Math.max(f, to);
    p.seekTo(c);
    if (c !== to) {
      raf = requestAnimationFrame(tick);
    } else {
      target = null;
    }
  };
  raf = requestAnimationFrame(tick);
}
```

- **Aturan Next()**: Jika transisi sedang berjalan (`target !== null`), penekanan tombol akan membatalkan animasi berjalan dan langsung memposisikan frame ke `seekTo(target)`. Jika sedang stabil, tombol akan menaikkan `idx` dan menjalankan `animateTo(SETTLED[idx])`.

- **Aturan Prev()**: Mengurangi `idx` dan menganimasikan frame mundur menuju target sebelumnya secara simetris.

---

## 4. Pembungkus Player (`src/web/App.tsx`)

Properti Player Remotion dikonfigurasi tanpa elemen kontrol antarmuka:

```tsx
<Player
  clickToPlay="{false}"
  component="{Deck}"
  compositionHeight="{1080}"
  compositionWidth="{1920}"
  controls="{false}"
  doubleClickToFullscreen="{false}"
  durationInFrames="{TOTAL_FRAMES}"
  fps="{FPS}"
  loop="{false}"
  ref="{playerRef}"
  spaceKeyToPlayOrPause="{false}"
/>
```

- Input pendukung: Tombol `ArrowRight`, `PageDown`, `Space`, atau klik kiri layar untuk memicu `next()`.

- Tombol `ArrowLeft` atau `PageUp` untuk memicu `prev()`.

---

## 5. Rumus Easing & Interpolasi

- **Translasi, Skala & Pergerakan Kartu**: Menggunakan model pegas `spring` dengan konfigurasi kekakuan `{ stiffness: 120, damping: 14 }` yang selesai tepat di akhir frame stop:

```ts
const easeSpring = (p: number, frames: number) =>
  spring({
    frame: p * frames,
    fps: FPS,
    durationInFrames: frames,
    config: { stiffness: 120, damping: 14 },
  });
```

- **Transisi Opacity**: Menggunakan interpolasi kurva kubik dengan penjepit batas ketat (_clamp_):

```ts
interpolate(p, [0, 1], [0, 1], {
  easing: Easing.out(Easing.cubic),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

- Efek pengetikan kode (`typeCode`) dan pemotongan laser (`laserCut`) wajib menggunakan kalkulasi progres linier, bukan spring.

---

## 6. Kosakata Animasi Lengkap

| Efek Animasi     | State Penggunaan | Spesifikasi & Parameter Teknis                                                                                                                                                                                       |
| ---------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sceneIn`        | 2.0, 3.0         | Konten scene baru memudar masuk (_fade-in_ 18 frame) bersamaan dengan memudarnya konten scene lama.                                                                                                                  |
| `typeCode`       | 1.1              | Karakter kode muncul linier selama 90 frame ($\approx 6\text{--}7$ karakter per frame). Tata letak tidak melompat karena teks tersembunyi menggunakan `opacity: 0`.                                                  |
| `dim`            | 1.2–1.4          | Penurunan opacity baris yang tidak aktif menjadi 0.3.                                                                                                                                                                |
| `highlightLines` | 1.2, 1.3         | Sorotan per baris kode berbasis nilai `emphasis` (0 $\rightarrow$ 1). Latar baris `#FFFFFF20`, transisi baris 3–7 menuju baris 26–31 menggunakan _cross-fade_.                                                       |
| `callout`        | 1.2, 1.3         | Kartu informasi melayang muncul di sisi kanan jendela editor (fade-in + translasi vertikal 16px ke atas selama 24 frame) tanpa menimpa baris kode terpanjang.                                                        |
| `popIn`          | 2.1–2.4          | Kemunculan kartu analogi (opacity 0 $\rightarrow$ 1, scale 0.85 $\rightarrow$ 1 via `easeSpring`, translasi Y 24 $\rightarrow$ 0).                                                                                   |
| `laserCut`       | 3.1              | Tiga garis laser neon merah menyapu kanvas horizontal dari kiri ke kanan secara sekuensial (masing-masing 16 frame, total 48 frame), memunculkan garis warna lapisan setebal 8px di sisi kiri.                       |
| `splitBlock`     | 3.2              | Empat pecahan kode berpencar menggunakan interpolasi posisi absolut menuju 4 slot kartu kolom 410px. Latar berganti dari `--bg-dark` ke `--bg-light`.                                                                |
| `focusGrow`      | 4.1–4.4          | Kartu yang disorot membesar (scale 1.0 $\rightarrow$ 1.12 + pendaran warna lapisan). Label chip kelas resmi (`StudentRemoteDataSource`, dll.) memudar masuk dari bawah.                                              |
| `morphToBoxes`   | 5.0              | Kartu kode menyusut menjadi blok arsitektur diagram seragam 410×200px dan memunculkan blok server DummyJSON.                                                                                                         |
| `flowArrow`      | 5.1, 5.2         | Animasi garis SVG `<path pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p}>`. Panah Request bergerak ke kanan (`--arrow-event`), panah Response bergerak ke kiri (`--arrow-state`).                        |
| `pulse`          | 5.1, 5.2         | Blok berdenyut halus (`scale: 1 + 0.05 * sin(π * q)`) saat ujung panah melintas tepat di atasnya, memicu pergantian teks caption.                                                                                    |
| `testChange`     | 6.0–6.3          | Kartu sasaran membesar ke scale 1.02, border lapisan menyala, badge **"⚡ DIUBAH"** muncul, dan diff kode berwarna tampil. Tiga kartu lainnya meredup ke opacity 0.35 dengan badge **"✓ TETAP"**.                    |
| `unifiedCode`    | 6.4              | Seluruh 4 kartu menyala serempak ke opacity 1.0 dengan badge **"✓ TERPADU"**, menampilkan kode bersih Modul 07 yang saling terhubung end-to-end.                                                                     |
| `summaryModal`   | 6.5              | Modal kontras penutup melayang di tengah kanvas (scale 0.88 $\rightarrow$ 1 via `easeSpring`, translasi Y 24 $\rightarrow$ 0, opacity 0 $\rightarrow$ 1). Keempat kartu terpadu tetap tampak utuh di latar belakang. |

---

## 7. Hal yang Dilarang Keras

- Dilarang memakai CSS `transition` atau `@keyframes`.
- Dilarang memakai `setTimeout` atau `setInterval`.
- Dilarang menggunakan _state_ berbasis waktu nyata di dalam komponen visual.
- Dilarang memanggil `player.play()`.

---

## 8. Jebakan Teknis & Langkah Pencegahan

1. **Pemicu Dobel React StrictMode**: Pasang event listener keyboard dan klik tepat satu kali di dalam hook utama dengan fungsi pembersih `removeEventListener`.
2. **Auto-Repeat Keyboard**: Abaikan seluruh penekanan tombol keyboard yang memiliki flag `e.repeat === true` agar animasi tidak melompati state saat tombol ditekan lama.
3. **Remounting Player**: Jangan menyimpan indeks stop atau target frame di dalam React State pada level `App.tsx`. Simpan pada variabel modul atau `useRef` agar Player Remotion tidak melakukan re-render ulang.
4. **Isolasi Sequence Frame**: Hindari membungkus scene menggunakan komponen `<Sequence>` bawaan Remotion bila `useStopProgress` membaca nomor frame global.

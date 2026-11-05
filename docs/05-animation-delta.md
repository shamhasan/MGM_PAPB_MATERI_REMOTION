# 05 — Animation Delta (Modul 08: Kotlin Coroutines & Flow)

Mesin Stop Engine, driver navigasi (`driver.ts`), hook `useStopProgress`, serta rumus kurva easing pegas (`easeSpring`) mewarisi spesifikasi dasar dari `docs-modul06/05-animation-spec.md` dan `docs-modul07/05-animation-delta.md`. Dokumen ini memperbarui konfigurasi timeline `stops.ts` dan mendefinisikan kosakata animasi baru untuk materi Kotlin Coroutines & Flow.

---

## 1. Konfigurasi Timeline (`src/deck/stops.ts`)

Ganti konfigurasi `SCENES` di `src/deck/stops.ts` menjadi 6 scene berikut:

```ts
export const FPS = 30;

// Nilai angka merepresentasikan frame transisi MENUJU stop tersebut
export const SCENES = [
  { id: "painpoints", stops: [0, 30, 30, 30] }, // Scene 1: State 0–3   (90 frame)
  { id: "suspend", stops: [24, 36, 36, 30, 24] }, // Scene 2: State 4–8   (150 frame)
  { id: "structured", stops: [24, 30, 30, 36, 30] }, // Scene 3: State 9–13  (150 frame)
  { id: "stateflow", stops: [24, 30, 30, 36, 30] }, // Scene 4: State 14–18 (150 frame)
  { id: "flowsearch", stops: [24, 30, 36, 30, 36, 30] }, // Scene 5: State 19–24 (186 frame)
  { id: "summary", stops: [24, 30, 30, 30, 30, 30] }, // Scene 6: State 25–30 (174 frame)
] as const;

// Target Kalkulasi Otomatis:
// SETTLED:      number[] (Tepat 31 state unik, frame akhir 0 hingga 900)
// TOTAL_FRAMES: number   (Tepat 901 frame -> SETTLED.at(-1)! + 1)
```

- Durasi total komposisi Remotion di `src/Root.tsx` dikunci ke **901 frame** (30 FPS, durasi efektif ~30 detik tanpa jeda dosen).

- Tidak ada stop berdurasi 0 frame selain Stop 0 pada Scene 1, sehingga seluruh 31 state berdiri sendiri tanpa penggabungan (_merge_).

---

## 2. Aturan Waktu & Pengecualian CSS

- **Deterministik**: Seluruh animasi adalah fungsi matematika murni dari nomor frame melalui `useStopProgress(scene, stop)`. Navigasi mundur (_Prev_) otomatis bergerak simetris dengan navigasi maju (_Next_).

- **Larangan**: Dilarang menggunakan CSS `transition`, CSS `@keyframes` umum, `setTimeout`, `setInterval`, maupun `player.play()`.

- **Pengecualian Khusus**:
- Class `.spinner` dekoratif (pada indikator loading UI) diizinkan memakai CSS `@keyframes` rotasi murni agar tetap berputar ketika timeline berhenti di state stabil.

- Elemen `.spinner` dikecualikan dari pengujian keselarasan maju-mundur identik di `06-acceptance.md`.

---

## 3. Efek yang Dipakai Ulang dari Modul Sebelumnya

Mewarisi implementasi fungsi dari `docs-modul06/05-animation-spec.md`:

- `sceneIn`: Fade-in kanvas baru dan fade-out kanvas lama (18–24 frame).

- `popIn`: Kemunculan elemen dengan translasi Y $24 \rightarrow 0$ dan scale $0.85 \rightarrow 1.0$ via `easeSpring`.

- `pulse`: Efek denyut halus (`scale: 1 + 0.05 * sin(π * p)`).

- `focusBox` / `focusGrow`: Penekanan kontras kartu lapisan terpilih (scale $1.0 \rightarrow 1.05$) dan peredupan kartu lainnya ke opacity 0.35.

- `diffPanel`: Transisi visual kode diff hijau ($+$) dan merah ($-$).

- `summaryPanel`: Transisi cross-fade menuju tabel ringkasan 2 kolom.

- `keyLines`: Penyorotan baris kode terpilih dengan latar baris `#FFFFFF20` dan redupnya baris lain.

---

## 4. Kosakata Efek Animasi Baru (Modul 08)

Semua efek di bawah dihitung menggunakan nilai `p = useStopProgress(scene, stop)` dengan rentang $[0, 1]$.

| Efek Animasi    | State Penggunaan | Spesifikasi & Parameter Teknis                                                                                                                                                                                                                                                                                                |
| --------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bookmarkPause` | 2.1              | Pita emas `BookmarkIndicator` jatuh dari atas (translasi Y $-60\text{px} \rightarrow 0$, scale $0.9 \rightarrow 1.0$ via `easeSpring`) tepat menancap di tepi kiri baris kode `val data = repository.getStudents()`. Garis Main Thread meredup ke opacity 0.4 sejenak lalu kembali ke 1.0 menandakan thread telah dilepaskan. |
| `bookmarkResume` | 2.2 | Pita pembatas buku terangkat naik vertikal (translasi Y $0 \rightarrow -32\text{px}$, opacity $1.0 \rightarrow 0$) disertai efek cahaya pendaran emas (`box-shadow` menyebar) selama separuh awal frame. Baris kode berikutnya (`updateUi(data)`) fade-in menyala sekuensial. |
| `laneBranch` | 2.1, 3.1 | Jalur eksekusi background bercabang turun secara halus dari lajur Main Thread menggunakan lintasan SVG kurva Bezier dengan animasi `strokeDashoffset: 1 - p`. |
| `scopeCancel` | 3.2 | Garis potong laser neon (`--laser`) menyapu horizontal dari kiri ke kanan memotong node `Job #1`. Node anak seketika berganti warna menjadi abu-abu redup (opacity 0.3) dengan stamp teks "CANCELLED" merah miring. |
| `throwWarning` | 3.3, 3.4 | Ikon peringatan bahaya `ShieldAlert` bergetar horizontal halus ($\pm 4\text{px}$, 3 siklus) saat blok catch menelan exception. Pada 3.4, getaran berhenti dan chip hijau menyala menggantikannya saat `throw e` diterapkan. |
| `lifecycleSwitch` | 4.3, 4.4 | Pill badge `LifecycleBadge` bertransisi: <br> <br>- **4.3 (Aktif)**: Lampu hijau membesar (scale $0.8 \rightarrow 1.2 \rightarrow 1.0$), teks "RESUMED (Koleksi Aktif)" fade-in. <br> <br>- **4.4 (Jeda)**: Lampu hijau cross-fade ke kuning, teks berganti "STOPPED (Koleksi Dijeda)", dan partikel aliran data membeku seketika. |
| `pipeStream` | 5.1 | Partikel teks query berbentuk kapsul kecil (`"j"`, `"ja"`, `"john"`) meluncur masuk dari slot Composable ke dalam mulut pipa Flow (translasi X $0 \rightarrow 340\text{px}$). |
| `debounceHold` | 5.2 | Partikel query berhenti di depan gerbang Node D. Indikator jam pasir berputar $360^\circ \times p$ linier. Partikel query lama (`"j"` dan `"ja"`) menyusut (scale $1.0 \rightarrow 0$) dan melebur ke partikel terbaru. |
| `distinctGate` | 5.3 | Gerbang Node D membuka ke atas (translasi Y $0 \rightarrow -24\text{px}$). Partikel `"john"` melesat maju melewati gerbang menuju Node E via `easeSpring`. |
| `cancelBurst` | 5.4 | Skenario pembatalan `collectLatest`: paket request lama yang sedang berada di antara Node E dan F meledak menjadi 6 partikel kecil yang memudar ke arah luar (`scale: 1 -> 1.8`, `opacity: 1 -> 0`), digantikan oleh paket data baru. |
| `collectSuccess` | 5.5 | Paket hasil pencarian dari Node F meluncur ke Node G (`HomeUiState`), memicu riak gelombang air melingkar di sekeliling node. Layar mockup ponsel cross-fade memperbarui baris daftar mahasiswa. |

---

## 5. Rumus Easing & Interpolasi

Patuhi implementasi matematis berikut:

```ts
import { spring, interpolate, Easing } from "remotion";

// Easing Pegas Standar (Translasi, Skala & Kartu)
export const easeSpring = (p: number, frames: number) =>
  spring({
    frame: p * frames,
    fps: FPS,
    durationInFrames: frames,
    config: { stiffness: 120, damping: 14 },
  });

// Interpolasi Opacity (Clamp Kubik)
export const easeOpacity = (p: number) =>
  interpolate(p, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Perputaran Linier (Timer Debounce & Gerigi Mesin)
export const linearRotation = (p: number, turns: number = 1) =>
  `${p * turns * 360}deg`;
```

---

## 6. Catatan Implementasi & Pencegahan Bug

1. **Koordinat Absolut Statis**: Seluruh lintasan konveyor pipa Flow (Scene 5) dan diagram pohon (Scene 3) wajib dihitung dari konstanta tata letak tetap, bukan diukur secara dinamis dari DOM runtime (`getBoundingClientRect`).

2. **Reverse Simetris**: Karena `useStopProgress` menghitung progres murni berdasarkan selisih frame terhadap batas stop, penekanan tombol Prev akan mengembalikan posisi partikel Flow dan pembatas buku ke posisi semula secara presisi.

3. **Penyelarasan Durasi stops.ts**: Dilarang memodifikasi angka array `stops` di `stops.ts` tanpa memperbarui tabel `Peta State Global` di `docs/02-storyboard.md`.

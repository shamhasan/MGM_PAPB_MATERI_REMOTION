# Deck Interaktif: Arsitektur Aplikasi Android 📱🏛️

> **Materi Kuliah Pemrograman Aplikasi Perangkat Bergerak (CIF62041)**  
> Laboratorium Mobile, Game, dan Multimedia (MGM) & Curriculum FILKOM UB — Modul Praktikum 06.

---

## 📖 1. Tentang Proyek (Isinya Apa)

Proyek ini adalah **slide deck presentasi visual interaktif berbasis web** (bukan sekadar video MP4 statis) yang dirancang khusus sebagai alat bantu ajar dosen/asisten praktikum. 

Tujuan utamanya adalah mendemonstrasikan secara visual **mengapa dan bagaimana** kode aplikasi Android monolitik (*spaghetti code* dalam satu file Composable) dipecah secara sistematis menjadi **4 Lapisan Arsitektur Standar**:
1. **UI Layer** (`DetailScreen` Composable)
2. **ViewModel Layer** (`DetailViewModel`, `DetailUiState`)
3. **Repository Layer** (`StudentRepository`, `DefaultStudentRepository`)
4. **Data Source Layer** (`StudentLocalDataSource`, `StudentRemoteDataSource` / REST API)

### 🎬 Alur Materi (6 Scene & 26 State)
Presentasi ini terbagi ke dalam 6 *scene* dengan total **26 state stabil (*stops*)**:
1. **Scene 1 — Spaghetti Code**: Menyoroti masalah kode monolitik di mana logic, state, dan UI bertumpuk dalam satu fungsi (lengkap dengan header branding perkuliahan).
2. **Scene 2 — Filosofi Restoran**: Analogi dunia nyata peran Pelanggan, Pramusaji, Koki, dan Pemasok Bahan Makanan yang mempermudah pemahaman 4 layer.
3. **Scene 3 & 4 — Tebas Kode & Empat Lapis**: Visualisasi pemotongan kode secara dramatis ke dalam 4 kolom arsitektur terisolasi dengan pewarnaan semantik.
4. **Scene 5 — Aliran Eksekusi**: Visualisasi siklus data (User Event masuk ke dalam, UI State mengalir keluar).
5. **Scene 6 — Uji Perubahan & Kesimpulan**: Pembuktian independensi arsitektur—bagaimana perubahan kebutuhan (seperti migrasi ke REST API `mgm.org/list`) hanya menyentuh layer terkait tanpa merusak layer lainnya.

Seluruh *scene* dilengkapi *watermark persistent* resmi (MGM, Curriculum, dan identitas instruktur).

---

## ⚙️ 2. Spesifikasi Teknis (Spesifikasinya Apa)

| Parameter | Spesifikasi | Keterangan |
| :--- | :--- | :--- |
| **Resolusi Kanvas** | `1920 × 1080` (16:9 Full HD) | Ter-scale proporsional mengikuti ukuran proyektor / layar monitor |
| **Framerate** | `30 FPS` | Animasi halus (*smooth easing*) berbasis frame |
| **Total Frames** | `769 Frames` | Dikelola terpusat pada timeline stops |
| **Model Animasi** | Stop-based deterministic | Animasi maju/mundur dihitung murni dari posisi frame (`useCurrentFrame`) |
| **Konektivitas** | **100% Offline** | Tanpa CDN eksternal, tanpa dependensi jaringan, font dibundel lokal |
| **Kebutuhan Node.js**| `^20.19.0`, `^22.13.0`, atau `>=24.0.0` | Sesuai konfigurasi `package.json` |
| **Browser Target** | Chrome, Edge, Firefox, Safari (Modern) | Mendukung Web Animations & Hardware Acceleration |

---

## 🛠️ 3. Teknologi yang Digunakan (Technologynya Apa)

Proyek ini dibangun menggunakan kombinasi ekosistem React modern dan Remotion:

- **[Remotion](https://www.remotion.dev/) (`v4.0.537`)**: Mesin pembuat animasi berbasis React yang menghitung transformasi visual deterministik berdasarkan indeks frame.
- **[@remotion/player](https://www.remotion.dev/docs/player)**: Komponen pemutar interaktif yang mengontrol playback frame tanpa render video berkas fisik.
- **[React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)**: Fondasi antarmuka dan struktur kode dengan pengecekan tipe ketat (*strict mode*).
- **[Vite 6](https://vitejs.dev/)**: *Development server* berkecepatan tinggi dan *production bundler* untuk menyajikan deck presentasi secara web-native.
- **[Prism React Renderer](https://github.com/FormidableLabs/prism-react-renderer)**: Penampil cuplikan kode (*syntax highlighting*) dengan tema Dracula yang disesuaikan untuk sintaks Kotlin & Jetpack Compose.
- **[Lucide React](https://lucide.dev/)**: Kumpulan ikon UI vektor modern dan ringan.
- **[Fontsource](https://fontsource.org/)**: `@fontsource/inter` (antarmuka) dan `@fontsource/jetbrains-mono` (kode) agar tipografi tetap konsisten saat dijalankan tanpa internet.
- **Vanilla CSS Tokens (`tokens.css`)**: Sistem desain terstandar untuk warna arsitektur (UI Biru, ViewModel Oranye, Repository Hijau, Data Source Navy).

---

## 🚀 4. Cara Menjalankan Proyek (Cara Run Nya Gimana)

### 1. Instalasi Dependensi
Pastikan Node.js sudah terpasang di komputer Anda, lalu buka terminal di direktori proyek dan jalankan:
```bash
npm install
```

---

### 2. Menjalankan Mode Presentasi Interaktif *(Rekomendasi untuk Mengajar)*
Jalankan aplikasi web presentasi interaktif menggunakan Vite:
```bash
npm run present
```
- Buka tautan lokal yang muncul di terminal (biasanya **`http://localhost:5173`**).
- Tekan `F11` pada browser untuk masuk ke mode layar penuh (*fullscreen*).

#### 🎮 Kontrol Navigasi Presentasi:
Presentasi ini tidak memiliki tombol navigasi di layar agar tampilan bersih di proyektor:
| Aksi | Tombol Keyboard / Mouse |
| :--- | :--- |
| **Maju ke Stop Berikutnya (Next)** | Tombol `ArrowRight` (➡️), `Space` (Spasi), `PageDown`, atau **Klik Kiri Mouse** |
| **Mundur ke Stop Sebelumnya (Prev)** | Tombol `ArrowLeft` (⬅️) atau `PageUp` |

---

### 3. Menjalankan Remotion Studio *(Mode Pratinjau / Scrub Frame)*
Jika Anda ingin memeriksa animasi frame demi frame, menggeser timeline (*scrubbing*), atau debugging layout:
```bash
npm run dev
```
- Buka **`http://localhost:3000`** di browser.
- Gunakan slider timeline di bagian bawah untuk melihat komposisi `Deck`.

---

### 4. Build untuk Presentasi Offline Mandiri
Jika ingin menyiapkan bundel statis agar bisa dibuka tanpa server Node di ruang kelas:
```bash
npm run build:web
```
Hasil build akan tersimpan di folder `dist/` dan siap disajikan menggunakan web server statis lokal apa pun.

---

### 5. Pemeriksaan Tipe dan Linter
Untuk memverifikasi tidak ada kesalahan tipe TypeScript atau lint:
```bash
npm run lint
```

---

## 📂 Struktur Direktori

```text
├── docs/                     # Dokumentasi spesifikasi, storyboard, & design system
│   ├── 01-brief.md           # Ikhtisar proyek dan tujuan pembelajaran
│   ├── 02-storyboard.md      # Detail tiap scene dan 26 stops
│   ├── 04-design-system.md   # Token warna, tipografi, dan layout
│   └── 05-animation-spec.md  # Formula matematis transisi frame
├── src/
│   ├── assets/               # Kode Kotlin sampel (docs/03) & aset gambar
│   ├── components/           # Komponen UI (EditorWindow, CodeBlock, LayerCard, dll.)
│   ├── deck/                 # Inti pengatur presentasi
│   │   ├── Deck.tsx          # Komposisi utama Remotion
│   │   ├── stops.ts          # Konfigurasi durasi & urutan stop (Single Source of Truth)
│   │   └── driver.ts         # Controller rAF navigasi maju & mundur
│   ├── scenes/               # Implementasi Scene 1 hingga Scene 6
│   ├── styles/               # CSS design tokens (tokens.css)
│   ├── web/                  # Entry point web player interaktif (App.tsx & main.tsx)
│   ├── Root.tsx              # Pendaftaran komposisi Remotion
│   └── index.ts              # Entry point Remotion Studio
├── index.html                # Entry file Vite
└── package.json              # Dependensi dan skrip proyek
```

---

## ⚠️ Troubleshooting & Catatan Tambahan

- **Port 3000 Bentrok saat menjalankan `npm run dev`**:  
  Jika muncul pesan `Does this look like a foreign page?`, pastikan tidak ada aplikasi lain yang menggunakan port 3000, atau hentikan proses dev server sebelumnya sebelum menjalankan ulang.
- **Proyek ini BUKAN generator video MP4**:  
  Perintah `remotion render` sengaja tidak digunakan karena presentasi ini mengandalkan kontrol interaktif langkah demi langkah secara *real-time*.
- **Lisensi Remotion**:  
  Penggunaan Remotion untuk kebutuhan perkuliahan/institusi tunduk pada ketentuan lisensi Remotion ([remotion.dev/license](https://remotion.dev/license)).

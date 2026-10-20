# 03 — Aset Kode (Scene 1, 3, 4)

Salin string di bawah ke `src/assets/code.ts` apa adanya.

## Aturan marker
- Marker berbentuk `// @layer:<nama>-start` dan `// @layer:<nama>-end`, nama ∈ `datasource | repository | viewmodel | ui`.
- Marker **tidak boleh bertumpuk atau bersarang**. Tiap baris kode milik tepat satu lapisan; baris kosong di antara blok tidak milik lapisan mana pun.
- Baris marker **tidak ditampilkan**. `parseLayers(raw)` menghapus baris marker dan mengembalikan `{ lines: string[], layerOf: (Layer | null)[] }`.
- Pecahan yang tampil di kartu (Scene 3 Stop 2) di-dedent 4 spasi.
- Urutan di file (atas→bawah): datasource, repository, viewmodel, ui. Setelah split, urutan kiri→kanan menjadi ui, viewmodel, repository, datasource.

## Kode (setelah marker dihapus: 19 baris termasuk 3 baris kosong)

```kotlin
@Composable
fun DetailScreen(studentId: Int) {
    // @layer:datasource-start
    val students = listOf(
        Student(2026, "Alya Putri", "TI", 2026),
        Student(2027, "Bima Pratama", "TI", 2026)
    )
    // @layer:datasource-end

    // @layer:repository-start
    fun getStudentById(id: Int): Student? =
        students.find { it.id == id }
    // @layer:repository-end

    // @layer:viewmodel-start
    var student by remember { mutableStateOf<Student?>(null) }
    LaunchedEffect(studentId) {
        student = getStudentById(studentId)
    }
    // @layer:viewmodel-end

    // @layer:ui-start
    Column {
        Text(student?.name ?: "Mencari data...")
    }
    // @layer:ui-end
}
```

## Pemetaan baris tampil → lapisan
| Lapisan | Baris tampil | Isi |
|---|---|---|
| (tanpa) | 1–2 | `@Composable` dan deklarasi fungsi |
| datasource | 3–6 | list `students` |
| repository | 8–9 | fungsi `getStudentById` |
| viewmodel | 11–14 | `student` + `LaunchedEffect` |
| ui | 16–18 | `Column { Text(...) }` |
| (tanpa) | 19 | kurung tutup fungsi |

Baris 1–2 dan 19 adalah "pembungkus": tetap tampil pada `laserCut`, lalu memudar (fade out) bersama bingkai editor saat `splitBlock`. Kartu hanya berisi baris milik lapisannya.

## Catatan konsistensi dengan Modul 06
- Nama fungsi `DetailScreen`, sama dengan modul.
- `Student(id, name, program, year)` memakai 4 parameter, sama dengan modul. Program dipendekkan jadi `"TI"` agar baris tidak panjang di kartu.
- Kode ini sengaja "buruk": data, aturan akses, state, dan tampilan berada dalam satu fungsi.

## Keterangan label lapisan (dipakai Scene 4 dan 5)
| Lapisan | Label chip | Deskripsi | Nama kelas (font mono) |
|---|---|---|---|
| Data Source | Data Source | Sumber data (in-memory list) | `StudentLocalDataSource` |
| Repository | Repository | Satu pintu akses data | `StudentRepository` |
| ViewModel | ViewModel | State holder tingkat layar | `DetailViewModel` |
| UI | Composable UI | Menampilkan state & mengirim event | `DetailScreen` |

## Caption Scene 5
| Lapisan | Saat event (Stop 1) | Saat state (Stop 2) |
|---|---|---|
| UI | `onClick` | render ke layar |
| ViewModel | `loadStudent(id)` | `DetailUiState` |
| Repository | `getStudentById(id)` | `Student` |
| Data Source | `students.find { … }` | `Student` |

## Kode Diff Scene 6 (Uji Perubahan)

Setiap contoh perubahan hanya memodifikasi 1 lapisan. Baris bertanda `+` adalah baris baru (warna hijau), baris bertanda `-` adalah baris yang diganti/dihapus (warna merah). Tiga lapisan lainnya tidak disentuh.

### Permintaan 1 — Data Source: Ambil data via REST API endpoint (`mgm.org/list`)
```kotlin
// Data Source beralih dari list statis ke endpoint jaringan:
- val students = listOf(
-     Student(2026, "Alya Putri", "TI", 2026),
-     Student(2027, "Bima Pratama", "TI", 2026)
- )
+ fun getStudents(): List<Student> =
+     httpClient.get("mgm.org/list")
```
*(UI, ViewModel, dan Repository: TETAP)*

### Permintaan 2 — Repository: Tolak ID yang tidak valid (≤ 0)
```kotlin
fun getStudentById(id: Int): Student? =
-   dataSource.getStudentById(id)
+   if (id <= 0) null else dataSource.getStudents().find { it.id == id }
```
*(UI, ViewModel, dan Data Source: TETAP)*

### Permintaan 3 — ViewModel: Pesan error sebutkan ID-nya
```kotlin
LaunchedEffect(studentId) {
    val result = repository.getStudentById(studentId)
-   errorMessage = "Mahasiswa tidak ditemukan"
+   errorMessage = "Mahasiswa #$studentId tidak ditemukan"
}
```
*(UI, Repository, dan Data Source: TETAP)*

### Permintaan 4 — UI: Tampilkan angkatan di layar
```kotlin
Column {
    Text(student?.name ?: "Mencari data...")
+   Text("Angkatan: ${student?.year ?: \"-\"}")
}
```
*(ViewModel, Repository, dan Data Source: TETAP)*

---

## Kode 4 Lapisan Terpadu (State 24 & 25)

Di State 24 dan State 25, **seluruh 4 layer ditampilkan dalam kondisi terupdate penuh** (bukan hanya Data Source). Lapisan-lapisan lain tetap mengambil dari Data Source sebagai referensi perubahan di code asset, saling mereferensikan secara terhubung (*nyambung*) dari Data Source hingga UI:

### 1. Data Source (`StudentRemoteDataSource`)
```kotlin
class StudentRemoteDataSource(private val client: HttpClient) {
    fun getStudents(): List<Student> =
        client.get("mgm.org/list")
}
```

### 2. Repository (`StudentRepository`) — Mengambil referensi dari Data Source
```kotlin
class StudentRepository(private val dataSource: StudentRemoteDataSource) {
    fun getStudentById(id: Int): Student? =
        if (id <= 0) null
        else dataSource.getStudents().find { it.id == id }
}
```

### 3. ViewModel (`DetailViewModel`) — Mengambil referensi dari Repository
```kotlin
class DetailViewModel(private val repository: StudentRepository) {
    var student by mutableStateOf<Student?>(null)
    var errorMessage by mutableStateOf<String?>(null)

    fun loadStudent(id: Int) {
        val result = repository.getStudentById(id)
        student = result
        if (result == null) errorMessage = "Mahasiswa #$id tidak ditemukan"
    }
}
```

### 4. Composable UI (`DetailScreen`) — Mengambil referensi dari ViewModel
```kotlin
@Composable
fun DetailScreen(viewModel: DetailViewModel) {
    Column {
        Text(viewModel.student?.name ?: viewModel.errorMessage ?: "Memuat...")
        Text("Angkatan: ${viewModel.student?.year ?: \"-\"}")
    }
}
```

### Spoiler Materi Berikutnya & Rangkuman (Stop 5 — State 25)
- Di State 25, **seluruh 4 layer ditampilkan dalam kondisi sudah terupdate penuh** (tidak hanya Data Source, melainkan Repository, ViewModel, dan UI juga terupdate dan tetap mengambil referensi dari Data Source). Keempat kartu terupdate ini tetap tampil jelas sebagai bukti visual nyata.
- Modal kartu penutup kontras di tengah:
  - **Spageti (Scene 1)**: 4 perubahan mengacak-acak 1 fungsi yang sama.
  - **Berlapis (Scene 6)**: Tiap perubahan terisolasi di lapisannya masing-masing.
  - **Materi Modul 07+**: Ganti ke Room Database atau Retrofit Service hanya menyentuh Data Source.



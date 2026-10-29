# 03 — Aset Data dan Kode (Modul 07)

Semua konstanta di bawah disimpan di `src/assets/code.ts`. Data JSON diambil dari endpoint asli `https://dummyjson.com/users?limit=10` (diverifikasi: `total` 208, `skip` 0, `limit` 10; user id 1 = Emily Johnson). Deck TIDAK memanggil endpoint itu saat berjalan.

## Kebersihan konten
JSON asli DummyJSON memuat field sensitif palsu (`password`, `ssn`, `ein`, `bank.cardNumber`, `bank.iban`, `crypto.wallet`, `macAddress`, `ip`). **Jangan ditampilkan** di slide mana pun. Excerpt di bawah sudah memakai `…` sebagai pengganti.

## Bentuk TypeScript
```ts
export type Layer = 'ui' | 'vm' | 'repo' | 'rds' | 'api';   // rds = Remote Data Source
export type DiffLine = { kind: ' ' | '+' | '-'; text: string };   // karakter pertama blok diff = kind
export const JSON_FULL: string;       // Scene 2 Stop 2
export const JSON_SHORT: { text: string; used: number[]; wrapper: number[] };  // Scene 4 (nomor baris mulai 1)
export const RESPONSE_OBJECT: string; // Scene 2 Stop 3
export const MAPPER_CODE: string;     // Scene 4 Stop 3
export const EXECUTE_CODE: string;    // Scene 5 Stop 1
export const ASYNC_CODE: string;      // Scene 5 Stop 2
export const ENQUEUE_CODE: string;    // Scene 5 Stop 3-4
export const VM_CODE: string;         // Scene 5 Stop 5
export const WHEN_CODE: string;       // Scene 6
export const STATE_STEPS: { students: string; isLoading: string; errorMessage: string; branch: 1|2|3|0 }[];
export const PHONE_ROWS: string[];    // Scene 6 Stop 4
export const ERRORS: { symptom: string; door: 'onFailure'|'onResponse'; gateFail?: boolean; focus?: 'rds'; fix: string }[];
export const DIFFS: { layer: Layer; banner: string; lines: DiffLine[] }[];
```

## JSON mentah (Scene 2 Stop 2, 16 baris, `JSON_FULL`)
Ringkas: urutan field asli berbeda dan banyak field dihilangkan (diganti `…`).
```json
{
  "users": [
    {
      "id": 1,
      "firstName": "Emily",
      "lastName": "Johnson",
      "age": 29,
      "email": "emily.johnson@x.dummyjson.com",
      …
      "university": "University of Wisconsin--Madison",
      …
    },
    …
  ],
  "total": 208, "skip": 0, "limit": 10
}
```

## JSON ringkas untuk pemetaan (Scene 4, 14 baris, `JSON_SHORT`)
Email dan university dipotong dengan `…` agar muat kolom 580px pada 24px.
```json
{
  "users": [{
    "id": 1,
    "firstName": "Emily",
    "lastName": "Johnson",
    "age": 29,
    "email": "emily.johnson@x.dummy…",
    "phone": "+81 965-431-3024",
    "university": "University of W…",
    "address": { … },
    …
  }, …],
  "total": 208, "skip": 0, "limit": 10
}
```
- `used` (menyala di Stop 2): baris 3, 4, 5, 7, 9 (`id`, `firstName`, `lastName`, `email`, `university`).
- Redup berlabel "tidak dipakai": baris 6, 8, 10 (`age`, `phone`, `address`).
- `wrapper` (menyala di Stop 1): baris 2 (`users`) dan baris 13 (`total`, `skip`, `limit`).

## Objek hasil Gson (Scene 2 Stop 3, `RESPONSE_OBJECT`)
Tampilan ringkas (bukan kode yang dikompilasi):
```
UserResponse(
  users = [
    UserDto(id = 1, firstName = "Emily", lastName = "Johnson",
            email = "emily.johnson@x.dummyjson.com",
            university = "University of Wisconsin--Madison"),
    …
  ],
  total = 208, skip = 0, limit = 10
)
```

## Kotak kelas (Scene 4, mono 26px, `data/remote/dto` dan `data/model`)
```
UserResponse(            UserDto(                Student(
  users: List<UserDto>,    id: Int,                id: Int,
  total: Int,              firstName: String,      name: String,
  skip: Int,               lastName: String,       email: String,
  limit: Int               email: String,          university: String
)                          university: String    )
                         )
```
Tiga kotak ditampilkan terpisah di kolomnya masing-masing (`UserResponse` dan `UserDto` di kolom tengah, `Student` di kolom kanan).

## Mapper (Scene 4 Stop 3, `MAPPER_CODE`, 6 baris)
```kotlin
fun UserDto.toStudent() = Student(
    id = id,
    name = "$firstName $lastName",
    email = email,
    university = university
)
```

## Kode Scene 5 (panel bawah, mono 26px / 1.3)
Parameter `onResponse`/`onFailure` disingkat (`call, response`) agar muat; tipenya ada di modul.

`EXECUTE_CODE` (Stop 1, label SALAH):
```kotlin
// SALAH: menunggu balasan di jalur utama
val response = api.getUsers().execute()
uiState = HomeUiState(students = response.body()!!.users)
```

`ASYNC_CODE` (Stop 2):
```kotlin
uiState = uiState.copy(isLoading = true, errorMessage = null)
repository.getStudents { result ->   // dipanggil NANTI, saat hasil siap
    …
}
```

`ENQUEUE_CODE` (Stop 3–4, 13 baris). Baris kunci: Stop 3 = [2, 10]; Stop 4 = [4, 5, 7]:
```kotlin
api.getUsers().enqueue(object : Callback<UserResponse> {
    override fun onResponse(call, response) {
        val body = response.body()
        if (response.isSuccessful && body != null) {
            callback(Result.success(body.users))
        } else {
            callback(Result.failure(Exception("HTTP ${response.code()}")))
        }
    }
    override fun onFailure(call, t) {
        callback(Result.failure(t))
    }
})
```

`VM_CODE` (Stop 5, 7 baris, baris kunci [3, 5]):
```kotlin
repository.getStudents { result ->
    result
        .onSuccess { data -> uiState = HomeUiState(students = data) }
        .onFailure { error ->
            uiState = HomeUiState(errorMessage = error.message ?: "Gagal mengambil data")
        }
}
```

## Scene 6
`WHEN_CODE` (12 baris). Cabang 1 = baris 2–4, cabang 2 = baris 5–8, cabang 3 = baris 9–11:
```kotlin
when {
    uiState.isLoading -> {
        CircularProgressIndicator()
    }
    uiState.errorMessage != null -> {
        Text(uiState.errorMessage)
        Button(onClick = onRetry) { Text("Coba Lagi") }
    }
    else -> {
        LazyColumn { items(uiState.students) { … } }
    }
}
```

`STATE_STEPS` (panel state, mono 28px; `branch` = cabang yang disorot):
| Stop | students | isLoading | errorMessage | branch |
|---|---|---|---|---|
| 0 | `[]` | `false` | `null` | 0 |
| 1 | `[]` | `true` | `null` | 1 |
| 2 | `[]` | `false` | `"Unable to resolve host…"` | 2 |
| 3 | `[]` | `true` | `null` | 1 |
| 4 | `[10 item]` | `false` | `null` | 3 |

`PHONE_ROWS` (Stop 4, tampil format `"${id} - ${name}"`): `1 - Emily Johnson`, `2 - Michael Williams`, `3 - Sophia Brown`, `4 - James Davis`, `5 - Emma Miller`, `6 - Olivia Wilson`, `7 - Alexander Jones`, `8 - Ava Taylor` (dua baris terakhir terpotong layar).

Mockup ponsel: bar atas bertuliskan "Home"; layar error menampilkan teks `Unable to resolve host…` (warna `--err`) dan tombol "Coba Lagi".

## Scene 7 (`ERRORS`)
| symptom | door | detail | fix |
|---|---|---|---|
| `UnknownHostException` | onFailure | jaringan atau izin | Cek koneksi internet dan permission INTERNET |
| `HTTP 404` | onResponse | gerbang `isSuccessful = false` | Cek base URL, path @GET, @Path, dan ID |
| `Expected BEGIN_OBJECT…` | onFailure | sorot kotak Remote DS (Gson/DTO) | Samakan DTO dengan struktur JSON |
| `Cleartext HTTP traffic not permitted` | onFailure | gunakan HTTPS | Gunakan endpoint HTTPS |

Catatan akurasi: kegagalan konversi Gson dan kesalahan koneksi diteruskan Retrofit ke `onFailure`; kode status non-2xx tetap masuk `onResponse`. Verifikasi di Logcat bila ragu.

## Scene 3 (caption di dalam kotak, mono 26px)
| Kotak | Stop 1 (event) | Stop 2 (wujud data) |
|---|---|---|
| UI | klik / buka layar | dirender |
| ViewModel | `loadStudents()` | `HomeUiState` |
| Repository | `getStudents(callback)` | `Result<List<Student>>` |
| Remote Data Source | `api.getUsers().enqueue(…)` | `Result<List<UserDto>>` |
| REST API | `GET /users?limit=10` | JSON (teks) |

Sub-label tetap: Remote Data Source = `StudentApiService · RetrofitClient`; REST API = "DummyJSON (di luar aplikasi)".

## Scene 8
`DIFFS` (setiap `lines` maksimum 14 baris; karakter pertama = kind; baris kosong konteks = satu spasi).

Banner dan lapisan: [0] rds "Data Source → Remote Data Source" · [1] repo "Repository: kontrak jadi asinkron + memetakan DTO" · [2] vm "ViewModel: ikut asinkron, mengelola loading dan error" · [3] ui "UI: tidak mengenal Retrofit, hanya render state".

`DIFFS[0]`
```diff
-class StudentLocalDataSource {
-    private val students = listOf(…)
-    fun getStudentById(id: Int): Student? =
-        students.find { it.id == id }
+class StudentRemoteDataSource(
+    private val api: StudentApiService
+) {
+    fun getStudents(callback: (Result<List<UserDto>>) -> Unit) {
+        api.getUsers().enqueue(/* onResponse, onFailure */)
+    }
 }
```
`DIFFS[1]`
```diff
 interface StudentRepository {
-    fun getStudentById(id: Int): Student?
+    fun getStudents(callback: (Result<List<Student>>) -> Unit)
+    fun getStudent(id: Int, callback: (Result<Student>) -> Unit)
 }
 // DefaultStudentRepository: memanggil Remote DS lalu it.toStudent()
```
`DIFFS[2]`
```diff
 fun loadStudent(id: Int) {
-    val student = repository.getStudentById(id)
-    uiState = if (student != null) DetailUiState(student = student)
-    else DetailUiState(errorMessage = "Student tidak ditemukan")
+    uiState = uiState.copy(isLoading = true, errorMessage = null)
+    repository.getStudent(id) { result ->
+        result
+            .onSuccess { student -> uiState = DetailUiState(student = student) }
+            .onFailure { error ->
+                uiState = DetailUiState(errorMessage = error.message ?: "Data tidak tersedia")
+            }
+    }
 }
```
`DIFFS[3]`
```diff
 uiState.student != null -> {
     Text("Nama: ${uiState.student.name}")
-    Text("Program: ${uiState.student.program}")
-    Text("Angkatan: ${uiState.student.year}")
+    Text("Email: ${uiState.student.email}")
+    Text("University: ${uiState.student.university}")
 }
 // tidak ada import retrofit2 / StudentApiService
```

Panel ringkasan Stop 5 (dua kolom, 42px):
- **Berubah:** Data Source → Remote (Retrofit) · Repository → callback + mapper · ViewModel → loading dan error · Student → email dan university · UI → render 3 kondisi
- **Tetap:** Arah dependency UI → ViewModel → Repository · UI tidak mengenal Retrofit · Navigasi Home → Detail → Back · Profile dan About
- Baris bawah: **"Berikutnya: callback → Kotlin Coroutines & Flow"** (label saja).

## Wujud data (benang merah)
`JSON (teks)` → `UserDto` → `Student` → `HomeUiState` → piksel di layar. Dipakai di Scene 3 Stop 2 sebagai caption, dan diulang di Scene 8 bila diperlukan.

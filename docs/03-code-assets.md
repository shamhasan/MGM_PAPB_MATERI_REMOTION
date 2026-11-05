# 03 — Aset Data dan Kode (Modul 08: Kotlin Coroutines & Flow)

Semua konstanta di bawah disimpan di `src/assets/code.ts`. Seluruh aset kode disinkronkan persis dengan Modul Praktikum 08 (CIF62041, FILKOM UB 2026). Deck berjalan 100% offline tanpa dependensi atau pemanggilan jaringan langsung ke DummyJSON.

---

## 1. Kebersihan Konten

Seluruh cuplikan kode dan data DummyJSON tidak memuat _field_ sensitif palsu (`password`, `ssn`, `ein`, `cardNumber`, `iban`, `wallet`, `macAddress`, `ip`). Semua pemodelan entitas konsisten menggunakan `Student(id, name, email, university)`.

---

## 2. Definisi Tipe TypeScript (`src/assets/code.ts`)

```ts
export type Layer = "ui" | "vm" | "repo" | "rds" | "api";
export type DiffLine = { kind: " " | "+" | "-"; text: string };

// Cuplikan Kode Utama
export const COMPARE_CALLBACK: string; // Scene 1 / Scene 2 (Gambar 1 Modul 08)
export const COMPARE_COROUTINE: string; // Scene 2 (Gambar 1 Modul 08)
export const SERVICE_CODE: string; // Scene 2 (StudentApiService suspend fun)
export const REMOTE_DS_CODE: string; // Scene 2 (StudentRemoteDataSource)
export const REPO_CODE: string; // Scene 2 (DefaultStudentRepository)
export const MAPPER_CODE: string; // Scene 2 (UserDto.toStudent)
export const VM_LAUNCH_CODE: string; // Scene 3 (viewModelScope + CancellationException)
export const STATEFLOW_CODE: string; // Scene 4 (MutableStateFlow & StateFlow)
export const COMPOSE_COLLECT_CODE: string; // Scene 4 (collectAsStateWithLifecycle)
export const OBSERVE_SEARCH_CODE: string; // Scene 5 (Flow Pipeline: debounce, distinct, collectLatest)
export const RETRY_CODE: string; // Scene 5 (retry dengan searchQuery aktif)

// Struktur Data Diagram Pipa Reaktif (Gambar 3 Modul 08)
export interface FlowStep {
  id: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  label: string;
  sublabel: string;
  color?: string;
}
export const SEARCH_FLOW_STEPS: FlowStep[];

// Diff Panel per Lapisan (Scene 6)
export const DIFFS: { layer: Layer; banner: string; lines: DiffLine[] }[];

// Rangkuman Berubah vs Tetap (Scene 6)
export const SUMMARY_ITEMS: { changed: string[]; unchanged: string[] };
```

---

## 3. Komparasi Callback vs Coroutine (Gambar 1 Modul 08)

### `COMPARE_CALLBACK` (Modul 07, Callback Bersarang)

```kotlin
repository.getStudents { result ->
    result.onSuccess { data ->
        updateUi(data)
    }.onFailure { error ->
        showError(error)
    }
}

```

### `COMPARE_COROUTINE` (Modul 08, Sekuensial Linear Non-Blocking)

```kotlin
viewModelScope.launch {
    val data = repository.getStudents()
    updateUi(data)
}

```

---

## 4. Kontrak Retrofit & Data Layer (Operasi One-Shot)

### `SERVICE_CODE` (`data/remote/StudentApiService.kt`)

Retrofit secara langsung mendukung fungsi `suspend`; `Call<T>` dan `enqueue` dihapus total.

```kotlin
interface StudentApiService {
    @GET("users")
    suspend fun getUsers(
        @Query("limit") limit: Int = 10
    ): UserResponse

    @GET("users/{id}")
    suspend fun getUser(
        @Path("id") id: Int
    ): UserDto

    @GET("users/search")
    suspend fun searchUsers(
        @Query("q") query: String
    ): UserResponse
}

```

### `REMOTE_DS_CODE` (`data/remote/StudentRemoteDataSource.kt`)

Tidak memerlukan pembungkus `withContext(Dispatchers.IO)` karena Retrofit mengeksekusi request secara asinkron di balik layar.

```kotlin
class StudentRemoteDataSource(
    private val api: StudentApiService
) {
    suspend fun getStudents(): List<UserDto> =
        api.getUsers(limit = 10).users

    suspend fun getStudent(id: Int): UserDto =
        api.getUser(id)

    suspend fun searchStudents(query: String): List<UserDto> =
        api.searchUsers(query).users
}

```

### `REPO_CODE` (`data/repository/DefaultStudentRepository.kt`)

Repository bertugas mengeksekusi fungsi `suspend` sekaligus memetakan DTO ke entitas domain `Student`.

```kotlin
class DefaultStudentRepository(
    private val remoteDataSource: StudentRemoteDataSource
) : StudentRepository {
    override suspend fun getStudents(): List<Student> =
        remoteDataSource.getStudents().map { it.toStudent() }

    override suspend fun getStudent(id: Int): Student =
        remoteDataSource.getStudent(id).toStudent()

    override suspend fun searchStudents(query: String): List<Student> =
        remoteDataSource.searchStudents(query).map { it.toStudent() }
}

```

### `MAPPER_CODE` (`data/mapper/StudentMapper.kt`)

```kotlin
fun UserDto.toStudent() = Student(
    id = id,
    name = "$firstName $lastName",
    email = email,
    university = university
)

```

---

## 5. Presentation Layer & Structured Concurrency

### `VM_LAUNCH_CODE` (`ui/home/HomeViewModel.kt` — Muat Awal & Error Handling)

Penanganan error kembali menggunakan blok idiomatis Kotlin `try-catch`, dengan kewajiban melempar ulang `CancellationException`.

```kotlin
fun loadStudents() {
    viewModelScope.launch {
        _uiState.value = HomeUiState(isLoading = true)
        try {
            val students = repository.getStudents()
            _uiState.value = HomeUiState(students = students)
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            _uiState.value = HomeUiState(
                errorMessage = e.message ?: "Gagal mengambil data"
            )
        }
    }
}

```

### `STATEFLOW_CODE` (`ui/home/HomeViewModel.kt` — State Holder)

Pemisahan hak akses: `MutableStateFlow` disimpan privat di ViewModel, diekspos sebagai `StateFlow` _read-only_ ke UI.

```kotlin
class HomeViewModel(
    private val repository: StudentRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    fun onSearchQueryChange(query: String) {
        _searchQuery.value = query
    }
}

```

### `OBSERVE_SEARCH_CODE` (`ui/home/HomeViewModel.kt` — Pipa Pencarian Reaktif)

Pipeline operator Flow: `debounce(500)` menahan request beruntun, `distinctUntilChanged()` menyaring query identik, dan `collectLatest` membatalkan request lama yang masih berjalan saat query baru tiba.

```kotlin
@OptIn(FlowPreview::class)
private fun observeSearch() {
    viewModelScope.launch {
        searchQuery
            .debounce(500)
            .distinctUntilChanged()
            .collectLatest { query ->
                _uiState.value = _uiState.value.copy(
                    isLoading = true,
                    errorMessage = null
                )
                try {
                    val data = if (query.isBlank()) {
                        repository.getStudents()
                    } else {
                        repository.searchStudents(query)
                    }
                    _uiState.value = HomeUiState(students = data)
                } catch (e: CancellationException) {
                    throw e
                } catch (e: Exception) {
                    _uiState.value = HomeUiState(
                        errorMessage = e.message ?: "Pencarian gagal"
                    )
                }
            }
    }
}

```

### `RETRY_CODE` (`ui/home/HomeViewModel.kt` — Retry Reaktif)

```kotlin
fun retry() {
    val query = searchQuery.value
    viewModelScope.launch {
        _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
        try {
            val data = if (query.isBlank()) {
                repository.getStudents()
            } else {
                repository.searchStudents(query)
            }
            _uiState.value = HomeUiState(students = data)
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            _uiState.value = HomeUiState(errorMessage = e.message ?: "Request gagal")
        }
    }
}

```

---

## 6. UI Layer (`Jetpack Compose`)

### `COMPOSE_COLLECT_CODE` (`ui/home/HomeScreen.kt` Destination Host)

State dikoleksi secara _lifecycle-aware_ menggunakan `collectAsStateWithLifecycle()`, berhenti mengonsumsi sumber daya saat aplikasi berada di latar belakang.

```kotlin
val homeUiState by homeViewModel.uiState.collectAsStateWithLifecycle()
val searchQuery by homeViewModel.searchQuery.collectAsStateWithLifecycle()

HomeScreen(
    uiState = homeUiState,
    searchQuery = searchQuery,
    onSearchQueryChange = homeViewModel::onSearchQueryChange,
    onStudentClick = { id -> navController.navigate(Routes.detail(id)) },
    onRetry = homeViewModel::retry
)

```

---

## 7. Diagram Aliran Pipa Pencarian Reaktif (Gambar 3 Modul 08)

`SEARCH_FLOW_STEPS` digunakan untuk merepresentasikan node operator Flow pada Scene 5:

```ts
export const SEARCH_FLOW_STEPS: FlowStep[] = [
  { id: "A", label: '"j"', sublabel: "Karakter ke-1" },
  { id: "B", label: '"jo"', sublabel: "Karakter ke-2" },
  { id: "C", label: '"john"', sublabel: "Karakter ke-4" },
  { id: "D", label: "debounce", sublabel: "Tahan 500 ms jeda ketik" },
  {
    id: "E",
    label: "collectLatest",
    sublabel: "Batalkan pekerjaan sebelumnya",
  },
  { id: "F", label: "searchStudents()", sublabel: "Panggil suspend service" },
  { id: "G", label: "HomeUiState", sublabel: "Perbarui UI Compose" },
];
```

Keterangan visual: _"Jika pengguna terus mengetik, collectLatest membatalkan pekerjaan sebelumnya dan hanya memproses query terbaru."_

---

## 8. Diff Refactoring per Lapisan (`DIFFS`)

### `DIFFS[0]` — Remote Data Source (`rds`)

```diff
 interface StudentApiService {
     @GET("users")
-    fun getUsers(@Query("limit") limit: Int): Call<UserResponse>
+    suspend fun getUsers(@Query("limit") limit: Int = 10): UserResponse
 }
-class StudentRemoteDataSource(private val api: StudentApiService) {
-    fun getStudents(callback: (Result<List<UserDto>>) -> Unit) {
-        api.getUsers(10).enqueue(object : Callback<UserResponse> { ... })
-    }
-}
+class StudentRemoteDataSource(private val api: StudentApiService) {
+    suspend fun getStudents(): List<UserDto> =
+        api.getUsers(limit = 10).users
+}

```

### `DIFFS[1]` — Repository (`repo`)

```diff
 interface StudentRepository {
-    fun getStudents(callback: (Result<List<Student>>) -> Unit)
+    suspend fun getStudents(): List<Student>
 }
 class DefaultStudentRepository(...) : StudentRepository {
-    override fun getStudents(callback: (Result<List<Student>>) -> Unit) {
-        remoteDataSource.getStudents { result -> ... }
-    }
+    override suspend fun getStudents(): List<Student> =
+        remoteDataSource.getStudents().map { it.toStudent() }
 }

```

### `DIFFS[2]` — ViewModel (`vm`)

```diff
-private var _uiState = mutableStateOf(HomeUiState())
-val uiState: State<HomeUiState> = _uiState
+private val _uiState = MutableStateFlow(HomeUiState())
+val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

 fun loadStudents() {
-    repository.getStudents { result ->
-        result.onSuccess { ... }.onFailure { ... }
-    }
+    viewModelScope.launch {
+        try {
+            _uiState.value = HomeUiState(students = repository.getStudents())
+        } catch (e: CancellationException) {
+            throw e
+        } catch (e: Exception) {
+            _uiState.value = HomeUiState(errorMessage = e.message)
+        }
+    }
 }

```

### `DIFFS[3]` — Composable UI (`ui`)

```diff
-val uiState = homeViewModel.uiState.value
+val uiState by homeViewModel.uiState.collectAsStateWithLifecycle()
+val searchQuery by homeViewModel.searchQuery.collectAsStateWithLifecycle()

 OutlinedTextField(
     value = searchQuery,
-    onValueChange = { ... }
+    onValueChange = homeViewModel::onSearchQueryChange,
 )
-// Tombol manual "Cari" dihapus; pencarian berjalan reaktif via Flow

```

---

## 9. Rangkuman Berubah vs Tetap (`SUMMARY_ITEMS`)

- **Berubah (Modul 08)**:
- Retrofit Service: `Call<T>` dan `enqueue` $\rightarrow$ `suspend fun`.

- Remote Data Source & Repository: Pemanggilan berbasis callback $\rightarrow$ Fungsi murni `suspend`.

- Kontrol Asinkron ViewModel: Lambda callback bersarang $\rightarrow$ `viewModelScope.launch` dengan gaya sekuensial linear.

- Penanganan Error: Pembungkus `Result<T>` $\rightarrow$ Blok alami `try-catch` + re-throw `CancellationException`.

- State Holder: `mutableStateOf` $\rightarrow$ `MutableStateFlow` (private) & `StateFlow` (public).

- Konsumsi Antarmuka: Pembacaan state biasa $\rightarrow$ `collectAsStateWithLifecycle()` di Compose.

- Fitur Pencarian: Tombol cari manual $\rightarrow$ Aliran reaktif otomatis (`debounce`, `distinctUntilChanged`, `collectLatest`).

- **Tetap (Konsisten dari Modul 06 & 07)**:
- Lapisan Arsitektur: `UI → ViewModel → Repository → Remote Data Source → REST API`.

- Pemisahan Peran: UI tetap tidak mengimpor Retrofit atau menjalankan _business logic_.

- Kontrak Model Domain: `Student(id, name, email, university)` dan DTO `UserDto`/`UserResponse`.

- Navigasi & Back Stack: Alur `Home → Detail → Back` tetap utuh.

- Jembatan ke Depan: **"Berikutnya: Penyimpanan Lokal dengan Room Database & DataStore"** (Modul 09).

---

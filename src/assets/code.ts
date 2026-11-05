// ============================================================================
// DEFINISI TIPE TYPESCRIPT (docs/03-code-assets.md)
// ============================================================================

export type Layer = "ui" | "vm" | "repo" | "rds" | "api"; // rds = Remote Data Source

export type DiffLine = { kind: " " | "+" | "-"; text: string };

export interface FlowStep {
  id: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  label: string;
  sublabel: string;
  color?: string;
}

// Helper parser baris diff
function parseDiff(raw: string): DiffLine[] {
  return raw
    .trim()
    .split("\n")
    .map((line) => {
      const first = line[0];
      const isDiff = first === "+" || first === "-";
      const kind = isDiff ? first : " ";
      const text = isDiff ? line.slice(1) : line;
      return { kind, text };
    });
}

// ============================================================================
// MODUL 08: CUPLIKAN KODE KOTLIN UTAMA
// ============================================================================

// Scene 1 / Scene 2: Gambar 1 Modul 08 (Komparasi Callback)
export const COMPARE_CALLBACK = `repository.getStudents { result ->
    result.onSuccess { data ->
        updateUi(data)
    }.onFailure { error ->
        showError(error)
    }
}`;

// Scene 2: Gambar 1 Modul 08 (Sekuensial Linear Coroutine)
export const COMPARE_COROUTINE = `viewModelScope.launch {
    val data = repository.getStudents()
    updateUi(data)
}`;

// Scene 2: Retrofit Suspend Service (StudentApiService.kt)
export const SERVICE_CODE = `interface StudentApiService {
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
}`;

// Scene 2: Remote Data Source Main-Safe (StudentRemoteDataSource.kt)
export const REMOTE_DS_CODE = `class StudentRemoteDataSource(
    private val api: StudentApiService
) {
    suspend fun getStudents(): List<UserDto> =
        api.getUsers(limit = 10).users

    suspend fun getStudent(id: Int): UserDto =
        api.getUser(id)

    suspend fun searchStudents(query: String): List<UserDto> =
        api.searchUsers(query).users
}`;

// Scene 2: Repository (DefaultStudentRepository.kt)
export const REPO_CODE = `class DefaultStudentRepository(
    private val remoteDataSource: StudentRemoteDataSource
) : StudentRepository {
    override suspend fun getStudents(): List<Student> =
        remoteDataSource.getStudents().map { it.toStudent() }

    override suspend fun getStudent(id: Int): Student =
        remoteDataSource.getStudent(id).toStudent()

    override suspend fun searchStudents(query: String): List<Student> =
        remoteDataSource.searchStudents(query).map { it.toStudent() }
}`;

// Scene 2: Mapper Entitas (StudentMapper.kt)
export const MAPPER_CODE = `fun UserDto.toStudent() = Student(
    id = id,
    name = "$firstName $lastName",
    email = email,
    university = university
)`;

// Scene 3: ViewModel Launch & CancellationException (HomeViewModel.kt)
export const VM_LAUNCH_CODE = `fun loadStudents() {
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
}`;

// Scene 4: State Holder StateFlow (HomeViewModel.kt)
export const STATEFLOW_CODE = `class HomeViewModel(
    private val repository: StudentRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    fun onSearchQueryChange(query: String) {
        _searchQuery.value = query
    }
}`;

// Scene 4: Koleksi Sadar Siklus Hidup (HomeScreen.kt)
export const COMPOSE_COLLECT_CODE = `val homeUiState by homeViewModel.uiState.collectAsStateWithLifecycle()
val searchQuery by homeViewModel.searchQuery.collectAsStateWithLifecycle()

HomeScreen(
    uiState = homeUiState,
    searchQuery = searchQuery,
    onSearchQueryChange = homeViewModel::onSearchQueryChange,
    onStudentClick = { id -> navController.navigate(Routes.detail(id)) },
    onRetry = homeViewModel::retry
)`;

// Scene 5: Pipa Pencarian Reaktif Flow (HomeViewModel.kt)
export const OBSERVE_SEARCH_CODE = `@OptIn(FlowPreview::class)
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
}`;

// Scene 5: Retry Reaktif (HomeViewModel.kt)
export const RETRY_CODE = `fun retry() {
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
}`;

// ============================================================================
// SCENE 5: DIAGRAM ALIRAN PIPA PENCARIAN REAKTIF (Gambar 3 Modul 08)
// ============================================================================

export const SEARCH_FLOW_STEPS: FlowStep[] = [
  { id: "A", label: '"j"', sublabel: "Karakter ke-1", color: "var(--c-ui, #3B82F6)" },
  { id: "B", label: '"jo"', sublabel: "Karakter ke-2", color: "var(--c-ui, #3B82F6)" },
  { id: "C", label: '"john"', sublabel: "Karakter ke-4", color: "var(--c-ui, #3B82F6)" },
  { id: "D", label: "debounce", sublabel: "Tahan 500 ms jeda ketik", color: "var(--c-vm, #F97316)" },
  {
    id: "E",
    label: "collectLatest",
    sublabel: "Batalkan pekerjaan sebelumnya",
    color: "var(--c-coroutine, #8B5CF6)",
  },
  { id: "F", label: "searchStudents()", sublabel: "Panggil suspend service", color: "var(--c-repo, #22C55E)" },
  { id: "G", label: "HomeUiState", sublabel: "Perbarui UI Compose", color: "var(--c-ds, #1E293B)" },
];

// ============================================================================
// SCENE 6: DIFF REFACTORING PER LAPISAN (Modul 08)
// ============================================================================

export const DIFFS: { layer: Layer; banner: string; lines: DiffLine[] }[] = [
  {
    layer: "rds",
    banner: "Remote Data Source: suspend fun menggantikan Call & enqueue",
    lines: parseDiff(` interface StudentApiService {
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
+}`),
  },
  {
    layer: "repo",
    banner: "Repository: suspend fun + pemetaan otomatis UserDto.toStudent()",
    lines: parseDiff(` interface StudentRepository {
-    fun getStudents(callback: (Result<List<Student>>) -> Unit)
+    suspend fun getStudents(): List<Student>
 }
 class DefaultStudentRepository(...) : StudentRepository {
-    override fun getStudents(callback: (Result<List<Student>>) -> Unit) {
-        remoteDataSource.getStudents { result -> ... }
-    }
+    override suspend fun getStudents(): List<Student> =
+        remoteDataSource.getStudents().map { it.toStudent() }
 }`),
  },
  {
    layer: "vm",
    banner: "ViewModel: StateFlow, viewModelScope.launch & throw CancellationException",
    lines: parseDiff(`-private var _uiState = mutableStateOf(HomeUiState())
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
 }`),
  },
  {
    layer: "ui",
    banner: "Composable UI: collectAsStateWithLifecycle() & Pencarian Reaktif",
    lines: parseDiff(`-val uiState = homeViewModel.uiState.value
+val uiState by homeViewModel.uiState.collectAsStateWithLifecycle()
+val searchQuery by homeViewModel.searchQuery.collectAsStateWithLifecycle()

 OutlinedTextField(
     value = searchQuery,
-    onValueChange = { ... }
+    onValueChange = homeViewModel::onSearchQueryChange,
 )
-// Tombol manual "Cari" dihapus; pencarian berjalan reaktif via Flow`),
  },
];

// ============================================================================
// SCENE 6: RANGKUMAN BERUBAH VS TETAP (Modul 08)
// ============================================================================

export const SUMMARY_ITEMS = {
  changed: [
    "Retrofit Service: Call<T> dan enqueue -> suspend fun",
    "Remote Data Source & Repository: Pemanggilan callback -> Fungsi murni suspend",
    "Kontrol Asinkron ViewModel: Lambda callback bersarang -> viewModelScope.launch sekuensial linear",
    "Penanganan Error: Pembungkus Result<T> -> Blok alami try-catch + re-throw CancellationException",
    "State Holder: mutableStateOf -> MutableStateFlow (private) & StateFlow (public)",
    "Konsumsi Antarmuka: Pembacaan state biasa -> collectAsStateWithLifecycle() di Compose",
    "Fitur Pencarian: Tombol cari manual -> Aliran reaktif otomatis (debounce, distinctUntilChanged, collectLatest)",
  ],
  unchanged: [
    "Lapisan Arsitektur: UI -> ViewModel -> Repository -> Remote Data Source -> REST API",
    "Pemisahan Peran: UI tidak mengimpor Retrofit atau menjalankan business logic",
    "Kontrak Model Domain: Student(id, name, email, university) dan DTO UserDto/UserResponse",
    "Navigasi & Back Stack: Alur Home -> Detail -> Back tetap utuh",
    "Jembatan ke Depan: Penyimpanan Lokal dengan Room Database & DataStore (Modul 09)",
  ],
};

// ============================================================================
// ASET LEGACY MODUL 07 (Dipertahankan hingga Milestone M9 untuk Scene Lama)
// ============================================================================

export const JSON_FULL = `{
  "users": [
    {
      "id": 1,
      "firstName": "Emily",
      "lastName": "Johnson",
      "age": 29,
      "email": "emily.johnson@x.dummyjson.com",
      "university": "University of Wisconsin--Madison"
    }
  ],
  "total": 208, "skip": 0, "limit": 10
}`;

export const JSON_SHORT = {
  text: `{
  "users": [{
    "id": 1,
    "firstName": "Emily",
    "lastName": "Johnson",
    "age": 29,
    "email": "emily.johnson@x.dummyjson.com",
    "university": "University of Wisconsin--Madison"
  }],
  "total": 208, "skip": 0, "limit": 10
}`,
  used: [3, 4, 5, 7, 9],
  wrapper: [2, 13],
  unused: [6, 8, 10],
};

export const RESPONSE_OBJECT = `UserResponse(
  users = [
    UserDto(id = 1, firstName = "Emily", lastName = "Johnson",
            email = "emily.johnson@x.dummyjson.com",
            university = "University of Wisconsin--Madison")
  ],
  total = 208, skip = 0, limit = 10
)`;

export const EXECUTE_CODE = `// SALAH: menunggu balasan di jalur utama
val response = api.getUsers().execute()
uiState = HomeUiState(students = response.body()!!.users)`;

export const ASYNC_CODE = `uiState = uiState.copy(isLoading = true, errorMessage = null)
repository.getStudents { result ->
    ...
}`;

export const ENQUEUE_CODE = `api.getUsers().enqueue(object : Callback<UserResponse> {
    override fun onResponse(call, response) {
        val body = response.body()
        if (response.isSuccessful && body != null) {
            callback(Result.success(body.users))
        } else {
            callback(Result.failure(Exception("HTTP \${response.code()}")))
        }
    }
    override fun onFailure(call, t) {
        callback(Result.failure(t))
    }
})`;

export const VM_CODE = `repository.getStudents { result ->
    result
        .onSuccess { data -> uiState = HomeUiState(students = data) }
        .onFailure { error ->
            uiState = HomeUiState(errorMessage = error.message ?: "Gagal mengambil data")
        }
}`;

export const WHEN_CODE = `when {
    uiState.isLoading -> {
        CircularProgressIndicator()
    }
    uiState.errorMessage != null -> {
        Text(uiState.errorMessage)
        Button(onClick = onRetry) { Text("Coba Lagi") }
    }
    else -> {
        LazyColumn { items(uiState.students) { ... } }
    }
}`;

export const STATE_STEPS: {
  students: string;
  isLoading: string;
  errorMessage: string;
  branch: 0 | 1 | 2 | 3;
}[] = [
  { students: "[]", isLoading: "false", errorMessage: "null", branch: 0 },
  { students: "[]", isLoading: "true", errorMessage: "null", branch: 1 },
  {
    students: "[]",
    isLoading: "false",
    errorMessage: '"Unable to resolve host…"',
    branch: 2,
  },
  { students: "[]", isLoading: "true", errorMessage: "null", branch: 1 },
  {
    students: "[10 item]",
    isLoading: "false",
    errorMessage: "null",
    branch: 3,
  },
];

export const PHONE_ROWS: string[] = [
  "1 - Emily Johnson",
  "2 - Michael Williams",
  "3 - Sophia Brown",
  "4 - James Davis",
  "5 - Emma Miller",
  "6 - Olivia Wilson",
  "7 - Alexander Jones",
  "8 - Ava Taylor",
];

export const ERRORS: {
  symptom: string;
  door: "onFailure" | "onResponse";
  gateFail?: boolean;
  focus?: "rds";
  fix: string;
}[] = [
  {
    symptom: "UnknownHostException",
    door: "onFailure",
    fix: "Cek koneksi internet dan permission INTERNET",
  },
  {
    symptom: "HTTP 404",
    door: "onResponse",
    gateFail: true,
    fix: "Cek base URL, path @GET, @Path, dan ID",
  },
  {
    symptom: "Expected BEGIN_OBJECT…",
    door: "onFailure",
    focus: "rds",
    fix: "Samakan DTO dengan struktur JSON",
  },
  {
    symptom: "Cleartext HTTP traffic not permitted",
    door: "onFailure",
    fix: "Gunakan endpoint HTTPS",
  },
];

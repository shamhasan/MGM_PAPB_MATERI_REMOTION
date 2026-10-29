export type Layer = "ui" | "vm" | "repo" | "rds" | "api"; // rds = Remote Data Source

export type DiffLine = { kind: " " | "+" | "-"; text: string };

// ==========================================
// SCENE 2: JSON RAW DUMMYJSON (16 Baris)
// ==========================================
export const JSON_FULL = `{
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
}`;

// ==========================================
// SCENE 4: JSON RINGKAS PEMETAAN (14 Baris)
// ==========================================
export const JSON_SHORT = {
  text: `{
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
}`,
  // Nomor baris mulai dari 1:
  // baris 3 (id), 4 (firstName), 5 (lastName), 7 (email), 9 (university)
  used: [3, 4, 5, 7, 9],
  // baris 2 (users) dan 13 (total, skip, limit)
  wrapper: [2, 13],
  // baris 6 (age), 8 (phone), 10 (address) berlabel "tidak dipakai"
  unused: [6, 8, 10],
};

// ==========================================
// SCENE 2: OBJEK HASIL PARSING GSON
// ==========================================
export const RESPONSE_OBJECT = `UserResponse(
  users = [
    UserDto(id = 1, firstName = "Emily", lastName = "Johnson",
            email = "emily.johnson@x.dummyjson.com",
            university = "University of Wisconsin--Madison"),
    …
  ],
  total = 208, skip = 0, limit = 10
)`;

// ==========================================
// SCENE 4: MAPPER EXTENSION FUNCTION
// ==========================================
export const MAPPER_CODE = `fun UserDto.toStudent() = Student(
    id = id,
    name = "$firstName $lastName",
    email = email,
    university = university
)`;

// ==========================================
// SCENE 5: KODE ASINKRON & RETROFIT
// ==========================================
// Stop 1 (label SALAH: eksekusi sinkron di main thread)
export const EXECUTE_CODE = `// SALAH: menunggu balasan di jalur utama
val response = api.getUsers().execute()
uiState = HomeUiState(students = response.body()!!.users)`;

// Stop 2 (persiapan asinkron)
export const ASYNC_CODE = `uiState = uiState.copy(isLoading = true, errorMessage = null)
repository.getStudents { result ->   // dipanggil NANTI, saat hasil siap
    …
}`;

// Stop 3–4 (enqueue callback Retrofit: 13 baris)
// Baris kunci Stop 3: [2, 10]; Stop 4: [4, 5, 7]
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

// Stop 5 (konsumsi callback di ViewModel)
export const VM_CODE = `repository.getStudents { result ->
    result
        .onSuccess { data -> uiState = HomeUiState(students = data) }
        .onFailure { error ->
            uiState = HomeUiState(errorMessage = error.message ?: "Gagal mengambil data")
        }
}`;

// ==========================================
// SCENE 6: JETPACK COMPOSE TRI-STATE
// ==========================================
// 12 baris: cabang 1 = [2..4], cabang 2 = [5..8], cabang 3 = [9..11]
export const WHEN_CODE = `when {
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

// ==========================================
// SCENE 7: PETA KESALAHAN JARINGAN (ERRORS)
// ==========================================
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

// ==========================================
// SCENE 8: RINGKASAN PERUBAHAN (DIFFS)
// ==========================================
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

export const DIFFS: { layer: Layer; banner: string; lines: DiffLine[] }[] = [
  {
    layer: "rds",
    banner: "Data Source → Remote Data Source",
    lines: parseDiff(`-class StudentLocalDataSource {
-    private val students = listOf(…)
-    fun getStudentById(id: Int): Student? =
-        students.find { it.id == id }
+class StudentRemoteDataSource(
+    private val api: StudentApiService
+) {
+    fun getStudents(callback: (Result<List<UserDto>>) -> Unit) {
+        api.getUsers().enqueue(/* onResponse, onFailure */)
+    }
 }`),
  },
  {
    layer: "repo",
    banner: "Repository: kontrak jadi asinkron + memetakan DTO",
    lines: parseDiff(` interface StudentRepository {
-    fun getStudentById(id: Int): Student?
+    fun getStudents(callback: (Result<List<Student>>) -> Unit)
+    fun getStudent(id: Int, callback: (Result<Student>) -> Unit)
 }
 // DefaultStudentRepository: memanggil Remote DS lalu it.toStudent()`),
  },
  {
    layer: "vm",
    banner: "ViewModel: ikut asinkron, mengelola loading dan error",
    lines: parseDiff(` fun loadStudent(id: Int) {
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
 }`),
  },
  {
    layer: "ui",
    banner: "UI: tidak mengenal Retrofit, hanya render state",
    lines: parseDiff(` uiState.student != null -> {
     Text("Nama: \${uiState.student.name}")
-    Text("Program: \${uiState.student.program}")
-    Text("Angkatan: \${uiState.student.year}")
+    Text("Email: \${uiState.student.email}")
+    Text("University: \${uiState.student.university}")
 }
 // tidak ada import retrofit2 / StudentApiService`),
  },
];

// ==========================================
// WARISAN MODUL 06 (DIHAPUS PADA M9)
// ==========================================
export interface LayerInfo {
  id: Layer;
  label: string;
  description: string;
  className: string;
  colorVar: string;
  onColorVar: string;
}

export const LAYER_METADATA: Record<string, LayerInfo> = {
  ui: {
    id: "ui",
    label: "Composable UI",
    description: "Render Tri-State & Event Handler",
    className: "DetailScreen",
    colorVar: "var(--c-ui)",
    onColorVar: "var(--on-ui)",
  },
  vm: {
    id: "vm",
    label: "ViewModel",
    description: "Screen State Holder (Loading, Success, Error)",
    className: "DetailViewModel",
    colorVar: "var(--c-vm)",
    onColorVar: "var(--on-vm)",
  },
  viewmodel: {
    id: "vm",
    label: "ViewModel",
    description: "Screen State Holder (Loading, Success, Error)",
    className: "DetailViewModel",
    colorVar: "var(--c-vm)",
    onColorVar: "var(--on-vm)",
  },
  repo: {
    id: "repo",
    label: "Repository",
    description: "Pintu Akses Data Tunggal & Domain Mapper",
    className: "DefaultStudentRepository",
    colorVar: "var(--c-repo)",
    onColorVar: "var(--on-repo)",
  },
  repository: {
    id: "repo",
    label: "Repository",
    description: "Pintu Akses Data Tunggal & Domain Mapper",
    className: "DefaultStudentRepository",
    colorVar: "var(--c-repo)",
    onColorVar: "var(--on-repo)",
  },
  rds: {
    id: "rds",
    label: "Remote Data Source",
    description: "Retrofit Service, Gson Converter & DTO",
    className: "StudentRemoteDataSource",
    colorVar: "var(--c-ds)",
    onColorVar: "var(--on-ds)",
  },
  datasource: {
    id: "rds",
    label: "Remote Data Source",
    description: "Retrofit Service, Gson Converter & DTO",
    className: "StudentRemoteDataSource",
    colorVar: "var(--c-ds)",
    onColorVar: "var(--on-ds)",
  },
  api: {
    id: "api",
    label: "REST API",
    description: "DummyJSON (di luar aplikasi)",
    className: "DummyJSON",
    colorVar: "var(--c-api)",
    onColorVar: "var(--on-api)",
  },
};

export const RAW_CODE = `@Composable
fun DetailScreen(studentId: Int) {
    // @layer:datasource-start
    val api = Retrofit.Builder()
        .baseUrl("https://dummyjson.com/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(StudentApiService::class.java)
    // @layer:datasource-end

    // @layer:repository-start
    fun fetchStudent(id: Int, onResult: (Student?) -> Unit) {
        api.getUser(id).enqueue(object : Callback<UserDto> {
            override fun onResponse(c: Call<UserDto>, r: Response<UserDto>) {
                val u = r.body()
                onResult(u?.let { Student(it.id, "\${it.firstName}\${it.lastName}", it.email, it.university) })
            }
            override fun onFailure(c: Call<UserDto>, t: Throwable) { onResult(null) }
        })
    }
    // @layer:repository-end

    // @layer:viewmodel-start
    var student by remember { mutableStateOf<Student?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    LaunchedEffect(studentId) {
        isLoading = true
        fetchStudent(studentId) { student = it; isLoading = false }
    }
    // @layer:viewmodel-end

    // @layer:ui-start
    if (isLoading) CircularProgressIndicator()
    else Column {
        Text(student?.name ?: "Mahasiswa tidak ditemukan")
        Text("Email: \${student?.email ?: \"-\"}")
        Text("Univ: \${student?.university ?: \"-\"}")
    }
    // @layer:ui-end
}`;

export interface ParsedLayers {
  lines: string[];
  layerOf: (Layer | null)[];
}

export function parseLayers(raw: string): ParsedLayers {
  const rawLines = raw.split(/\r?\n/);
  const lines: string[] = [];
  const layerOf: (Layer | null)[] = [];
  let currentLayer: Layer | null = null;

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("// @layer:") && trimmed.endsWith("-start")) {
      const match = trimmed.match(/\/\/ @layer:(\w+)-start/);
      if (match) currentLayer = match[1] as Layer;
      continue;
    }
    if (trimmed.startsWith("// @layer:") && trimmed.endsWith("-end")) {
      currentLayer = null;
      continue;
    }
    lines.push(line);
    layerOf.push(currentLayer);
  }

  return { lines, layerOf };
}

export function dedentLines(lines: string[], minSpaces?: number): string[] {
  let minIndent = minSpaces ?? Infinity;
  if (minSpaces === undefined) {
    for (const line of lines) {
      if (line.trim().length === 0) continue;
      const match = line.match(/^(\s*)/);
      const indent = match ? match[1].length : 0;
      if (indent < minIndent) minIndent = indent;
    }
  }
  if (minIndent === Infinity || minIndent === 0) return lines;
  return lines.map((l) =>
    l.length >= minIndent ? l.slice(minIndent) : l.trim().length === 0 ? "" : l,
  );
}

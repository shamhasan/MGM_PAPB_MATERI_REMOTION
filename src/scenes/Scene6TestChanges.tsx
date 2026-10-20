import React from "react";
import { spring, interpolate, Easing } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { DiffCodeBlock, DiffLine } from "../components/DiffCodeBlock";
import { CheckCircle2, Zap, AlertTriangle, Layers } from "lucide-react";

type Layer = "ui" | "viewmodel" | "repository" | "datasource";

interface LayerMeta {
  id: Layer;
  label: string;
  className: string;
  colorVar: string;
  onColorVar: string;
  bgHex: string;
}

const LAYERS: LayerMeta[] = [
  {
    id: "ui",
    label: "Composable UI",
    className: "DetailScreen",
    colorVar: "var(--c-ui, #3B82F6)",
    onColorVar: "var(--on-ui, #FFFFFF)",
    bgHex: "#3B82F6",
  },
  {
    id: "viewmodel",
    label: "ViewModel",
    className: "DetailViewModel",
    colorVar: "var(--c-vm, #F97316)",
    onColorVar: "var(--on-vm, #431407)",
    bgHex: "#F97316",
  },
  {
    id: "repository",
    label: "Repository",
    className: "StudentRepository",
    colorVar: "var(--c-repo, #22C55E)",
    onColorVar: "var(--on-repo, #052E16)",
    bgHex: "#22C55E",
  },
  {
    id: "datasource",
    label: "Data Source",
    className: "StudentLocalDataSource",
    colorVar: "var(--c-ds, #1E3A8A)",
    onColorVar: "var(--on-ds, #FFFFFF)",
    bgHex: "#1E3A8A",
  },
];

// Cuplikan kode normal sebelum diubah
const NORMAL_CODE: Record<Layer, DiffLine[]> = {
  datasource: [
    { type: "normal", text: "val students = listOf(" },
    { type: "normal", text: "    Student(2026, \"Alya Putri\", \"TI\", 2026)," },
    { type: "normal", text: "    Student(2027, \"Bima Pratama\", \"TI\", 2026)" },
    { type: "normal", text: ")" },
  ],
  repository: [
    { type: "normal", text: "fun getStudentById(id: Int): Student? =" },
    { type: "normal", text: "    dataSource.getStudentById(id)" },
  ],
  viewmodel: [
    { type: "normal", text: "var student by remember { mutableStateOf(null) }" },
    { type: "normal", text: "LaunchedEffect(studentId) {" },
    { type: "normal", text: "    student = repository.getStudentById(studentId)" },
    { type: "normal", text: "}" },
  ],
  ui: [
    { type: "normal", text: "Column {" },
    { type: "normal", text: "    Text(student?.name ?: \"Mencari...\")" },
    { type: "normal", text: "}" },
  ],
};

// Cuplikan diff perubahan terisolasi (Stop 0..3)
const DIFF_CODE: Record<Layer, DiffLine[]> = {
  datasource: [
    { type: "del", text: "val students = listOf(" },
    { type: "del", text: "    Student(2026, \"Alya Putri\", \"TI\", 2026)," },
    { type: "del", text: "    Student(2027, \"Bima Pratama\", \"TI\", 2026)" },
    { type: "del", text: ")" },
    { type: "add", text: "fun getStudents(): List<Student> =" },
    { type: "add", text: "    httpClient.get(\"mgm.org/list\")" },
  ],
  repository: [
    { type: "normal", text: "fun getStudentById(id: Int): Student? =" },
    { type: "del", text: "    dataSource.getStudentById(id)" },
    { type: "add", text: "    if (id <= 0) null" },
    { type: "add", text: "    else dataSource.getStudents().find { it.id == id }" },
  ],
  viewmodel: [
    { type: "normal", text: "LaunchedEffect(studentId) {" },
    { type: "normal", text: "    val res = repository.getStudentById(studentId)" },
    { type: "del", text: "    errorMessage = \"Mahasiswa tidak ditemukan\"" },
    { type: "add", text: "    errorMessage = \"Mahasiswa #$studentId tidak ditemukan\"" },
    { type: "normal", text: "}" },
  ],
  ui: [
    { type: "normal", text: "Column {" },
    { type: "normal", text: "    Text(student?.name ?: \"Mencari...\")" },
    { type: "add", text: "    Text(\"Angkatan: ${student?.year ?: \\\"-\\\"}\")" },
    { type: "normal", text: "}" },
  ],
};

// Kode utuh 4 lapisan terpadu yang saling mereferensikan secara bersambung (Stop 4 & Stop 5)
// Data Source: mgm.org/list -> Repository: memanggil dataSource -> ViewModel: memanggil repo -> UI: merender VM
const UNIFIED_CODE: Record<Layer, DiffLine[]> = {
  datasource: [
    { type: "normal", text: "class StudentRemoteDataSource(" },
    { type: "normal", text: "    private val client: HttpClient" },
    { type: "normal", text: ") {" },
    { type: "normal", text: "    fun getStudents(): List<Student> =" },
    { type: "normal", text: "        client.get(\"mgm.org/list\")" },
    { type: "normal", text: "}" },
  ],
  repository: [
    { type: "normal", text: "class StudentRepository(" },
    { type: "normal", text: "    private val ds: StudentRemoteDataSource" },
    { type: "normal", text: ") {" },
    { type: "normal", text: "    fun getStudentById(id: Int): Student? =" },
    { type: "normal", text: "        if (id <= 0) null" },
    { type: "normal", text: "        else ds.getStudents().find { it.id == id }" },
    { type: "normal", text: "}" },
  ],
  viewmodel: [
    { type: "normal", text: "class DetailViewModel(" },
    { type: "normal", text: "    private val repo: StudentRepository" },
    { type: "normal", text: ") {" },
    { type: "normal", text: "    var student by mutableStateOf<Student?>(null)" },
    { type: "normal", text: "    var errorMessage by mutableStateOf<String?>(null)" },
    { type: "normal", text: "    fun loadStudent(id: Int) {" },
    { type: "normal", text: "        student = repo.getStudentById(id)" },
    { type: "normal", text: "        if (student == null)" },
    { type: "normal", text: "            errorMessage = \"Mahasiswa #$id tidak ditemukan\"" },
    { type: "normal", text: "    }" },
    { type: "normal", text: "}" },
  ],
  ui: [
    { type: "normal", text: "@Composable" },
    { type: "normal", text: "fun DetailScreen(vm: DetailViewModel) {" },
    { type: "normal", text: "    Column {" },
    { type: "normal", text: "        Text(vm.student?.name ?: vm.errorMessage ?: \"...\")" },
    { type: "normal", text: "        Text(\"Angkatan: ${vm.student?.year ?: \\\"-\\\"}\")" },
    { type: "normal", text: "    }" },
    { type: "normal", text: "}" },
  ],
};

export const Scene6TestChanges: React.FC = () => {
  // Stops 0 s.d. 5 (Scene index = 5)
  const p0 = useStopProgress(5, 0); // Permintaan 1: Data Source (REST API)
  const p1 = useStopProgress(5, 1); // Permintaan 2: Repository (Validasi ID)
  const p2 = useStopProgress(5, 2); // Permintaan 3: ViewModel (Pesan error ID)
  const p3 = useStopProgress(5, 3); // Permintaan 4: UI (Teks angkatan)
  const p4 = useStopProgress(5, 4); // Hasil Uji Keseluruhan (4 Layer Terpadu)
  const p5 = useStopProgress(5, 5); // Rangkuman & Modal Kesimpulan Penutup

  // Tentukan stop aktif saat ini
  let activeStop = 0;
  if (p5 > 0) activeStop = 5;
  else if (p4 > 0) activeStop = 4;
  else if (p3 > 0) activeStop = 3;
  else if (p2 > 0) activeStop = 2;
  else if (p1 > 0) activeStop = 1;

  // Lapisan mana yang berubah di tiap stop
  // Stop 0: datasource, Stop 1: repository, Stop 2: viewmodel, Stop 3: ui
  // Stop 4 & 5: seluruh layer terupdate utuh
  const targetLayer: Layer | null =
    activeStop === 0 ? "datasource" :
    activeStop === 1 ? "repository" :
    activeStop === 2 ? "viewmodel" :
    activeStop === 3 ? "ui" : null;

  const isUnified = activeStop >= 4;

  // Banner titles & subtitles
  const bannerInfo = [
    {
      title: "Permintaan 1/4: Ambil Data via REST API (mgm.org/list)",
      desc: "Hanya Data Source yang diubah ke client jaringan — UI, ViewModel, dan Repository tetap utuh tanpa disentuh.",
      layer: "Data Source",
      layerColor: "var(--c-ds, #1E3A8A)",
    },
    {
      title: "Permintaan 2/4: Tolak ID yang Tidak Valid (≤ 0)",
      desc: "Hanya Repository yang diubah (aturan akses data & filter) — UI, ViewModel, dan Data Source tetap utuh.",
      layer: "Repository",
      layerColor: "var(--c-repo, #22C55E)",
    },
    {
      title: "Permintaan 3/4: Pesan Error Sebutkan ID Mahasiswa",
      desc: "Hanya ViewModel yang diubah (state tingkat layar) — UI dan lapisan data tetap utuh.",
      layer: "ViewModel",
      layerColor: "var(--c-vm, #F97316)",
    },
    {
      title: "Permintaan 4/4: Tampilkan Angkatan Mahasiswa di Layar",
      desc: "Hanya Composable UI yang diubah — ViewModel, Repository, dan Data Source tetap utuh.",
      layer: "Composable UI",
      layerColor: "var(--c-ui, #3B82F6)",
    },
    {
      title: "Hasil Uji Keseluruhan: 4/4 Permintaan Sukses Terisolasi",
      desc: "Seluruh 4 layer berhasil diubah tanpa efek samping. Keempatnya kini bekerja sama secara harmonis!",
      layer: "Semua Terpadu",
      layerColor: "var(--c-repo, #22C55E)",
    },
    {
      title: "Kesimpulan: Mengapa Kita Memisahkan Lapisan?",
      desc: "Arsitektur berlapis mengisolasi perubahan dan siap berevolusi ke materi berikutnya!",
      layer: "Arsitektur Android",
      layerColor: "var(--laser, #EF4444)",
    },
  ][activeStop];

  // Modal summary spring on Stop 5
  const sprModal = spring({
    frame: p5 * 30,
    fps: FPS,
    durationInFrames: 30,
    config: { stiffness: 120, damping: 14 },
  });
  const modalScale = interpolate(sprModal, [0, 1], [0.88, 1]);
  const modalTranslateY = interpolate(sprModal, [0, 1], [24, 0]);
  const modalOpacity = interpolate(p5, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene fade in on entrance
  const sceneOpacity = interpolate(p0, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        userSelect: "none",
        backgroundColor: "var(--bg-light, #F8FAFC)",
        color: "var(--text-dark, #0F172A)",
        opacity: sceneOpacity,
      }}
    >
      {/* Header Scene */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--c-ui, #3B82F6)",
              marginBottom: 4,
            }}
          >
            Scene 6 · Validasi Praktis
          </div>
          <h1
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: "var(--text-dark, #0F172A)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Uji Perubahan: Bukti Pemisahan Tanggung Jawab
          </h1>
        </div>

        {/* Chip Pembuktian */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(15, 23, 42, 0.12)",
            borderRadius: 12,
            padding: "10px 20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: isUnified
                ? "var(--c-repo, #22C55E)"
                : "var(--c-repo, #22C55E)",
            }}
          />
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-dark, #0F172A)" }}>
            {isUnified ? "4/4 Sukses Teruji" : "1 Permintaan = 1 Lapisan"}
          </span>
        </div>
      </div>

      {/* Banner Permintaan Aktif */}
      <div
        style={{
          position: "absolute",
          top: 136,
          left: 80,
          right: 80,
          backgroundColor: "#FFFFFF",
          border: `2px solid ${bannerInfo.layerColor}`,
          borderRadius: 16,
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: bannerInfo.layerColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              flexShrink: 0,
            }}
          >
            {isUnified ? <Layers size={24} /> : <Zap size={24} />}
          </div>
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--text-dark, #0F172A)",
              }}
            >
              {bannerInfo.title}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "var(--text-muted, #64748B)",
                marginTop: 2,
              }}
            >
              {bannerInfo.desc}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            backgroundColor: bannerInfo.layerColor,
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          {bannerInfo.layer}
        </div>
      </div>

      {/* 4 Kartu Lapisan Sejajar (UI, ViewModel, Repository, Data Source) */}
      <div
        style={{
          position: "absolute",
          top: 242,
          left: 80,
          right: 80,
          display: "flex",
          gap: 40,
        }}
      >
        {LAYERS.map((layer) => {
          const isTarget = targetLayer === layer.id;
          const isDimmed = !isUnified && !isTarget;

          // Lines to show in card:
          // Stop 4 & 5 (isUnified): Tampilkan kode bersih terupdate utuh
          // Stop 0..3: Tampilkan diff jika target, atau normal jika tidak
          let codeLines = NORMAL_CODE[layer.id];
          if (isUnified) {
            codeLines = UNIFIED_CODE[layer.id];
          } else if (isTarget) {
            codeLines = DIFF_CODE[layer.id];
          }

          const currentClassName =
            isUnified && layer.id === "datasource"
              ? "StudentRemoteDataSource"
              : layer.className;

          return (
            <div
              key={layer.id}
              style={{
                flex: 1,
                width: 410,
                height: 560,
                backgroundColor: "var(--editor-bg, #282A36)",
                borderRadius: 18,
                border: isTarget || isUnified
                  ? `3px solid ${layer.bgHex}`
                  : "1px solid rgba(0, 0, 0, 0.12)",
                boxShadow: isTarget || isUnified
                  ? `0 0 20px ${layer.bgHex}40, 0 16px 36px rgba(0, 0, 0, 0.15)`
                  : "0 8px 24px rgba(0, 0, 0, 0.06)",
                transform: isTarget ? "scale(1.025)" : "scale(1)",
                opacity: isDimmed ? 0.35 : 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Header Kartu */}
              <div
                style={{
                  height: 54,
                  backgroundColor: "#1E1F29",
                  padding: "0 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                {/* Chip Nama Lapisan */}
                <div
                  style={{
                    backgroundColor: layer.colorVar,
                    color: layer.onColorVar,
                    padding: "4px 12px",
                    borderRadius: 6,
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  {layer.label}
                </div>

                {/* Badge Status */}
                {isUnified ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      backgroundColor: "rgba(16, 185, 129, 0.2)",
                      border: "1px solid #10B981",
                      padding: "3px 10px",
                      borderRadius: 6,
                      color: "#10B981",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>TERUJI</span>
                  </div>
                ) : isTarget ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      backgroundColor: "rgba(239, 68, 68, 0.2)",
                      border: "1px solid var(--laser, #EF4444)",
                      padding: "3px 10px",
                      borderRadius: 6,
                      color: "var(--laser, #EF4444)",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    <Zap size={14} />
                    <span>DIUBAH</span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      backgroundColor: "rgba(100, 116, 139, 0.2)",
                      border: "1px solid rgba(100, 116, 139, 0.3)",
                      padding: "3px 10px",
                      borderRadius: 6,
                      color: "#94A3B8",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>TETAP</span>
                  </div>
                )}
              </div>

              {/* Class name indicator */}
              <div
                style={{
                  padding: "10px 18px",
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "var(--text-muted, #64748B)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                  backgroundColor: "rgba(0, 0, 0, 0.15)",
                }}
              >
                {currentClassName}
              </div>

              {/* Code / Diff Body */}
              <div
                style={{
                  padding: "18px 16px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <DiffCodeBlock lines={codeLines} />
              </div>

              {/* Bottom isolation badge */}
              <div
                style={{
                  padding: "10px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "center",
                  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                  backgroundColor: isUnified
                    ? "rgba(16, 185, 129, 0.15)"
                    : isTarget
                    ? "rgba(239, 68, 68, 0.15)"
                    : "rgba(0, 0, 0, 0.1)",
                  color: isUnified
                    ? "#10B981"
                    : isTarget
                    ? "var(--laser, #EF4444)"
                    : "#64748B",
                }}
              >
                {isUnified
                  ? "✓ Terhubung & teruji penuh"
                  : isTarget
                  ? "✓ Hanya file ini yang perlu diedit"
                  : "✓ 0 baris kode diubah"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stop 5: Modal Rangkuman Penutup Kontras (Scene 6 Stop 5 / State 25) */}
      {p5 > 0 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) translateY(${modalTranslateY}px) scale(${modalScale})`,
            opacity: modalOpacity,
            width: 1240,
            backgroundColor: "#2B1B1B",
            border: "4px solid var(--laser, #EF4444)",
            borderRadius: 24,
            padding: "44px 54px",
            boxShadow:
              "0 0 24px var(--laser, #EF4444), 0 0 48px rgba(239, 68, 68, 0.45), 0 32px 72px rgba(0, 0, 0, 0.85)",
            color: "var(--text-light, #F8F8F2)",
            zIndex: 60,
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        >
          {/* Modal Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 32,
              paddingBottom: 22,
              borderBottom: "1px solid rgba(239, 68, 68, 0.35)",
            }}
          >
            <AlertTriangle size={46} color="var(--laser, #EF4444)" strokeWidth={2.5} />
            <h2
              style={{
                fontSize: 46,
                fontWeight: 700,
                color: "var(--text-light, #F8F8F2)",
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Mengapa Kita Memisahkan Lapisan?
            </h2>
          </div>

          {/* Kontras Comparison */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Versi Spageti */}
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.35)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: 14,
                padding: "20px 26px",
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  backgroundColor: "rgba(239, 68, 68, 0.25)",
                  color: "var(--laser, #EF4444)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                ✕
              </div>
              <div style={{ fontSize: 28, lineHeight: 1.35, color: "var(--text-light, #F8F8F2)" }}>
                <strong style={{ color: "#F87171" }}>Versi Spageti (Scene 1):</strong> 4 permintaan mengedit fungsi yang sama. Ubah satu hal, fitur lain berisiko ikut rusak.
              </div>
            </div>

            {/* Versi Berlapis */}
            <div
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.12)",
                border: "1px solid rgba(34, 197, 94, 0.35)",
                borderRadius: 14,
                padding: "20px 26px",
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  backgroundColor: "rgba(34, 197, 94, 0.25)",
                  color: "#4ADE80",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div style={{ fontSize: 28, lineHeight: 1.35, color: "var(--text-light, #F8F8F2)" }}>
                <strong style={{ color: "#4ADE80" }}>Arsitektur 4 Lapis (Scene 6):</strong> Tiap permintaan hanya mengubah 1 lapisan terisolasi. 3 lapisan lainnya 100% aman!
              </div>
            </div>

            {/* Teaser Masa Depan */}
            <div
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.12)",
                border: "1px solid rgba(59, 130, 246, 0.35)",
                borderRadius: 14,
                padding: "20px 26px",
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  backgroundColor: "rgba(59, 130, 246, 0.25)",
                  color: "#60A5FA",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                ★
              </div>
              <div style={{ fontSize: 28, lineHeight: 1.35, color: "var(--text-light, #F8F8F2)" }}>
                <strong style={{ color: "#60A5FA" }}>Materi Modul 07+:</strong> Mengganti sumber data ke Room Database atau REST API jaringan hanya menyentuh Data Source.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

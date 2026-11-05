import React from "react";
import { interpolate, spring } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { EditorWindow } from "../components/EditorWindow";
import { DiffCodeBlock } from "../components/DiffCodeBlock";
import { DIFFS, SUMMARY_ITEMS, Layer } from "../assets/code";
import {
  Sparkles,
  GitCompare,
  CheckCircle2,
  Zap,
  ArrowRight,
  MinusCircle,
  PlusCircle,
  Database,
} from "lucide-react";

interface LayerBoxDef {
  id: Layer;
  name: string;
  sublabel: string;
  color: string;
  onColor: string;
  isDashed?: boolean;
}

const LAYERS: LayerBoxDef[] = [
  {
    id: "ui",
    name: "Composable UI",
    sublabel: "HomeScreen · Compose",
    color: "var(--c-ui, #3B82F6)",
    onColor: "var(--on-ui, #FFFFFF)",
  },
  {
    id: "vm",
    name: "ViewModel",
    sublabel: "HomeViewModel · StateFlow",
    color: "var(--c-vm, #F97316)",
    onColor: "var(--on-vm, #0F172A)",
  },
  {
    id: "repo",
    name: "Repository",
    sublabel: "DefaultStudentRepository",
    color: "var(--c-repo, #22C55E)",
    onColor: "var(--on-repo, #0F172A)",
  },
  {
    id: "rds",
    name: "Remote Data Source",
    sublabel: "StudentRemoteDataSource · Retrofit",
    color: "var(--c-ds, #1E3A8A)",
    onColor: "var(--on-ds, #FFFFFF)",
  },
  {
    id: "api",
    name: "REST API",
    sublabel: "DummyJSON (di luar aplikasi)",
    color: "var(--c-api, #475569)",
    onColor: "var(--on-api, #FFFFFF)",
    isDashed: true,
  },
];

const DIFF_EXPLANATIONS: Record<
  Layer,
  {
    filename: string;
    removed: string;
    added: string;
    impact: string;
  }
> = {
  rds: {
    filename: "StudentRemoteDataSource.kt",
    removed: "Call<UserResponse> dan callback lambda enqueue() yang mengunci alur program.",
    added: "Fungsi suspend satu baris getUsers() murni non-blocking.",
    impact: "Retrofit secara internal otomatis mengalihkan request ke background thread (Main-Safe).",
  },
  repo: {
    filename: "StudentRepository.kt",
    removed: "Fungsi callback lambda bertingkat getStudents(callback: (Result<T>) -> Unit).",
    added: "Fungsi suspend getStudents(): List<Student> dengan pemetaan .map { it.toStudent() }.",
    impact: "Model domain Student terlindungi bersih; pemetaan DTO diselesaikan di layer repository.",
  },
  vm: {
    filename: "HomeViewModel.kt",
    removed: "mutableStateOf dari Compose runtime dan callback bersarang di dalam ViewModel.",
    added: "MutableStateFlow privat, StateFlow publik, viewModelScope.launch, dan throw CancellationException.",
    impact: "Structured concurrency otomatis membatalkan pekerjaan saat layar ditutup tanpa memory leak.",
  },
  ui: {
    filename: "HomeScreen.kt",
    removed: "Pembacaan statis uiState.value dan tombol manual 'Cari' Modul 07.",
    added: "collectAsStateWithLifecycle() dan TextField reaktif yang langsung memicu aliran Flow.",
    impact: "UI otomatis recompose saat state berubah dan membekukan emisi saat background (hemat baterai).",
  },
  api: {
    filename: "DummyJSON",
    removed: "",
    added: "",
    impact: "",
  },
};

/**
 * Scene 6: Peta Refactoring & Jembatan ke Modul 09 (State 25 - 30)
 * Sesuai spesifikasi docs/02-storyboard.md Scene 6 & docs/06-acceptance.md C.25-30.
 */
export const Scene6Summary: React.FC = () => {
  const pStop0 = useStopProgress("summary", 0);
  const pStop1 = useStopProgress("summary", 1);
  const pStop2 = useStopProgress("summary", 2);
  const pStop3 = useStopProgress("summary", 3);
  const pStop4 = useStopProgress("summary", 4);
  const pStop5 = useStopProgress("summary", 5);

  // Easing pegas antar-stop
  const spring0 = spring({ frame: pStop0 * 24, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring1 = spring({ frame: pStop1 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring2 = spring({ frame: pStop2 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring3 = spring({ frame: pStop3 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring4 = spring({ frame: pStop4 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring5 = spring({ frame: pStop5 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });

  // Tentukan state aktif (25 s.d. 30)
  const isState30 = pStop5 > 0.05;
  const isState29 = pStop4 > 0.05 && !isState30;
  const isState28 = pStop3 > 0.05 && !isState29 && !isState30;
  const isState27 = pStop2 > 0.05 && !isState28 && !isState29 && !isState30;
  const isState26 = pStop1 > 0.05 && !isState27 && !isState28 && !isState29 && !isState30;
  const isState25 = !isState26 && !isState27 && !isState28 && !isState29 && !isState30;

  // Layer yang sedang aktif pada diff
  const activeDiffLayer: Layer | null = isState26
    ? "rds"
    : isState27
    ? "repo"
    : isState28
    ? "vm"
    : isState29
    ? "ui"
    : null;

  const activeDiffItem = activeDiffLayer
    ? DIFFS.find((d) => d.layer === activeDiffLayer) || DIFFS[0]
    : DIFFS[0];

  const activeExplanation = activeDiffLayer
    ? DIFF_EXPLANATIONS[activeDiffLayer]
    : DIFF_EXPLANATIONS.rds;

  // Banner teks dinamis
  const getBannerTitle = (): string => {
    if (isState30) return "Ringkasan Arsitektur Modul 08: Yang Berubah vs Yang Tetap";
    if (isState29) return DIFFS[3].banner;
    if (isState28) return DIFFS[2].banner;
    if (isState27) return DIFFS[1].banner;
    if (isState26) return DIFFS[0].banner;
    return "Peta Perubahan: Dari Callback Modul 07 ke Coroutines & Flow Modul 08";
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "var(--bg-light, #F8FAFC)",
        color: "var(--text-dark, #0F172A)",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ============================================================== */}
      {/* BARIS ATAS: 5 KOTAK LAPISAN ARSITEKTUR (y = 80px s.d. 200px) */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          top: "var(--safe, 80px)",
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          display: "flex",
          justifyContent: "space-between",
          gap: 25,
        }}
      >
        {LAYERS.map((layer) => {
          const isFocused = activeDiffLayer === layer.id;
          const isAllUnified = isState30;

          // Status badge per kotak
          const badgeText = isAllUnified
            ? "✓ TERPADU"
            : layer.id === "api"
            ? "✓ TETAP"
            : "⚡ DIUBAH";

          const badgeBg = isAllUnified
            ? "rgba(234, 179, 8, 0.25)"
            : layer.id === "api"
            ? "rgba(100, 116, 139, 0.25)"
            : "rgba(249, 115, 22, 0.25)";

          const badgeColor = isAllUnified
            ? "var(--c-bookmark, #EAB308)"
            : layer.id === "api"
            ? "var(--text-light, #F8F8F2)"
            : "#FFEDD5";

          return (
            <div
              key={layer.id}
              style={{
                flex: 1,
                height: 116,
                borderRadius: 18,
                backgroundColor: layer.color,
                color: layer.onColor,
                padding: "12px 18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                border: layer.isDashed
                  ? "3px dashed rgba(255, 255, 255, 0.6)"
                  : isFocused
                  ? "4px solid #FFFFFF"
                  : isAllUnified
                  ? "3px solid var(--c-bookmark, #EAB308)"
                  : "2px solid rgba(255, 255, 255, 0.2)",
                boxShadow: isFocused
                  ? "0 0 0 6px rgba(255, 255, 255, 0.4), 0 12px 28px rgba(0, 0, 0, 0.25)"
                  : isAllUnified
                  ? "0 8px 24px rgba(234, 179, 8, 0.3)"
                  : "0 6px 18px rgba(15, 23, 42, 0.08)",
                transform: isFocused ? "scale(1.04)" : "scale(1)",
                opacity: activeDiffLayer && !isFocused && !isAllUnified ? 0.45 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>
                  {layer.name}
                </span>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: 999,
                    backgroundColor: badgeBg,
                    color: badgeColor,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                  }}
                >
                  {badgeText}
                </span>
              </div>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  opacity: 0.9,
                  fontFamily: layer.id === "rds" || layer.id === "api" ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {layer.sublabel}
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* BANNER JUDUL REFACTORING (y = 215px s.d. 270px) */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          top: 215,
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          height: 56,
          borderRadius: 14,
          backgroundColor: isState30
            ? "rgba(234, 179, 8, 0.12)"
            : "rgba(139, 92, 246, 0.1)",
          border: isState30
            ? "2px solid var(--c-bookmark, #EAB308)"
            : "1.5px solid rgba(139, 92, 246, 0.3)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isState30 ? (
            <Sparkles size={22} color="var(--c-bookmark, #EAB308)" />
          ) : (
            <GitCompare size={22} color="var(--c-coroutine, #8B5CF6)" />
          )}
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: isState30 ? "var(--text-dark, #0F172A)" : "var(--text-dark, #0F172A)",
              letterSpacing: "-0.01em",
            }}
          >
            {getBannerTitle()}
          </span>
        </div>

        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            fontWeight: 700,
            color: isState30 ? "var(--c-bookmark, #EAB308)" : "var(--c-coroutine, #8B5CF6)",
          }}
        >
          {isState30 ? "State 30 / 30 · Arsitektur Terpadu" : `State ${isState25 ? "25" : isState26 ? "26" : isState27 ? "27" : isState28 ? "28" : "29"} / 30`}
        </div>
      </div>

      {/* ============================================================== */}
      {/* PANEL KONTEN UTAMA (y = 290px s.d. 1020px) */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          top: 290,
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          bottom: 50,
          display: "flex",
          gap: "var(--gap, 40px)",
        }}
      >
        {/* ============================================================ */}
        {/* KONDISI 1: STATE 25 — IKHTISAR 4 PILAR TRANSFORMASI */}
        {/* ============================================================ */}
        {isState25 && (
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 24,
              transform: `scale(${interpolate(spring0, [0, 1], [0.97, 1])})`,
            }}
          >
            {/* Pilar 1 */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "1.5px solid var(--c-ds, #1E3A8A)",
                padding: "24px 28px",
                boxShadow: "0 8px 24px rgba(30, 58, 138, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Zap size={24} color="var(--c-ds, #1E3A8A)" />
                <h4 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--c-ds, #1E3A8A)" }}>
                  1. Remote Data Source Murni Suspend
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #0F172A)", lineHeight: 1.55 }}>
                Membuang <code>Call&lt;T&gt;</code> dan antrean callback <code>enqueue()</code>. Retrofit mengeksekusi request secara langsung sebagai fungsi <code>suspend</code> yang terbukti <em>main-safe</em> tanpa perlu pembungkus <code>Dispatchers.IO</code> manual.
              </p>
            </div>

            {/* Pilar 2 */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "1.5px solid var(--c-repo, #22C55E)",
                padding: "24px 28px",
                boxShadow: "0 8px 24px rgba(34, 197, 94, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={24} color="var(--c-repo, #22C55E)" />
                <h4 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--c-repo, #22C55E)" }}>
                  2. Repository: Kontrak Linear & Pemetaan Bersih
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #0F172A)", lineHeight: 1.55 }}>
                Kontrak antarmuka Repository menyajikan fungsi suspend yang mengembalikan model domain <code>Student</code> secara sekuensial linear. Pemetaan DTO dilakukan elegan via <code>.map &#123; it.toStudent() &#125;</code>.
              </p>
            </div>

            {/* Pilar 3 */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "1.5px solid var(--c-vm, #F97316)",
                padding: "24px 28px",
                boxShadow: "0 8px 24px rgba(249, 115, 22, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={24} color="var(--c-vm, #F97316)" />
                <h4 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--c-vm, #F97316)" }}>
                  3. ViewModel: viewModelScope & StateFlow
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #0F172A)", lineHeight: 1.55 }}>
                Seluruh komputasi asinkron dikendalikan oleh <code>viewModelScope.launch</code>. State dienkapsulasi dengan <code>MutableStateFlow</code> privat, dan pembatalan otomatis dijamin dengan <code>throw CancellationException</code>.
              </p>
            </div>

            {/* Pilar 4 */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "1.5px solid var(--c-ui, #3B82F6)",
                padding: "24px 28px",
                boxShadow: "0 8px 24px rgba(59, 130, 246, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={24} color="var(--c-ui, #3B82F6)" />
                <h4 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--c-ui, #3B82F6)" }}>
                  4. Composable UI: Lifecycle-Aware & Flow Reaktif
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #0F172A)", lineHeight: 1.55 }}>
                UI mengoleksi state secara hemat baterai dengan <code>collectAsStateWithLifecycle()</code>. Tombol cari manual dihapus dan digantikan oleh pipa pencarian otomatis (debounce 500ms, distinct, collectLatest).
              </p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* KONDISI 2: STATE 26 s.d. 29 — PANEL VISUAL DIFF PER LAPISAN */}
        {/* ============================================================ */}
        {!isState25 && !isState30 && (
          <div style={{ flex: 1, display: "flex", gap: "var(--gap, 40px)" }}>
            {/* Panel Kiri (1160px): Editor Visual Diff */}
            <div style={{ flex: 1.25, display: "flex", flexDirection: "column" }}>
              <EditorWindow tabTitle={activeExplanation.filename} style={{ width: "100%", height: "100%" }}>
                <div style={{ padding: "20px 24px", overflowY: "auto" }}>
                  <DiffCodeBlock lines={activeDiffItem.lines} style={{ fontSize: 17, lineHeight: 1.5 }} />
                </div>
              </EditorWindow>
            </div>

            {/* Panel Kanan (560px): Kartu Penjelasan Refactoring */}
            <div
              style={{
                flex: 0.75,
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "1.5px solid rgba(15, 23, 42, 0.1)",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 18,
                transform: `scale(${interpolate(
                  isState26 ? spring1 : isState27 ? spring2 : isState28 ? spring3 : spring4,
                  [0, 1],
                  [0.96, 1]
                )})`,
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 16px 0", fontSize: 22, fontWeight: 800, color: "var(--text-dark, #0F172A)" }}>
                  Analisis Perubahan Kode
                </h3>

                {/* Yang Dihapus (-) */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    border: "1.5px solid rgba(239, 68, 68, 0.3)",
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--c-cancel, #EF4444)", fontWeight: 800, fontSize: 14, marginBottom: 4 }}>
                    <MinusCircle size={18} />
                    <span>DIHAPUS / DIROMBAK (-)</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 15, color: "var(--text-dark, #0F172A)", lineHeight: 1.45 }}>
                    {activeExplanation.removed}
                  </p>
                </div>

                {/* Yang Ditambahkan (+) */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    backgroundColor: "rgba(34, 197, 94, 0.08)",
                    border: "1.5px solid rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--life-active, #16A34A)", fontWeight: 800, fontSize: 14, marginBottom: 4 }}>
                    <PlusCircle size={18} />
                    <span>DITAMBAHKAN / DIOPTIMASI (+)</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 15, color: "var(--text-dark, #0F172A)", lineHeight: 1.45 }}>
                    {activeExplanation.added}
                  </p>
                </div>
              </div>

              {/* Manfaat Arsitektur */}
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: 14,
                  backgroundColor: "rgba(139, 92, 246, 0.08)",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--c-coroutine, #8B5CF6)", marginBottom: 4 }}>
                  Nilai Arsitektur Bersih:
                </div>
                <div style={{ fontSize: 15, color: "var(--text-dark, #0F172A)", lineHeight: 1.45 }}>
                  {activeExplanation.impact}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* KONDISI 3: STATE 30 — TABEL 2 KOLOM & JEMBATAN KE MODUL 09 */}
        {/* ============================================================ */}
        {isState30 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              transform: `scale(${interpolate(spring5, [0, 1], [0.97, 1])})`,
            }}
          >
            {/* Tabel 2 Kolom: Berubah vs Tetap */}
            <div style={{ flex: 1, display: "flex", gap: "var(--gap, 40px)" }}>
              {/* Kolom Kiri: 7 Poin Berubah */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 20,
                  border: "2px solid var(--c-coroutine, #8B5CF6)",
                  boxShadow: "0 10px 28px rgba(139, 92, 246, 0.12)",
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <Zap size={22} color="var(--c-coroutine, #8B5CF6)" />
                  <h4 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "var(--c-coroutine, #8B5CF6)" }}>
                    Yang Berubah (Modul 07 ➔ Modul 08)
                  </h4>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
                  {SUMMARY_ITEMS.changed.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: 15,
                        color: "var(--text-dark, #0F172A)",
                        lineHeight: 1.35,
                      }}
                    >
                      <ArrowRight size={16} color="var(--c-coroutine, #8B5CF6)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kolom Kanan: 5 Poin Tetap */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 20,
                  border: "2px solid var(--life-active, #16A34A)",
                  boxShadow: "0 10px 28px rgba(22, 163, 74, 0.12)",
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <CheckCircle2 size={22} color="var(--life-active, #16A34A)" />
                  <h4 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "var(--life-active, #16A34A)" }}>
                    Yang Tetap Kokoh (Integritas Arsitektur)
                  </h4>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
                  {SUMMARY_ITEMS.unchanged.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: 15,
                        color: "var(--text-dark, #0F172A)",
                        lineHeight: 1.4,
                      }}
                    >
                      <CheckCircle2 size={16} color="var(--life-active, #16A34A)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Baris Teaser Emas: Jembatan ke Modul 09 */}
            <div
              style={{
                height: 72,
                borderRadius: 16,
                backgroundColor: "rgba(234, 179, 8, 0.15)",
                border: "2px solid var(--c-bookmark, #EAB308)",
                boxShadow: "0 8px 24px rgba(234, 179, 8, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 28px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    backgroundColor: "var(--c-bookmark, #EAB308)",
                    color: "var(--on-bookmark, #0F172A)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Database size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-dark, #0F172A)" }}>
                    Berikutnya: Menyimpan Data Offline dengan Room Database & DataStore (Modul 09)
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-muted, #475569)" }}>
                    Coroutines dan Flow yang dikuasai hari ini menjadi fondasi reaktif untuk Single Source of Truth lokal di Modul 09.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  borderRadius: 999,
                  backgroundColor: "var(--c-bookmark, #EAB308)",
                  color: "var(--on-bookmark, #0F172A)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                }}
              >
                <Sparkles size={16} />
                <span>MODUL 09 SEGERA</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


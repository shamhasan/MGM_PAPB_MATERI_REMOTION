import React from "react";
import { interpolate, spring } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { EditorWindow } from "../components/EditorWindow";
import { CodeBlock } from "../components/CodeBlock";
import { PhoneMock } from "../components/PhoneMock";
import { LifecycleBadge } from "../components/LifecycleBadge";
import { STATEFLOW_CODE, COMPOSE_COLLECT_CODE, PHONE_ROWS } from "../assets/code";
import {
  Layers,
  Lock,
  Unlock,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BatteryCharging,
  EyeOff,
} from "lucide-react";

const CODE_WRONG_VALUE = `@Composable
fun HomeScreen(viewModel: HomeViewModel) {
    // SALAH BESAR: Membaca .value secara statis!
    // Composable TIDAK AKAN merekomposisi saat data baru tiba
    val state = viewModel.uiState.value

    UserList(users = state.students)
}`;

/**
 * Scene 4: Penampung State Modern & Lifecycle-Aware (State 14 - 18)
 * Sesuai spesifikasi docs/02-storyboard.md Scene 4 & docs/06-acceptance.md C.14-18.
 */
export const Scene4StateFlow: React.FC = () => {
  const pStop0 = useStopProgress("stateflow", 0);
  const pStop1 = useStopProgress("stateflow", 1);
  const pStop2 = useStopProgress("stateflow", 2);
  const pStop3 = useStopProgress("stateflow", 3);
  const pStop4 = useStopProgress("stateflow", 4);

  // Easing pegas antar-stop
  const spring0 = spring({ frame: pStop0 * 24, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring1 = spring({ frame: pStop1 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring2 = spring({ frame: pStop2 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring3 = spring({ frame: pStop3 * 36, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring4 = spring({ frame: pStop4 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });

  // Tentukan state aktif (14 s.d. 18)
  const isState18 = pStop4 > 0.05;
  const isState17 = pStop3 > 0.05 && !isState18;
  const isState16 = pStop2 > 0.05 && !isState17 && !isState18;
  const isState15 = pStop1 > 0.05 && !isState16 && !isState17 && !isState18;
  const isState14 = !isState15 && !isState16 && !isState17 && !isState18;

  // Transisi antara Panel Diagram (State 14-16) vs Panel PhoneMock (State 17-18)
  const diagramOpacity = interpolate(pStop3, [0, 0.7], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phoneMockOpacity = interpolate(pStop3, [0.2, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      {/* Header Scene 4 */}
      <div
        style={{
          position: "absolute",
          top: "var(--safe, 80px)",
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 14px",
              borderRadius: 999,
              backgroundColor: "rgba(22, 163, 74, 0.12)",
              border: "1px solid rgba(22, 163, 74, 0.35)",
              color: "var(--life-active, #16A34A)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            <Sparkles size={16} />
            <span>Scene 4: Penampung State Modern & Lifecycle-Aware</span>
          </div>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "var(--text-dark, #0F172A)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Enkapsulasi StateFlow & Pengoleksian Sadar Daur Hidup
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "var(--text-muted, #64748B)",
              margin: "6px 0 0 0",
            }}
          >
            Dari mutableStateOf ke MutableStateFlow Privat, Larangan .value, & Efisiensi Baterai di Latar Belakang
          </p>
        </div>
      </div>

      {/* Konten 2 Kolom (y = 205px, bottom = 60px) */}
      <div
        style={{
          position: "absolute",
          top: 205,
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          bottom: 60,
          display: "flex",
          gap: "var(--gap, 40px)",
        }}
      >
        {/* ============================================================== */}
        {/* KOLOM KIRI: DIAGRAM ENKAPSULASI (14-16) / PHONEMOCK LIFECYCLE (17-18) */}
        {/* ============================================================== */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* ============================================================ */}
          {/* BAGIAN A: DIAGRAM ARSITEKTUR & ENKAPSULASI (State 14 - 16) */}
          {/* ============================================================ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: diagramOpacity,
              pointerEvents: pStop3 > 0.5 ? "none" : "auto",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Kartu Evaluasi State 14: mutableStateOf vs StateFlow */}
            {isState14 && (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 20,
                  border: "1.5px solid rgba(15, 23, 42, 0.1)",
                  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  transform: `scale(${interpolate(spring0, [0, 1], [0.96, 1])})`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Layers size={24} color="var(--c-coroutine, #8B5CF6)" />
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-dark, #0F172A)" }}>
                    Evolusi Penampung State di ViewModel
                  </h3>
                </div>

                {/* Komparasi Modul 07 vs Modul 08 */}
                <div style={{ display: "flex", gap: 16 }}>
                  {/* Modul 07 */}
                  <div
                    style={{
                      flex: 1,
                      padding: "16px 18px",
                      borderRadius: 14,
                      backgroundColor: "rgba(220, 38, 38, 0.06)",
                      border: "1.5px solid rgba(220, 38, 38, 0.25)",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--err, #DC2626)", marginBottom: 6 }}>
                      Modul 07: mutableStateOf
                    </div>
                    <p style={{ margin: 0, fontSize: 15, color: "var(--text-dark, #0F172A)", lineHeight: 1.45 }}>
                      Terikat langsung ke <code>androidx.compose.runtime</code> di ViewModel. Mengaburkan batasan arsitektur antara UI dan Presentation logic.
                    </p>
                  </div>

                  {/* Modul 08 */}
                  <div
                    style={{
                      flex: 1,
                      padding: "16px 18px",
                      borderRadius: 14,
                      backgroundColor: "rgba(22, 163, 74, 0.08)",
                      border: "1.5px solid var(--life-active, #16A34A)",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--life-active, #16A34A)", marginBottom: 6 }}>
                      ✓ Modul 08: StateFlow
                    </div>
                    <p style={{ margin: 0, fontSize: 15, color: "var(--text-dark, #0F172A)", lineHeight: 1.45 }}>
                      Standar resmi Kotlin Coroutines. Bebas dari dependensi Compose runtime di ViewModel, 100% aman diuji pada unit test JVM lokal.
                    </p>
                  </div>
                </div>

                <div style={{ fontSize: 15, color: "var(--text-muted, #475569)", lineHeight: 1.5 }}>
                  💡 <strong>Kaidah Arsitektur Android Modern:</strong> ViewModel tidak boleh mengimpor paket Compose runtime; ViewModel bertugas memancarkan aliran data murni (Stream of States).
                </div>
              </div>
            )}

            {/* Diagram Enkapsulasi 2 Lapis (State 15 & 16) */}
            {(isState15 || isState16) && (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 20,
                  border: "1.5px solid rgba(15, 23, 42, 0.1)",
                  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
                  padding: "24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  transform: `scale(${interpolate(spring1, [0, 1], [0.96, 1])})`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Lock size={24} color="var(--c-vm, #F97316)" />
                    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-dark, #0F172A)" }}>
                      Prinsip Enkapsulasi State di ViewModel
                    </h3>
                  </div>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: 999,
                      backgroundColor: "rgba(249, 115, 22, 0.12)",
                      color: "var(--c-vm, #F97316)",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Single Source of Truth
                  </span>
                </div>

                {/* Visual Kotak 2 Lapis: Lapisan Dalam vs Lapisan Luar */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor: "var(--editor-bg, #282A36)",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {/* Lapisan Dalam (Private MutableStateFlow) */}
                  <div
                    style={{
                      borderRadius: 12,
                      border: "2px dashed var(--c-vm, #F97316)",
                      backgroundColor: "rgba(249, 115, 22, 0.14)",
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Lock size={20} color="var(--c-vm, #F97316)" />
                      <div>
                        <div
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 16,
                            fontWeight: 700,
                            color: "var(--c-vm, #F97316)",
                          }}
                        >
                          private val _uiState = MutableStateFlow(...)
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-muted, #CBD5E1)", marginTop: 2 }}>
                          Kunci Mutasi: Hanya ViewModel yang boleh menulis <code>.value = ...</code>
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        backgroundColor: "var(--c-vm, #F97316)",
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      MUTABLE (R/W)
                    </span>
                  </div>

                  {/* Panah Transformasi asStateFlow */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      color: "var(--text-light, #F8F8F2)",
                      fontSize: 13,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    <span>.asStateFlow()</span>
                    <ArrowRight size={16} color="var(--life-active, #16A34A)" />
                    <span style={{ color: "var(--life-active, #16A34A)", fontWeight: 700 }}>
                      Read-Only Exposure
                    </span>
                  </div>

                  {/* Lapisan Luar (Public StateFlow) */}
                  <div
                    style={{
                      borderRadius: 12,
                      border: "2px solid var(--life-active, #16A34A)",
                      backgroundColor: "rgba(22, 163, 74, 0.15)",
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Unlock size={20} color="var(--life-active, #16A34A)" />
                      <div>
                        <div
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 16,
                            fontWeight: 700,
                            color: "var(--life-active, #16A34A)",
                          }}
                        >
                          val uiState: StateFlow&lt;HomeUiState&gt;
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-muted, #CBD5E1)", marginTop: 2 }}>
                          Paparan Publik: UI hanya dapat mengobservasi emisi tanpa mengubah data
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        backgroundColor: "var(--life-active, #16A34A)",
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      READ-ONLY
                    </span>
                  </div>
                </div>

                {/* Larangan Pembacaan Langsung di State 16 */}
                {isState16 && (
                  <div
                    style={{
                      borderRadius: 14,
                      backgroundColor: "rgba(220, 38, 38, 0.1)",
                      border: "2px solid var(--err, #DC2626)",
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      transform: `scale(${interpolate(spring2, [0, 1], [0.95, 1])})`,
                    }}
                  >
                    <XCircle size={32} color="var(--err, #DC2626)" strokeWidth={2.5} />
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "var(--err, #DC2626)" }}>
                        DILARANG KERAS: Membaca .value Langsung di Composable!
                      </div>
                      <div style={{ fontSize: 14, color: "var(--text-dark, #0F172A)", marginTop: 2 }}>
                        Membaca nilai <code>.value</code> secara statis tidak mendaftarkan subscription. UI tidak akan merekomposisi saat state berubah!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* BAGIAN B: PHONEMOCK DENGAN LIFECYCLEBADGE (State 17 & 18) */}
          {/* ============================================================ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: phoneMockOpacity,
              pointerEvents: isState17 || isState18 ? "auto" : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              transform: `scale(${interpolate(spring3, [0, 1], [0.94, 1])})`,
            }}
          >
            {/* Indikator Status Siklus Hidup Melayang di Atas Layar */}
            <LifecycleBadge status={isState18 ? "idle" : "active"} />

            {/* Simulasi Mockup Ponsel */}
            <div style={{ position: "relative" }}>
              <PhoneMock
                mode="success"
                title="Mahasiswa FILKOM"
                rows={PHONE_ROWS.slice(0, 5)}
                style={{
                  width: 380,
                  height: 520,
                  opacity: isState18 ? 0.45 : 1,
                  filter: isState18 ? "grayscale(75%)" : "none",
                }}
              />

              {/* Overlay saat Aplikasi di-Minimize (State 18) */}
              {isState18 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 48,
                    backgroundColor: "rgba(15, 23, 42, 0.65)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                    padding: 24,
                    textAlign: "center",
                    zIndex: 10,
                  }}
                >
                  <EyeOff size={56} color="var(--life-idle, #F59E0B)" strokeWidth={2.5} />
                  <div
                    style={{
                      backgroundColor: "var(--life-idle, #F59E0B)",
                      color: "#0F172A",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 800,
                      fontSize: 16,
                      letterSpacing: "0.08em",
                      padding: "6px 20px",
                      borderRadius: 999,
                      boxShadow: "0 6px 18px rgba(245, 158, 11, 0.4)",
                    }}
                  >
                    APLIKASI DI-MINIMIZE
                  </div>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#F8F8F2",
                      maxWidth: 280,
                      lineHeight: 1.45,
                    }}
                  >
                    Tombol Home Ditekan • Composable Masuk ke State STOPPED
                  </span>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 14px",
                      borderRadius: 999,
                      backgroundColor: "rgba(22, 163, 74, 0.2)",
                      border: "1px solid var(--life-active, #16A34A)",
                      color: "#4ADE80",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    <BatteryCharging size={16} />
                    <span>Emisi Dijeda: Baterai & CPU Hemat</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* KOLOM KANAN: PANEL KODE DRACULA & KARTU STATUS BERGILIR */}
        {/* ============================================================== */}
        <div
          style={{
            flex: 1.15,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Jendela Editor Dracula */}
          <div style={{ position: "relative", minHeight: 440 }}>
            {/* Editor State 14 & 15: STATEFLOW_CODE di ViewModel */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: interpolate(pStop2, [0, 0.8], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                pointerEvents: isState16 || isState17 || isState18 ? "none" : "auto",
              }}
            >
              <EditorWindow tabTitle="HomeViewModel.kt — Enkapsulasi StateFlow" style={{ width: "100%", height: 440 }}>
                <div style={{ padding: "18px 22px" }}>
                  <CodeBlock
                    code={STATEFLOW_CODE}
                    fontSize={17}
                    lineHeight={1.42}
                    lineEmphasis={(idx) => {
                      // Pada State 15, sorot baris _uiState dan uiState (baris 3 & 4)
                      if (pStop1 > 0 && (idx === 3 || idx === 4)) {
                        return { background: "rgba(22, 163, 74, 0.22)" };
                      }
                      return 1;
                    }}
                  />
                </div>
              </EditorWindow>
            </div>

            {/* Editor State 16: Kode Salah Composable Baca .value */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: pStop2 > 0 && pStop3 <= 0.1 ? interpolate(pStop2, [0.3, 1], [0, 1]) : 0,
                transform: `scale(${interpolate(spring2, [0, 1], [0.96, 1])})`,
                pointerEvents: isState16 ? "auto" : "none",
                display: pStop2 > 0 && pStop3 <= 0.1 ? "block" : "none",
              }}
            >
              <EditorWindow tabTitle="HomeScreen.kt — SALAH: Akses Statis .value" style={{ width: "100%", height: 440 }}>
                <div style={{ padding: "18px 22px" }}>
                  <CodeBlock
                    code={CODE_WRONG_VALUE}
                    fontSize={17}
                    lineHeight={1.42}
                    lineEmphasis={(idx) => {
                      if (idx === 4) {
                        return { background: "rgba(220, 38, 38, 0.32)" };
                      }
                      return 1;
                    }}
                  />
                </div>
              </EditorWindow>
            </div>

            {/* Editor State 17 & 18: COMPOSE_COLLECT_CODE */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: interpolate(pStop3, [0.2, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `scale(${interpolate(spring3, [0, 1], [0.96, 1])})`,
                pointerEvents: isState17 || isState18 ? "auto" : "none",
                display: pStop3 > 0.1 ? "block" : "none",
              }}
            >
              <EditorWindow tabTitle="HomeScreen.kt — collectAsStateWithLifecycle" style={{ width: "100%", height: 440 }}>
                <div style={{ padding: "18px 22px" }}>
                  <CodeBlock
                    code={COMPOSE_COLLECT_CODE}
                    fontSize={16}
                    lineHeight={1.4}
                    lineEmphasis={(idx) => {
                      // Sorot baris collectAsStateWithLifecycle (baris 0 & 1)
                      if (idx === 0 || idx === 1) {
                        return {
                          background: isState18
                            ? "rgba(245, 158, 11, 0.22)"
                            : "rgba(22, 163, 74, 0.25)",
                        };
                      }
                      return 1;
                    }}
                  />
                </div>
              </EditorWindow>
            </div>
          </div>

          {/* ============================================================== */}
          {/* KARTU STATUS DI BAWAH PANEL KODE */}
          {/* ============================================================== */}
          <div style={{ position: "relative", minHeight: 140 }}>
            {/* Kartu State 14: Rekap mutableStateOf vs StateFlow */}
            {isState14 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 18,
                  border: "1.5px solid rgba(15, 23, 42, 0.1)",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                  padding: "18px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-dark, #0F172A)" }}>
                    Pemisahan Lapis Arsitektur (Separation of Concerns)
                  </span>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: 999,
                      backgroundColor: "rgba(139, 92, 246, 0.12)",
                      color: "var(--c-coroutine, #8B5CF6)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    COROUTINES STANDARD
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #1E293B)", lineHeight: 1.5 }}>
                  Di Modul 08, ViewModel tidak lagi bergantung pada Compose runtime. State disimpan sebagai aliran data <code>StateFlow</code> yang independen dan dapat dikonsumsi oleh platform mana pun.
                </p>
              </div>
            )}

            {/* Kartu State 15: Single Source of Truth & Enkapsulasi */}
            {isState15 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 18,
                  border: "1.5px solid var(--c-vm, #F97316)",
                  boxShadow: "0 8px 24px rgba(249, 115, 22, 0.12)",
                  padding: "18px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-dark, #0F172A)" }}>
                    Aturan Enkapsulasi: _uiState (Private) vs uiState (Public)
                  </span>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: 999,
                      backgroundColor: "rgba(22, 163, 74, 0.12)",
                      color: "var(--life-active, #16A34A)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    BEST PRACTICE
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #1E293B)", lineHeight: 1.5 }}>
                  Hanya ViewModel yang berhak mengubah state melalui <code>_uiState.value = ...</code>. UI Composable hanya membaca aliran read-only <code>uiState.asStateFlow()</code> agar data tidak bisa dirusak dari luar.
                </p>
              </div>
            )}

            {/* Kartu State 16: Bahaya Akses .value di Composable */}
            {isState16 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#2B1B1B",
                  borderRadius: 18,
                  border: "2px solid var(--err, #DC2626)",
                  boxShadow: "0 10px 28px rgba(220, 38, 38, 0.3)",
                  padding: "18px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transform: `scale(${interpolate(spring2, [0, 1], [0.96, 1])})`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <AlertTriangle size={26} color="#EF4444" />
                  <span
                    style={{
                      fontSize: 19,
                      fontWeight: 800,
                      color: "#EF4444",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    Bahaya: Recomposition Tidak Terpemicu!
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 16, color: "#FFFFFF", lineHeight: 1.5 }}>
                  Membaca <code>.value</code> langsung di Composable adalah pembacaan statis satu kali. Ketika ViewModel memuat data mahasiswa dari server, layar tidak akan pernah ter-update!
                </p>
              </div>
            )}

            {/* Kartu State 17: Koleksi Sadar Siklus Hidup */}
            {isState17 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 18,
                  border: "2px solid var(--life-active, #16A34A)",
                  boxShadow: "0 10px 28px rgba(22, 163, 74, 0.18)",
                  padding: "18px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  opacity: interpolate(spring3, [0, 1], [0, 1]),
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CheckCircle2 size={26} color="var(--life-active, #16A34A)" />
                  <span
                    style={{
                      fontSize: 19,
                      fontWeight: 800,
                      color: "var(--life-active, #16A34A)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    ✓ collectAsStateWithLifecycle(): Koleksi Sadar Daur Hidup
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #0F172A)", lineHeight: 1.5 }}>
                  Fungsi dari <code>androidx.lifecycle.compose</code> ini mengonversi <code>StateFlow</code> menjadi Compose <code>State</code> secara aman. Setiap emisi baru dari ViewModel langsung memicu recomposition otomatis pada <code>HomeScreen</code>.
                </p>
              </div>
            )}

            {/* Kartu State 18: Penghematan Baterai Saat Background */}
            {isState18 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 18,
                  border: "2px solid var(--life-idle, #F59E0B)",
                  boxShadow: "0 10px 28px rgba(245, 158, 11, 0.2)",
                  padding: "18px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  opacity: interpolate(spring4, [0, 1], [0, 1]),
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <BatteryCharging size={26} color="var(--life-idle, #F59E0B)" />
                  <span
                    style={{
                      fontSize: 19,
                      fontWeight: 800,
                      color: "var(--life-idle, #F59E0B)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    Efisiensi Energi: Aliran Dihentikan di Bawah STARTED
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #0F172A)", lineHeight: 1.5 }}>
                  Ketika aplikasi di-minimize atau layar terkunci, pengoleksian state dibatalkan secara otomatis. Coroutine di ViewModel berhenti memproses emisi yang tidak terlihat, menghemat daya baterai pengguna.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { interpolate, spring } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { EditorWindow } from "../components/EditorWindow";
import { CodeBlock } from "../components/CodeBlock";
import { ParentChildTree } from "../components/ParentChildTree";
import { VM_LAUNCH_CODE } from "../assets/code";
import { Workflow, ShieldAlert, CheckCircle2, AlertOctagon } from "lucide-react";

const CODE_STANDBY = `class HomeViewModel(
    private val repository: StudentRepository
) : ViewModel() {

    fun loadStudents() {
        // Meluncurkan pekerjaan anak yang terikat pada viewModelScope
        viewModelScope.launch {
            _uiState.value = HomeUiState(isLoading = true)
            val students = repository.getStudents()
            _uiState.value = HomeUiState(students = students)
        }
    }
}`;

const CODE_WRONG_CATCH = `fun loadStudents() {
    viewModelScope.launch {
        _uiState.value = HomeUiState(isLoading = true)
        try {
            val students = repository.getStudents()
            _uiState.value = HomeUiState(students = students)
        } catch (e: Exception) {
            // SALAH: CancellationException ikut tertelan di sini!
            // Coroutine mengira terjadi error jaringan biasa
            _uiState.value = HomeUiState(errorMessage = e.message)
        }
    }
}`;

/**
 * Scene 3: Disiplin Structured Concurrency & viewModelScope (State 9 - 13)
 * Sesuai spesifikasi docs/02-storyboard.md Scene 3 & docs/06-acceptance.md C.9-13.
 */
export const Scene3Structured: React.FC = () => {
  const pStop0 = useStopProgress("structured", 0);
  const pStop1 = useStopProgress("structured", 1);
  const pStop2 = useStopProgress("structured", 2);
  const pStop3 = useStopProgress("structured", 3);
  const pStop4 = useStopProgress("structured", 4);

  // Easing pegas
  const spring0 = spring({ frame: pStop0 * 24, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring2 = spring({ frame: pStop2 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring3 = spring({ frame: pStop3 * 36, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring4 = spring({ frame: pStop4 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });

  // Status Tree
  const isCancelled = pStop2 > 0;
  const isRunning = pStop1 > 0 && !isCancelled;
  const treeStatus: "idle" | "running" | "cancelled" = isCancelled
    ? "cancelled"
    : isRunning
      ? "running"
      : "idle";

  // Getaran peringatan bahaya (±4px, 3 siklus) pada State 12 (Stop 3)
  const isWarningState = pStop3 > 0.05 && pStop4 <= 0.1;
  const warningShake = isWarningState ? Math.sin(pStop3 * Math.PI * 6) * 4 : 0;

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
      {/* Header Scene 3 */}
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
              backgroundColor: "rgba(139, 92, 246, 0.12)",
              border: "1px solid rgba(139, 92, 246, 0.35)",
              color: "var(--c-coroutine, #8B5CF6)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            <Workflow size={16} />
            <span>Scene 3: Structured Concurrency & viewModelScope</span>
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
            Structured Concurrency & Batas Siklus Hidup
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "var(--text-muted, #64748B)",
              margin: "6px 0 0 0",
            }}
          >
            Hierarki Induk-Anak viewModelScope, Pembatalan Otomatis, & Aturan Mutlak CancellationException
          </p>
        </div>
      </div>

      {/* Konten 2 Kolom (y = 205px) */}
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
        {/* KOLOM KIRI: POHON HIERARKI INDUK-ANAK (800px) */}
        {/* ============================================================== */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transform: `scale(${interpolate(spring0, [0, 1], [0.95, 1])})`,
          }}
        >
          {/* Card Pohon Hierarki */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              border: "1.5px solid rgba(15, 23, 42, 0.1)",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 460,
              position: "relative",
            }}
          >
            <ParentChildTree
              status={treeStatus}
              laserSweepProgress={pStop2}
              hasWarning={isWarningState}
              warningShake={warningShake}
              childLabel="Job #1: loadStudents()"
            />

            {/* Simulasi Tombol Back ditekan saat Pembatalan di State 11 */}
            {pStop2 > 0 && pStop3 <= 0.1 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 16px",
                  borderRadius: 999,
                  backgroundColor: "rgba(220, 38, 38, 0.1)",
                  color: "var(--c-cancel, #EF4444)",
                  fontSize: 13,
                  fontWeight: 700,
                  opacity: interpolate(spring2, [0, 1], [0, 1]),
                }}
              >
                <AlertOctagon size={16} />
                <span>Pengguna Menekan Back ➔ ViewModel.onCleared() Dipicu</span>
              </div>
            )}
          </div>

          {/* Kotak Edukasi Structured Concurrency */}
          <div
            style={{
              padding: "16px 22px",
              borderRadius: 16,
              backgroundColor: "rgba(15, 23, 42, 0.04)",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: "rgba(139, 92, 246, 0.12)",
                color: "var(--c-coroutine, #8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Workflow size={20} />
            </div>
            <div style={{ fontSize: 16, color: "var(--text-dark, #0F172A)", lineHeight: 1.5 }}>
              <strong>Prinsip Structured Concurrency:</strong> Tidak ada coroutine yang berjalan secara liar tanpa atasan. Saat ViewModel dihancurkan, seluruh pekerjaan anak dibatalkan seketika.
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* KOLOM KANAN: PANEL KODE DRACULA & BLOK CATCH (920px) */}
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
            {/* Editor State 9 - 11: Deklarasi & Launch */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: interpolate(pStop3, [0, 0.7], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                pointerEvents: pStop3 > 0.5 ? "none" : "auto",
              }}
            >
              <EditorWindow tabTitle="HomeViewModel.kt — Structured Launch" style={{ width: "100%", height: 440 }}>
                <div style={{ padding: "18px 22px" }}>
                  <CodeBlock
                    code={CODE_STANDBY}
                    fontSize={17}
                    lineHeight={1.4}
                    lineEmphasis={(idx) => {
                      // Sorot viewModelScope.launch saat aktif (State 10: pStop1 > 0)
                      if (pStop1 > 0 && idx >= 6 && idx <= 10) {
                        return { background: "rgba(22, 163, 74, 0.18)" };
                      }
                      return 1;
                    }}
                  />
                </div>
              </EditorWindow>
            </div>

            {/* Editor State 12: Blok catch Exception SALAH */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: pStop3 > 0 && pStop4 <= 0.1 ? interpolate(pStop3, [0.3, 1], [0, 1]) : 0,
                transform: `scale(${interpolate(spring3, [0, 1], [0.96, 1])})`,
                pointerEvents: isWarningState ? "auto" : "none",
                display: pStop3 > 0 && pStop4 <= 0.1 ? "block" : "none",
              }}
            >
              <EditorWindow tabTitle="HomeViewModel.kt — BAHAYA: Exception Tertelan" style={{ width: "100%", height: 440 }}>
                <div style={{ padding: "18px 22px" }}>
                  <CodeBlock
                    code={CODE_WRONG_CATCH}
                    fontSize={17}
                    lineHeight={1.4}
                    lineEmphasis={(idx) => {
                      if (idx >= 6 && idx <= 9) {
                        return { background: "rgba(220, 38, 38, 0.28)" };
                      }
                      return 1;
                    }}
                  />
                </div>
              </EditorWindow>
            </div>

            {/* Editor State 13: Blok catch BENAR Modul 08 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: interpolate(pStop4, [0.2, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `scale(${interpolate(spring4, [0, 1], [0.96, 1])})`,
                pointerEvents: pStop4 > 0.1 ? "auto" : "none",
                display: pStop4 > 0.1 ? "block" : "none",
              }}
            >
              <EditorWindow tabTitle="HomeViewModel.kt — ATURAN MUTLAK MODUL 08" style={{ width: "100%", height: 440 }}>
                <div style={{ padding: "18px 22px" }}>
                  <CodeBlock
                    code={VM_LAUNCH_CODE}
                    fontSize={16}
                    lineHeight={1.38}
                    lineEmphasis={(idx) => {
                      // Sorot baris catch (e: CancellationException) { throw e } (baris 7..8 -> index 6..7)
                      if (idx >= 6 && idx <= 7) {
                        return { background: "rgba(22, 163, 74, 0.3)" };
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
            {/* Kartu Status Standar (State 9 - 11) */}
            {pStop3 <= 0.1 && (
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
                    {isCancelled
                      ? "Pembersihan Otomatis Saat Layar Ditutup"
                      : isRunning
                        ? "Pekerjaan Asinkron Terikat pada Scope"
                        : "Deklarasi ViewModel & Scope"}
                  </span>
                  <span
                    style={{
                      padding: "5px 14px",
                      borderRadius: 999,
                      backgroundColor: isCancelled
                        ? "rgba(220, 38, 38, 0.12)"
                        : isRunning
                          ? "rgba(22, 163, 74, 0.12)"
                          : "rgba(15, 23, 42, 0.08)",
                      color: isCancelled
                        ? "var(--c-cancel, #EF4444)"
                        : isRunning
                          ? "var(--life-active, #16A34A)"
                          : "var(--text-muted, #64748B)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {isCancelled ? "CANCELLED" : isRunning ? "RUNNING" : "STANDBY"}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #1E293B)", lineHeight: 1.5 }}>
                  {isCancelled
                    ? "Ketika layar ditutup, onCleared() otomatis membatalkan Job #1 melalui CancellationException di balik layar. Bebas memory leak!"
                    : "viewModelScope.launch melahirkan coroutine anak. Jika ViewModel hancur, pekerjaan langsung dibatalkan."}
                </p>
              </div>
            )}

            {/* Kartu Bahaya Peringatan Swallowing Exception (State 12) */}
            {isWarningState && (
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
                  transform: `translateX(${warningShake}px)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <ShieldAlert size={26} color="#EF4444" />
                  <span
                    style={{
                      fontSize: 19,
                      fontWeight: 800,
                      color: "#EF4444",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    Peringatan: CancellationException Ikut Tertelan!
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 16, color: "#FFFFFF", lineHeight: 1.5 }}>
                  Pembatalan Coroutine bekerja dengan melempar <code>CancellationException</code>. Jika ditelan oleh <code>catch (e: Exception)</code> biasa, coroutine mengira terjadi error jaringan biasa dan menampilkan pesan gagal palsu di layar!
                </p>
              </div>
            )}

            {/* Kartu Sukses Aturan Mutlak Modul 08 (State 13) */}
            {pStop4 > 0.1 && (
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
                  opacity: interpolate(spring4, [0, 1], [0, 1]),
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
                    ✓ Structured Cancellation Terjaga (Aturan Mutlak Modul 08)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #0F172A)", lineHeight: 1.5 }}>
                  Klausul wajib: <code>catch (e: CancellationException) &#123; throw e &#125;</code> harus ditaruh sebelum catch umum agar sinyal pembatalan diteruskan ke hierarki atas dan coroutine berhenti dengan bersih.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


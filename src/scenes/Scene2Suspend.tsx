import React from "react";
import { interpolate, spring } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { EditorWindow } from "../components/EditorWindow";
import { CodeBlock } from "../components/CodeBlock";
import { BookmarkIndicator } from "../components/BookmarkIndicator";
import { COMPARE_CALLBACK, COMPARE_COROUTINE } from "../assets/code";
import { ShieldCheck, Sparkles, Activity } from "lucide-react";

const CODE_TRY_CATCH = `viewModelScope.launch {
    try {
        val data = repository.getStudents()
        updateUi(data)
    } catch (e: Exception) {
        showError(e)
    }
}`;

const CODE_MAIN_SAFE = `class StudentRemoteDataSource(private val api: StudentApiService) {
    // SUDAH MAIN-SAFE: Retrofit secara otomatis mengalihkan request ke threadpool internal
    suspend fun getStudents(): List<UserDto> =
        api.getUsers(limit = 10).users
}`;

/**
 * Scene 2: Konsep Suspend & Analogi Pembatas Buku (State 4 - 8)
 * Sesuai spesifikasi docs/02-storyboard.md Scene 2 & docs/06-acceptance.md C.4-8.
 */
export const Scene2Suspend: React.FC = () => {
  const pStop0 = useStopProgress("suspend", 0);
  const pStop1 = useStopProgress("suspend", 1);
  const pStop2 = useStopProgress("suspend", 2);
  const pStop3 = useStopProgress("suspend", 3);
  const pStop4 = useStopProgress("suspend", 4);

  // Easing pegas
  const spring0 = spring({ frame: pStop0 * 24, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring1 = spring({ frame: pStop1 * 36, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring2 = spring({ frame: pStop2 * 36, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring3 = spring({ frame: pStop3 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring4 = spring({ frame: pStop4 * 24, fps: FPS, config: { stiffness: 120, damping: 14 } });

  // Opacity editor kiri saat fokus ke editor kanan
  const leftEditorOpacity = interpolate(pStop1, [0, 1], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animasi BookmarkIndicator: bookmarkPause (Stop 1) lalu bookmarkResume (Stop 2)
  const bookmarkY =
    pStop2 > 0
      ? interpolate(spring2, [0, 1], [0, -36])
      : interpolate(spring1, [0, 1], [-60, 0]);

  const bookmarkScale =
    pStop2 > 0
      ? interpolate(spring2, [0, 1], [1, 1.1])
      : interpolate(spring1, [0, 1], [0.85, 1]);

  const bookmarkOpacity =
    pStop2 > 0
      ? interpolate(pStop2, [0, 0.65], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : interpolate(pStop1, [0, 0.3], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const isBookmarkGlow = pStop2 > 0.1 && pStop2 < 0.8;

  // Status Badge di bawah
  const isSuspended = pStop1 > 0.5 && pStop2 < 0.3;
  const isResumed = pStop2 >= 0.3 && pStop3 < 0.5;

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
      {/* Header Scene 2 */}
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
              backgroundColor: "rgba(234, 179, 8, 0.12)",
              border: "1px solid rgba(234, 179, 8, 0.35)",
              color: "var(--text-dark, #0F172A)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            <Sparkles size={16} color="var(--c-bookmark, #EAB308)" />
            <span>Scene 2: Konsep Suspend & Analogi Pembatas Buku</span>
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
            Kotlin Coroutines: Pause & Resume Tanpa Memblokir
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "var(--text-muted, #64748B)",
              margin: "6px 0 0 0",
            }}
          >
            Penangguhan Kooperatif, Pembatas Buku (*Bookmark*), & Integritas Main-Safety Retrofit
          </p>
        </div>
      </div>

      {/* Konten 2 Jendela Editor Berdampingan (y = 200px) */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          display: "flex",
          gap: "var(--gap, 40px)",
        }}
      >
        {/* ============================================================== */}
        {/* EDITOR KIRI: CALLBACK MODUL 07 (860px) */}
        {/* ============================================================== */}
        <div
          style={{
            flex: 1,
            opacity: leftEditorOpacity,
            transform: `scale(${interpolate(spring0, [0, 1], [0.95, 1])})`,
          }}
        >
          <EditorWindow tabTitle="Modul 07 — Callback (Inverted Flow)" style={{ width: "100%", height: 490 }}>
            <div style={{ padding: "20px 24px" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "5px 14px",
                  borderRadius: 6,
                  backgroundColor: "rgba(220, 38, 38, 0.15)",
                  color: "var(--err, #DC2626)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                Kerapuhan Callback: Alur Terbalik & Kurung Kurawal
              </div>
              <CodeBlock code={COMPARE_CALLBACK} fontSize={20} lineHeight={1.5} />
            </div>
          </EditorWindow>
        </div>

        {/* ============================================================== */}
        {/* EDITOR KANAN: COROUTINE MODUL 08 (860px) DENGAN PITA BOOKMARK */}
        {/* ============================================================== */}
        <div
          style={{
            flex: 1,
            position: "relative",
            transform: `scale(${interpolate(spring0, [0, 1], [0.95, 1])})`,
          }}
        >
          {/* Versi State 4, 5, 6: COMPARE_COROUTINE */}
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
            <EditorWindow tabTitle="Modul 08 — Coroutine (Linear Non-Blocking)" style={{ width: "100%", height: 490 }}>
              <div style={{ padding: "20px 24px", position: "relative" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "5px 14px",
                    borderRadius: 6,
                    backgroundColor: "rgba(139, 92, 246, 0.15)",
                    color: "var(--c-coroutine, #8B5CF6)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  Linear Asinkron: Dibaca Lurus dari Atas ke Bawah
                </div>

                <CodeBlock
                  code={COMPARE_COROUTINE}
                  fontSize={20}
                  lineHeight={1.5}
                  lineEmphasis={(idx) => {
                    // Baris 2: val data = repository.getStudents() (index 1)
                    if (pStop1 > 0 && idx === 1) {
                      return { background: "rgba(234, 179, 8, 0.22)", opacity: 1 };
                    }
                    // Baris 3: updateUi(data) (index 2) menyala di State 6
                    if (pStop2 > 0 && idx === 2) {
                      return { background: "rgba(22, 163, 74, 0.22)", opacity: 1 };
                    }
                    return 1;
                  }}
                />

                {/* Ornamen Pita Pembatas Buku (BookmarkIndicator) */}
                {pStop1 > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      left: 14,
                      top: 86, // Tepat di tepi baris ke-2 (suspend fun)
                      transform: `translateY(${bookmarkY}px) scale(${bookmarkScale})`,
                      opacity: bookmarkOpacity,
                      pointerEvents: "none",
                      zIndex: 30,
                    }}
                  >
                    <BookmarkIndicator label="SUSPEND" glow={isBookmarkGlow} />
                  </div>
                )}
              </div>
            </EditorWindow>
          </div>

          {/* Versi State 7 & 8: Blok try-catch Alami */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: interpolate(pStop3, [0.3, 1], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `scale(${interpolate(spring3, [0, 1], [0.96, 1])})`,
              pointerEvents: pStop3 > 0.5 ? "auto" : "none",
            }}
          >
            <EditorWindow tabTitle="HomeViewModel.kt — Blok Alami try-catch" style={{ width: "100%", height: 490 }}>
              <div style={{ padding: "20px 24px" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "5px 14px",
                    borderRadius: 6,
                    backgroundColor: "rgba(22, 163, 74, 0.15)",
                    color: "var(--life-active, #16A34A)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  ✓ Penanganan Error Alami Kotlin (Tanpa Pembungkus Result)
                </div>

                <CodeBlock
                  code={CODE_TRY_CATCH}
                  fontSize={18}
                  lineHeight={1.45}
                  lineEmphasis={(idx) => {
                    // Sorot blok try-catch
                    if (idx >= 1 && idx <= 5) {
                      return { background: "rgba(22, 163, 74, 0.12)" };
                    }
                    return 1;
                  }}
                />
              </div>
            </EditorWindow>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BAGIAN BAWAH: LINTASAN MAIN THREAD (State 4-7) ATAU MITOS RETROFIT (State 8) */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          height: 170,
        }}
      >
        {/* LINTASAN MAIN THREAD & BACKGROUND (State 4 - 7) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: interpolate(pStop4, [0, 0.7], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            pointerEvents: pStop4 > 0.5 ? "none" : "auto",
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            border: "1.5px solid rgba(15, 23, 42, 0.1)",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            padding: "20px 28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Activity size={24} color="var(--c-ui, #3B82F6)" />
              <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-dark, #0F172A)" }}>
                Jalur Eksekusi Main Thread (UI Renderer)
              </span>
            </div>

            {/* Status Chip Dinamis */}
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  padding: "6px 16px",
                  borderRadius: 999,
                  backgroundColor: "rgba(22, 163, 74, 0.15)",
                  color: "var(--life-active, #16A34A)",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                UI Tetap Responsif (Non-Blocking)
              </div>

              {isSuspended && (
                <div
                  style={{
                    padding: "6px 16px",
                    borderRadius: 999,
                    backgroundColor: "rgba(234, 179, 8, 0.2)",
                    color: "var(--text-dark, #0F172A)",
                    fontSize: 14,
                    fontWeight: 700,
                    border: "1px solid var(--c-bookmark, #EAB308)",
                  }}
                >
                  ⏸ Thread Dilepas (Suspended)
                </div>
              )}

              {isResumed && (
                <div
                  style={{
                    padding: "6px 16px",
                    borderRadius: 999,
                    backgroundColor: "rgba(139, 92, 246, 0.15)",
                    color: "var(--c-coroutine, #8B5CF6)",
                    fontSize: 14,
                    fontWeight: 700,
                    border: "1px solid var(--c-coroutine, #8B5CF6)",
                  }}
                >
                  ▶ Melanjutkan Eksekusi (Resumed)
                </div>
              )}
            </div>
          </div>

          {/* Rel Garis Waktu */}
          <div style={{ position: "relative", height: 32, display: "flex", alignItems: "center" }}>
            {/* Garis Horizontal Main Thread */}
            <div
              style={{
                width: "100%",
                height: 6,
                borderRadius: 999,
                backgroundColor: "var(--c-ui, #3B82F6)",
                boxShadow: "0 0 12px rgba(59, 130, 246, 0.3)",
              }}
            />
            {/* Titik Penangguhan Bookmark di Tengah */}
            <div
              style={{
                position: "absolute",
                left: "65%",
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: isSuspended ? "var(--c-bookmark, #EAB308)" : "var(--life-active, #16A34A)",
                transform: "translate(-50%, 0)",
                boxShadow: "0 0 14px rgba(234, 179, 8, 0.8)",
                border: "2px solid #FFFFFF",
              }}
            />
          </div>

          <div style={{ fontSize: 15, color: "var(--text-dark, #0F172A)", lineHeight: 1.4 }}>
            {pStop3 > 0.1
              ? "💡 Di State 7, penanganan error kembali ke blok try-catch alami Kotlin tanpa Result.success / Result.failure."
              : "💡 Coroutine menaruh pembatas buku di baris suspend, lalu melepaskan thread agar tetap menggambar UI tanpa macet."}
          </div>
        </div>

        {/* PENETAPAN ARSITEKTUR: MITOS DISPATCHERS.IO PADA RETROFIT (State 8) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: interpolate(pStop4, [0.2, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(spring4, [0, 1], [24, 0])}px)`,
            pointerEvents: pStop4 > 0.5 ? "auto" : "none",
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            border: "2px solid var(--c-bookmark, #EAB308)",
            boxShadow: "0 12px 36px rgba(234, 179, 8, 0.2)",
            padding: "18px 26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                backgroundColor: "rgba(234, 179, 8, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-dark, #0F172A)",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={34} color="var(--c-bookmark, #EAB308)" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "var(--text-dark, #0F172A)" }}>
                  Mitos Dispatchers.IO pada Retrofit
                </span>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 999,
                    backgroundColor: "rgba(22, 163, 74, 0.15)",
                    color: "var(--life-active, #16A34A)",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  SUDAH MAIN-SAFE
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #1E293B)", lineHeight: 1.5, maxWidth: 650 }}>
                Fungsi <code>suspend</code> Retrofit secara internal sudah dialihkan ke background thread. <strong>Dilarang</strong> menambahkan pembungkus <code>withContext(Dispatchers.IO)</code> secara manual!
              </p>
            </div>
          </div>

          {/* Cuplikan Kode Main-Safe Ringkas */}
          <div
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              backgroundColor: "var(--editor-bg, #282A36)",
              color: "var(--text-light, #F8F8F2)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              maxWidth: 740,
              flexShrink: 0,
            }}
          >
            <div style={{ color: "#50FA7B", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              ✓ StudentRemoteDataSource.kt (Main-Safe)
            </div>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{CODE_MAIN_SAFE}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};


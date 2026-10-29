import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { EXECUTE_CODE, ASYNC_CODE, ENQUEUE_CODE, VM_CODE } from "../assets/code";

export const Scene5Async: React.FC = () => {
  const frame = useCurrentFrame();

  // 6 Stops untuk scene 'async':
  // Stop 0: State 17 (frame 546..570, durasi 24)
  // Stop 1: State 18 (frame 570..606, durasi 36)
  // Stop 2: State 19 (frame 606..642, durasi 36)
  // Stop 3: State 20 (frame 642..678, durasi 36)
  // Stop 4: State 21 (frame 678..714, durasi 36)
  // Stop 5: State 22 (frame 714..750, durasi 36)
  const pStop0 = useStopProgress("async", 0);
  const pStop1 = useStopProgress("async", 1);
  const pStop2 = useStopProgress("async", 2);
  const pStop3 = useStopProgress("async", 3);
  const pStop4 = useStopProgress("async", 4);
  const pStop5 = useStopProgress("async", 5);

  // Balok-balok gambar layar (48x48) pada jalur utama
  // Pada Stop 1 (pStop1 > 0 dan pStop2 === 0), balok terhenti (freeze)
  const isFrozen = pStop1 > 0 && pStop2 === 0;
  const blockMotionFrame = isFrozen ? 580 : frame;
  const baseBlockOffset = (blockMotionFrame * 4) % 120;

  // Spring animation untuk elemen pop-in:
  const sprDoor = spring({
    frame: pStop3 * 36,
    fps: FPS,
    config: { stiffness: 150, damping: 14 },
  });

  const sprGate = spring({
    frame: pStop4 * 36,
    fps: FPS,
    config: { stiffness: 160, damping: 14 },
  });

  const sprReturnToken = spring({
    frame: pStop5 * 36,
    fps: FPS,
    config: { stiffness: 140, damping: 12 },
  });

  // Tentukan kode dan baris kunci yang aktif di panel bawah:
  let activeCode = "";
  let activeTitle = "";
  let activeKeyLines: number[] = [];
  let isErrorStatus = false;

  if (pStop1 > 0 && pStop2 === 0) {
    // State 18
    activeCode = EXECUTE_CODE;
    activeTitle = "CONTOH SALAH (SINKRON DI MAIN THREAD)";
    activeKeyLines = [2];
    isErrorStatus = true;
  } else if (pStop2 > 0 && pStop3 === 0) {
    // State 19
    activeCode = ASYNC_CODE;
    activeTitle = "CONTOH BENAR (ASINKRON DENGAN ENQUEUE)";
    activeKeyLines = [1, 2];
    isErrorStatus = false;
  } else if (pStop3 > 0 && pStop4 === 0) {
    // State 20
    activeCode = ENQUEUE_CODE;
    activeTitle = "data/remote/StudentApiService.kt · Call.enqueue Callback";
    activeKeyLines = [2, 10];
    isErrorStatus = false;
  } else if (pStop4 > 0 && pStop5 === 0) {
    // State 21
    activeCode = ENQUEUE_CODE;
    activeTitle = "data/remote/StudentApiService.kt · Validasi Status Code & Body";
    activeKeyLines = [4, 5, 7];
    isErrorStatus = false;
  } else if (pStop5 > 0) {
    // State 22
    activeCode = VM_CODE;
    activeTitle = "ui/home/HomeViewModel.kt · Konsumsi Result di ViewModel";
    activeKeyLines = [3, 5];
    isErrorStatus = false;
  }

  const codeLines = activeCode.split("\n");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "var(--bg-light, #F8FAFC)",
        color: "var(--text-dark, #0F172A)",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
        opacity: interpolate(pStop0, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {/* =================================================================== */}
      {/* 1. HEADER JUDUL & SUBJUDUL                                          */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "var(--text-dark, #0F172A)",
          }}
        >
          Kenapa Memakai enqueue?
        </h1>
        <p
          style={{
            fontSize: 26,
            color: "var(--text-muted, #64748B)",
            margin: 0,
            fontWeight: 500,
          }}
        >
          Non-Blocking Network Call &bull; Pemisahan Thread &bull; Standarisasi Result
        </p>
      </div>

      {/* =================================================================== */}
      {/* 2. DUA LAJUR WAKTU HORIZONTAL (y = 160 s.d. 480)                    */}
      {/* =================================================================== */}

      {/* LAJUR 1: JALUR UTAMA (UI THREAD) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 160,
          width: 1760,
          height: 120,
          backgroundColor: isFrozen ? "rgba(220, 38, 38, 0.08)" : "#FFFFFF",
          borderRadius: 18,
          border: isFrozen
            ? "3px solid var(--err, #DC2626)"
            : "2px solid rgba(15, 23, 42, 0.15)",
          boxShadow: isFrozen
            ? "0 8px 30px rgba(220, 38, 38, 0.2)"
            : "0 6px 20px rgba(0, 0, 0, 0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          boxSizing: "border-box",
          overflow: "hidden",
          zIndex: 20,
        }}
      >
        {/* Belang-belang diagonal merah saat tersumbat (State 18) */}
        {isFrozen && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(220, 38, 38, 0.12), rgba(220, 38, 38, 0.12) 20px, rgba(220, 38, 38, 0.25) 20px, rgba(220, 38, 38, 0.25) 40px)",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Label Kiri Lajur Utama */}
        <div
          style={{
            width: 260,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            zIndex: 5,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, color: isFrozen ? "var(--err, #DC2626)" : "var(--text-dark, #0F172A)" }}>
            Jalur Utama (UI)
          </div>
          <div style={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted, #64748B)" }}>
            Main Thread · Render Layar
          </div>
        </div>

        {/* Aliran Balok Gambar Layar 48x48px */}
        <div
          style={{
            flex: 1,
            height: "100%",
            position: "relative",
            overflow: "hidden",
            zIndex: 4,
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
            const xPos = i * 120 + baseBlockOffset;
            const isReturnedBlock = pStop5 > 0 && i === 6;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: xPos,
                  top: 36,
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  backgroundColor: isFrozen
                    ? "var(--err, #DC2626)"
                    : isReturnedBlock
                    ? "var(--ok, #16A34A)"
                    : "var(--c-ui, #3B82F6)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: 800,
                  transition: "background-color 0.2s",
                }}
              >
                {isFrozen ? "✕" : isReturnedBlock ? "✓" : "📱"}
              </div>
            );
          })}
        </div>

        {/* Indikator Status di Ujung Kanan */}
        <div style={{ zIndex: 5, display: "flex", alignItems: "center", gap: 14 }}>
          {isFrozen && (
            <div
              style={{
                backgroundColor: "var(--err, #DC2626)",
                color: "#FFFFFF",
                padding: "8px 18px",
                borderRadius: 24,
                fontWeight: 800,
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
              }}
            >
              <span>❄️</span>
              <span>UI Membeku (ANR / Crash!)</span>
            </div>
          )}

          {pStop2 > 0 && pStop5 === 0 && (
            <div
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.12)",
                border: "2px solid var(--c-ui, #3B82F6)",
                padding: "6px 16px",
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                className="spinner"
                style={{
                  width: 24,
                  height: 24,
                  border: "3px solid rgba(59, 130, 246, 0.3)",
                  borderTopColor: "var(--c-ui, #3B82F6)",
                  borderRadius: "50%",
                }}
              />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "var(--c-ui, #1D4ED8)", fontSize: 17 }}>
                isLoading = true
              </span>
            </div>
          )}

          {pStop5 > 0 && (
            <div
              style={{
                backgroundColor: "rgba(22, 163, 74, 0.12)",
                border: "2px solid var(--ok, #16A34A)",
                padding: "6px 16px",
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 20 }}>🎉</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "var(--ok, #16A34A)", fontSize: 17 }}>
                uiState = Success(students)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* SVG KONEKTOR CABANG & LOMPATAN PARABOLA */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: 1920,
          height: 1080,
          pointerEvents: "none",
          zIndex: 22,
        }}
      >
        {/* Garis Cabang Melengkung dari Jalur Utama ke Jalur Jaringan (State 19+) */}
        {pStop2 > 0 && (
          <path
            d="M 380 280 C 380 340, 480 370, 580 370"
            fill="none"
            stroke="var(--c-ds, #1E3A8A)"
            strokeWidth={5}
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
        )}

        {/* Lompatan Parabola Return Token dari Jalur Jaringan kembali ke Jalur Utama (State 22) */}
        {pStop5 > 0 && (
          <g opacity={Math.min(1, sprReturnToken)}>
            <path
              d="M 1480 340 Q 1200 130 920 220"
              fill="none"
              stroke="var(--ok, #16A34A)"
              strokeWidth={6}
              strokeDasharray="8 6"
              strokeLinecap="round"
            />
            {/* Token Result yang melompat */}
            <circle cx={920} cy={220} r={16} fill="var(--ok, #16A34A)" />
          </g>
        )}
      </svg>

      {/* LAJUR 2: JALUR JARINGAN (BACKGROUND THREAD) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 310,
          width: 1760,
          height: 140,
          backgroundColor: "#FFFFFF",
          borderRadius: 18,
          border: "2px solid rgba(30, 58, 138, 0.2)",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          boxSizing: "border-box",
          zIndex: 20,
          opacity: pStop2 > 0 ? 1 : 0.35,
          transition: "opacity 0.2s",
        }}
      >
        {/* Label Kiri Jalur Jaringan */}
        <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--c-ds, #1E3A8A)" }}>
            Jalur Jaringan
          </div>
          <div style={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted, #64748B)" }}>
            Background Thread · OkHttp
          </div>
        </div>

        {/* Area Tengah: Lintasan Request & Callback DoorFork */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 40 }}>
          {pStop2 > 0 && pStop3 === 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  backgroundColor: "rgba(30, 58, 138, 0.1)",
                  padding: "10px 20px",
                  borderRadius: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--c-ds, #1E3A8A)",
                }}
              >
                GET /users?limit=10 sedang dieksekusi di background...
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "var(--ok, #16A34A)" }}>
                ✓ UI tidak terbebani
              </span>
            </div>
          )}

          {/* Komponen Pintu DoorFork (State 20 s.d. 22) */}
          {pStop3 > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                transform: `scale(${Math.min(1, sprDoor)})`,
                transformOrigin: "left center",
              }}
            >
              {/* Pintu onResponse & onFailure */}
              <div style={{ display: "flex", gap: 20 }}>
                {/* Pintu onResponse */}
                <div
                  style={{
                    width: 330,
                    height: 100,
                    borderRadius: 14,
                    backgroundColor: "#FFFFFF",
                    border: `4px solid ${pStop4 > 0 ? "var(--ok, #16A34A)" : "var(--c-ds, #1E3A8A)"}`,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 14px",
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 800, color: "var(--text-dark, #0F172A)" }}>
                    onResponse
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-muted, #64748B)", fontWeight: 500, marginTop: 2 }}>
                    Server membalas (status 200, 404, dll)
                  </span>
                </div>

                {/* Pintu onFailure */}
                <div
                  style={{
                    width: 330,
                    height: 100,
                    borderRadius: 14,
                    backgroundColor: "#FFFFFF",
                    border: "4px solid var(--err, #DC2626)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 14px",
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 800, color: "var(--err, #DC2626)" }}>
                    onFailure
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-muted, #64748B)", fontWeight: 500, marginTop: 2 }}>
                    Gagal sebelum ada balasan (koneksi mati)
                  </span>
                </div>
              </div>

              {/* Gerbang Diamond isSuccessful && body != null (State 21 s.d. 22) */}
              {pStop4 > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    transform: `scale(${Math.min(1, sprGate)})`,
                  }}
                >
                  {/* Belah Ketupat 56px */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      transform: "rotate(45deg)",
                      backgroundColor: "var(--editor-bg, #282A36)",
                      border: "3px solid #FFFFFF",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ transform: "rotate(-45deg)", color: "#50FA7B", fontSize: 20, fontWeight: 900 }}>
                      ?
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: "var(--text-dark, #0F172A)" }}>
                      isSuccessful && body != null
                    </div>

                    {/* Dua Muara Hasil */}
                    <div style={{ display: "flex", gap: 10 }}>
                      <span
                        style={{
                          backgroundColor: "rgba(22, 163, 74, 0.15)",
                          color: "var(--ok, #16A34A)",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 14,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                          border: "1px solid rgba(22, 163, 74, 0.3)",
                        }}
                      >
                        ✓ Result.success
                      </span>
                      <span
                        style={{
                          backgroundColor: "rgba(220, 38, 38, 0.15)",
                          color: "var(--err, #DC2626)",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 14,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                          border: "1px solid rgba(220, 38, 38, 0.3)",
                        }}
                      >
                        ✕ Result.failure
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. PANEL KODE DI AREA BAWAH (y = 480 s.d. 1010, tinggi 490px)       */}
      {/* =================================================================== */}
      {pStop1 === 0 ? (
        // State 17: Teks Pengantar
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 80,
            right: 80,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 700, color: "var(--text-dark, #0F172A)" }}>
            Permintaan jaringan butuh waktu dan berpotensi gagal.
          </div>
          <div style={{ fontSize: 30, color: "var(--text-muted, #64748B)", fontWeight: 500 }}>
            Bagaimana aplikasi Android menunggu balasan server tanpa mengorbankan kelancaran antarmuka?
          </div>
        </div>
      ) : (
        // State 18 s.d. 22: Panel Editor Kode dengan Dracula Theme
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 480,
            bottom: 50,
            backgroundColor: "var(--editor-bg, #282A36)",
            borderRadius: 18,
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.25)",
            border: isErrorStatus ? "3px solid var(--err, #DC2626)" : "2px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 30,
          }}
        >
          {/* Header Editor */}
          <div
            style={{
              height: 44,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FF5555" }} />
              <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FFB86C" }} />
              <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#50FA7B" }} />
              <span
                style={{
                  marginLeft: 14,
                  fontSize: 16,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: isErrorStatus ? "#FF5555" : "rgba(255, 255, 255, 0.8)",
                  fontWeight: 700,
                }}
              >
                {activeTitle}
              </span>
            </div>

            <span
              style={{
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                color: isErrorStatus ? "#FF5555" : "#50FA7B",
                fontWeight: 700,
                backgroundColor: isErrorStatus ? "rgba(220, 38, 38, 0.2)" : "rgba(80, 250, 123, 0.15)",
                padding: "3px 10px",
                borderRadius: 6,
              }}
            >
              {isErrorStatus ? "DILARANG DI ANDROID" : "RETROFIT BEST PRACTICE"}
            </span>
          </div>

          {/* Baris-baris Kode dengan Penyorotan keyLines */}
          <div
            style={{
              padding: "16px 24px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 22,
              lineHeight: 1.55,
              color: "#F8F8F2",
              overflowY: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              whiteSpace: "pre",
              tabSize: 4,
            }}
          >
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isKeyLine = activeKeyLines.includes(lineNum);

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: isKeyLine
                      ? isErrorStatus
                        ? "rgba(220, 38, 38, 0.3)"
                        : "rgba(255, 255, 255, 0.16)"
                      : "transparent",
                    borderRadius: 6,
                    padding: "2px 8px",
                    borderLeft: isKeyLine
                      ? isErrorStatus
                        ? "4px solid var(--err, #DC2626)"
                        : "4px solid #50FA7B"
                      : "4px solid transparent",
                    opacity: isKeyLine ? 1 : 0.65,
                    transition: "all 0.2s ease",
                    whiteSpace: "pre",
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      color: "rgba(255, 255, 255, 0.3)",
                      textAlign: "right",
                      marginRight: 18,
                      fontSize: 17,
                      userSelect: "none",
                      whiteSpace: "normal",
                    }}
                  >
                    {lineNum}
                  </span>
                  <span style={{ fontWeight: isKeyLine ? 700 : 400, whiteSpace: "pre" }}>{line}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React from "react";
import { interpolate } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { PhoneMock, PhoneScreenMode } from "../components/PhoneMock";
import { StatePanel } from "../components/StatePanel";
import { WHEN_CODE, STATE_STEPS, PHONE_ROWS } from "../assets/code";

export const Scene6States: React.FC = () => {
  // 5 Stops untuk scene 'states':
  // Stop 0: State 23 (frame 726..750, durasi 24)
  // Stop 1: State 24 (frame 750..780, durasi 30)
  // Stop 2: State 25 (frame 780..810, durasi 30)
  // Stop 3: State 26 (frame 810..834, durasi 24)
  // Stop 4: State 27 (frame 834..864, durasi 30)
  const pStop0 = useStopProgress("states", 0);
  const pStop1 = useStopProgress("states", 1);
  const pStop2 = useStopProgress("states", 2);
  const pStop3 = useStopProgress("states", 3);
  const pStop4 = useStopProgress("states", 4);

  // Tentukan state aktif index (0 s.d. 4)
  let activeStepIdx = 0;
  if (pStop4 > 0) {
    activeStepIdx = 4;
  } else if (pStop3 > 0) {
    activeStepIdx = 3;
  } else if (pStop2 > 0) {
    activeStepIdx = 2;
  } else if (pStop1 > 0) {
    activeStepIdx = 1;
  } else {
    activeStepIdx = 0;
  }

  const currentStep = STATE_STEPS[activeStepIdx];

  // Mode layar ponsel:
  let phoneMode: PhoneScreenMode = "empty";
  let buttonScale = 1;
  let rippleProgress = 0;

  if (activeStepIdx === 1) {
    phoneMode = "loading";
  } else if (activeStepIdx === 2) {
    phoneMode = "error";
  } else if (activeStepIdx === 3) {
    // Animasi tap tombol Coba Lagi pada Stop 3
    if (pStop3 < 0.4) {
      phoneMode = "error";
      buttonScale = interpolate(pStop3, [0, 0.2, 0.4], [1, 0.94, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      rippleProgress = interpolate(pStop3, [0.05, 0.4], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    } else {
      // Kembali ke loading setelah tombol ditekan
      phoneMode = "loading";
    }
  } else if (activeStepIdx === 4) {
    phoneMode = "success";
  }

  // Tentukan sorotan cabang pada kode when (12 baris):
  // Cabang 1: baris 2, 3, 4 (isLoading)
  // Cabang 2: baris 5, 6, 7, 8 (errorMessage != null)
  // Cabang 3: baris 9, 10, 11 (else / LazyColumn)
  let highlightedLines: number[] = [];
  if (currentStep.branch === 1) {
    highlightedLines = [2, 3, 4];
  } else if (currentStep.branch === 2) {
    highlightedLines = [5, 6, 7, 8];
  } else if (currentStep.branch === 3) {
    highlightedLines = [9, 10, 11];
  }

  // Tentukan activeField untuk StatePanel
  let activeStateField: "students" | "isLoading" | "errorMessage" | undefined =
    undefined;
  if (currentStep.branch === 1) {
    activeStateField = "isLoading";
  } else if (currentStep.branch === 2) {
    activeStateField = "errorMessage";
  } else if (currentStep.branch === 3) {
    activeStateField = "students";
  }

  const codeLines = WHEN_CODE.split("\n");

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
          top: 50,
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
          Tiga Kondisi Layar
        </h1>
        <p
          style={{
            fontSize: 26,
            color: "var(--text-muted, #64748B)",
            margin: 0,
            fontWeight: 500,
          }}
        >
          Layar Tidak Boleh Mengira Data Selalu Ada &bull; Loading, Error, dan
          Data
        </p>
      </div>

      {/* =================================================================== */}
      {/* 2. SISI KIRI: MOCKUP PONSEL (x=140, y=140, 440x800)                 */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 180,
          zIndex: 20,
        }}
      >
        <PhoneMock
          mode={phoneMode}
          title="Home"
          errorMessage='Unable to resolve host "dummyjson.com": No address associated with hostname'
          rows={PHONE_ROWS}
          buttonScale={buttonScale}
          rippleProgress={rippleProgress}
        />

        {/* Badge Chip WifiOff saat kondisi error (State 25) */}
        {activeStepIdx === 2 && (
          <div
            style={{
              position: "absolute",
              top: -16,
              right: -16,
              backgroundColor: "var(--err, #DC2626)",
              color: "#FFFFFF",
              padding: "8px 18px",
              borderRadius: 24,
              fontSize: 16,
              fontWeight: 800,
              boxShadow: "0 6px 20px rgba(220, 38, 38, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 30,
            }}
          >
            <span>📡</span>
            <span>Koneksi Terputus</span>
          </div>
        )}

        {/* Callout onRetry saat Coba Lagi ditekan (State 26) */}
        {activeStepIdx === 3 && (
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              color: "#FFFFFF",
              padding: "10px 20px",
              borderRadius: 12,
              fontSize: 16,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
              whiteSpace: "nowrap",
              zIndex: 30,
            }}
          >
            onRetry = homeViewModel::loadStudents
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 3. SISI KANAN: PANEL STATE & PANEL KODE WHEN (x=660, lebar=1180)    */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          left: 660,
          top: 160,
          width: 1180,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 20,
        }}
      >
        {/* Panel State Atas */}
        <StatePanel
          students={currentStep.students}
          isLoading={currentStep.isLoading}
          errorMessage={currentStep.errorMessage}
          activeField={activeStateField}
          style={{ width: "100%" }}
        />

        {/* Panel Kode when Bawah (12 baris) */}
        <div
          style={{
            width: "100%",
            height: 550,
            backgroundColor: "var(--editor-bg, #282A36)",
            borderRadius: 20,
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.25)",
            border: "1.5px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header Tab Editor */}
          <div
            style={{
              height: 48,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              justifyContent: "space-between",
              borderBottom: "1.5px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#FF5555",
                }}
              />
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#FFB86C",
                }}
              />
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#50FA7B",
                }}
              />
              <span
                style={{
                  marginLeft: 14,
                  fontSize: 18,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "rgba(255, 255, 255, 0.85)",
                  fontWeight: 600,
                }}
              >
                ui/home/HomeScreen.kt
              </span>
            </div>

            <span
              style={{
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                color: "#8BE9FD",
                fontWeight: 700,
                backgroundColor: "rgba(139, 233, 253, 0.12)",
                padding: "3px 12px",
                borderRadius: 6,
              }}
            >
              Compose Tri-State
            </span>
          </div>

          {/* Baris Kode when dengan Sorotan Cabang */}
          <div
            style={{
              padding: "20px 28px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 24,
              lineHeight: 1.6,
              color: "#F8F8F2",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              flex: 1,
              whiteSpace: "pre",
              tabSize: 4,
            }}
          >
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = highlightedLines.includes(lineNum);

              // Warna border khusus per cabang:
              let borderColor = "transparent";
              let bgHighlight = "transparent";

              if (isHighlighted) {
                if (currentStep.branch === 1) {
                  // Loading: Biru UI
                  borderColor = "var(--c-ui, #3B82F6)";
                  bgHighlight = "rgba(59, 130, 246, 0.18)";
                } else if (currentStep.branch === 2) {
                  // Error: Merah
                  borderColor = "var(--err, #DC2626)";
                  bgHighlight = "rgba(220, 38, 38, 0.22)";
                } else if (currentStep.branch === 3) {
                  // Success: Hijau
                  borderColor = "var(--ok, #16A34A)";
                  bgHighlight = "rgba(34, 197, 94, 0.18)";
                }
              }

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: bgHighlight,
                    borderRadius: 6,
                    padding: "2px 8px",
                    borderLeft: `5px solid ${borderColor}`,
                    opacity: isHighlighted ? 1 : 0.6,
                    transition: "all 0.2s ease",
                    whiteSpace: "pre",
                  }}
                >
                  <span
                    style={{
                      width: 32,
                      color: "rgba(255, 255, 255, 0.3)",
                      textAlign: "right",
                      marginRight: 20,
                      fontSize: 18,
                      userSelect: "none",
                      whiteSpace: "normal",
                    }}
                  >
                    {lineNum}
                  </span>
                  <span
                    style={{
                      fontWeight: isHighlighted ? 700 : 400,
                      whiteSpace: "pre",
                    }}
                  >
                    {line}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

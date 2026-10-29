import React from "react";
import { interpolate } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { ERRORS } from "../assets/code";
import { SymptomChip } from "../components/SymptomChip";

export const Scene7Errors: React.FC = () => {
  // 5 Stops untuk scene 'errors':
  // Stop 0: State 28 (frame 864..888, durasi 24)
  // Stop 1: State 29 (frame 888..918, durasi 30)
  // Stop 2: State 30 (frame 918..948, durasi 30)
  // Stop 3: State 31 (frame 948..978, durasi 30)
  // Stop 4: State 32 (frame 978..1008, durasi 30)
  const pStop0 = useStopProgress("errors", 0);
  const pStop1 = useStopProgress("errors", 1);
  const pStop2 = useStopProgress("errors", 2);
  const pStop3 = useStopProgress("errors", 3);
  const pStop4 = useStopProgress("errors", 4);

  // Tentukan error yang sedang aktif diuji:
  let activeErrorIdx = -1;
  let activeProgress = 0;

  if (pStop4 > 0) {
    activeErrorIdx = 3;
    activeProgress = pStop4;
  } else if (pStop3 > 0) {
    activeErrorIdx = 2;
    activeProgress = pStop3;
  } else if (pStop2 > 0) {
    activeErrorIdx = 1;
    activeProgress = pStop2;
  } else if (pStop1 > 0) {
    activeErrorIdx = 0;
    activeProgress = pStop1;
  }

  const currentError = activeErrorIdx >= 0 ? ERRORS[activeErrorIdx] : null;

  // Status pintu yang menyala:
  const isResponseActive = currentError?.door === "onResponse";
  const isFailureActive = currentError?.door === "onFailure";
  const isRdsFocused = currentError?.focus === "rds";

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
      {/* 1. HEADER JUDUL                                                     */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          zIndex: 10,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 50,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "var(--text-dark, #0F172A)",
            }}
          >
            Dari Mana Error Berasal?
          </h1>
          <p
            style={{
              fontSize: 24,
              color: "var(--text-muted, #64748B)",
              margin: "6px 0 0 0",
              fontWeight: 500,
            }}
          >
            Memetakan Gejala Troubleshooting Jaringan &bull; Jalur Callback &bull; Solusi Perbaikan
          </p>
        </div>

        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 16,
            fontWeight: 700,
            backgroundColor: "rgba(220, 38, 38, 0.12)",
            color: "var(--err, #DC2626)",
            padding: "8px 18px",
            borderRadius: 10,
            border: "1.5px solid rgba(220, 38, 38, 0.25)",
          }}
        >
          Semua Ujungnya: Result.failure
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. BARIS ATAS: 5 KOTAK LAPISAN RINGKAS (y = 140, 320x80px)          */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 140,
          display: "flex",
          justifyContent: "space-between",
          zIndex: 20,
        }}
      >
        {/* Kotak 1: UI */}
        <div
          style={{
            width: 320,
            height: 80,
            borderRadius: 14,
            backgroundColor: "var(--c-ui, #3B82F6)",
            color: "var(--on-ui, #FFFFFF)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            opacity: isRdsFocused ? 0.35 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700 }}>Composable UI</span>
          <span style={{ fontSize: 13, opacity: 0.85 }}>Layar / View</span>
        </div>

        {/* Kotak 2: ViewModel */}
        <div
          style={{
            width: 320,
            height: 80,
            borderRadius: 14,
            backgroundColor: "var(--c-vm, #F97316)",
            color: "var(--on-vm, #0F172A)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            opacity: isRdsFocused ? 0.35 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700 }}>ViewModel</span>
          <span style={{ fontSize: 13, opacity: 0.85 }}>State Holder</span>
        </div>

        {/* Kotak 3: Repository */}
        <div
          style={{
            width: 320,
            height: 80,
            borderRadius: 14,
            backgroundColor: "var(--c-repo, #22C55E)",
            color: "var(--on-repo, #0F172A)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            opacity: isRdsFocused ? 0.35 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700 }}>Repository</span>
          <span style={{ fontSize: 13, opacity: 0.85 }}>Akses Data Terpadu</span>
        </div>

        {/* Kotak 4: Remote Data Source (dapat difokuskan saat error JSON/DTO) */}
        <div
          style={{
            width: 320,
            height: 80,
            borderRadius: 14,
            backgroundColor: "var(--c-ds, #1E3A8A)",
            color: "var(--on-ds, #FFFFFF)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: isRdsFocused ? "4px solid #EF4444" : "none",
            boxShadow: isRdsFocused
              ? "0 0 0 6px rgba(239, 68, 68, 0.35), 0 12px 28px rgba(0,0,0,0.2)"
              : "0 4px 14px rgba(0,0,0,0.08)",
            transform: isRdsFocused ? "scale(1.05)" : "scale(1)",
            transition: "all 0.2s ease",
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700 }}>Remote Data Source</span>
          <span style={{ fontSize: 13, opacity: 0.85, fontFamily: "'JetBrains Mono', monospace" }}>
            Retrofit · Gson Parser
          </span>
        </div>

        {/* Kotak 5: REST API */}
        <div
          style={{
            width: 320,
            height: 80,
            borderRadius: 14,
            backgroundColor: "var(--c-api, #475569)",
            color: "var(--on-api, #FFFFFF)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "3px dashed rgba(255, 255, 255, 0.6)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            opacity: isRdsFocused ? 0.35 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700 }}>REST API</span>
          <span style={{ fontSize: 13, opacity: 0.85 }}>DummyJSON Server</span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. AREA TENGAH: DUA PINTU & KERANJANG RESULT (y = 260 s.d. 510)     */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 260,
          height: 250,
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          border: "2px solid rgba(15, 23, 42, 0.1)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 40px",
          zIndex: 20,
        }}
      >
        {/* Pintu 1: onResponse dengan Gerbang isSuccessful */}
        <div
          style={{
            width: 480,
            height: 190,
            borderRadius: 16,
            border: isResponseActive ? "5px solid var(--err, #DC2626)" : "3px solid rgba(15, 23, 42, 0.15)",
            backgroundColor: isResponseActive ? "rgba(220, 38, 38, 0.04)" : "var(--bg-light, #F8FAFC)",
            padding: "16px 24px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: isResponseActive ? "0 10px 28px rgba(220, 38, 38, 0.15)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800 }}>
              onResponse
            </span>
            <span style={{ fontSize: 13, color: "var(--text-muted, #64748B)", fontWeight: 600 }}>
              Server Membalas
            </span>
          </div>

          {/* Gerbang isSuccessful check */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              backgroundColor: "rgba(15, 23, 42, 0.04)",
              padding: "10px 14px",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                transform: "rotate(45deg)",
                backgroundColor: isResponseActive ? "var(--err, #DC2626)" : "#0F172A",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              <span style={{ transform: "rotate(-45deg)" }}>?</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700 }}>
              isSuccessful == false (HTTP 4xx / 5xx)
            </div>
          </div>

          <div style={{ fontSize: 15, color: "var(--err, #DC2626)", fontWeight: 600 }}>
            → Gagal status HTTP &bull; Dilempar ke Result.failure
          </div>
        </div>

        {/* Panah Tengah */}
        <div style={{ fontSize: 44, color: "var(--text-muted, #CBD5E1)", fontWeight: 800 }}>
          →
        </div>

        {/* Pintu 2: onFailure */}
        <div
          style={{
            width: 480,
            height: 190,
            borderRadius: 16,
            border: isFailureActive ? "5px solid var(--err, #DC2626)" : "3px solid rgba(15, 23, 42, 0.15)",
            backgroundColor: isFailureActive ? "rgba(220, 38, 38, 0.04)" : "var(--bg-light, #F8FAFC)",
            padding: "16px 24px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: isFailureActive ? "0 10px 28px rgba(220, 38, 38, 0.15)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 800, color: "var(--err, #DC2626)" }}>
              onFailure
            </span>
            <span style={{ fontSize: 13, color: "var(--err, #DC2626)", fontWeight: 700 }}>
              Gagal Tanpa Balasan
            </span>
          </div>

          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: "var(--text-muted, #64748B)",
              lineHeight: 1.4,
            }}
          >
            Terjadi sebelum server merespons: internet mati, domain salah, format tidak cocok, dsb.
          </div>

          <div style={{ fontSize: 15, color: "var(--err, #DC2626)", fontWeight: 600 }}>
            → Menangkap Throwable &bull; Dibungkus ke Result.failure(t)
          </div>
        </div>

        {/* Panah Tengah */}
        <div style={{ fontSize: 44, color: "var(--text-muted, #CBD5E1)", fontWeight: 800 }}>
          →
        </div>

        {/* Keranjang Tunggal: Result.failure */}
        <div
          style={{
            width: 420,
            height: 190,
            borderRadius: 16,
            backgroundColor: "rgba(220, 38, 38, 0.08)",
            border: "3px solid var(--err, #DC2626)",
            padding: "20px 24px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 32 }}>🗑️</span>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 800, color: "var(--err, #DC2626)" }}>
            Result.failure
          </div>
          <div style={{ fontSize: 14, color: "var(--text-muted, #64748B)", fontWeight: 500 }}>
            Satu muara untuk semua jenis kesalahan
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. AREA BAWAH: KARTU GEJALA & PERBAIKAN (y = 540 s.d. 1000)         */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 550,
          bottom: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 25,
        }}
      >
        {activeErrorIdx >= 0 && currentError ? (
          <SymptomChip
            symptom={currentError.symptom}
            fix={currentError.fix}
            progress={activeProgress}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: 1200,
            }}
          >
            <div style={{ fontSize: 42, fontWeight: 700, color: "var(--text-dark, #0F172A)" }}>
              Apa pun penyebab kegagalannya, hasilnya selalu bermuara ke satu bentuk:
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 32,
                fontWeight: 700,
                color: "var(--err, #DC2626)",
                backgroundColor: "rgba(220, 38, 38, 0.08)",
                padding: "12px 32px",
                borderRadius: 14,
                border: "2px solid rgba(220, 38, 38, 0.2)",
                alignSelf: "center",
              }}
            >
              Result.failure → errorMessage → Tampilkan Layar Error + Tombol Coba Lagi
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

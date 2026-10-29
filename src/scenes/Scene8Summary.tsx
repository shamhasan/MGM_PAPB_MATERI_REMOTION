import React from "react";
import { interpolate, spring } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { DIFFS, Layer } from "../assets/code";

export const Scene8Summary: React.FC = () => {
  // 6 Stops untuk scene 'summary':
  // Stop 0: State 33 (frame 1008..1032, durasi 24)
  // Stop 1: State 34 (frame 1032..1062, durasi 30)
  // Stop 2: State 35 (frame 1062..1092, durasi 30)
  // Stop 3: State 36 (frame 1092..1122, durasi 30)
  // Stop 4: State 37 (frame 1122..1152, durasi 30)
  // Stop 5: State 38 (frame 1152..1182, durasi 30) - settled hingga 1206
  const pStop0 = useStopProgress("summary", 0);
  const pStop1 = useStopProgress("summary", 1);
  const pStop2 = useStopProgress("summary", 2);
  const pStop3 = useStopProgress("summary", 3);
  const pStop4 = useStopProgress("summary", 4);
  const pStop5 = useStopProgress("summary", 5);

  // Tentukan stop aktif saat ini:
  let activeStopIdx = 0;
  if (pStop5 > 0) activeStopIdx = 5;
  else if (pStop4 > 0) activeStopIdx = 4;
  else if (pStop3 > 0) activeStopIdx = 3;
  else if (pStop2 > 0) activeStopIdx = 2;
  else if (pStop1 > 0) activeStopIdx = 1;

  // Layer yang aktif di tiap stop (Stop 1 = rds, Stop 2 = repo, Stop 3 = vm, Stop 4 = ui):
  const focusedLayer: Layer | null =
    activeStopIdx === 1
      ? "rds"
      : activeStopIdx === 2
        ? "repo"
        : activeStopIdx === 3
          ? "vm"
          : activeStopIdx === 4
            ? "ui"
            : null;

  // Lencana status per layer:
  const getBadgeForLayer = (layer: Layer) => {
    if (activeStopIdx === 0) return null;
    if (layer === "rds") return { text: "diganti", bg: "var(--c-ds, #1E3A8A)" };
    if (layer === "repo")
      return { text: "menyesuaikan", bg: "var(--c-repo, #22C55E)" };
    if (layer === "vm")
      return { text: "menyesuaikan", bg: "var(--c-vm, #F97316)" };
    if (layer === "ui")
      return { text: "hampir tetap", bg: "var(--c-ui, #3B82F6)" };
    if (layer === "api")
      return activeStopIdx === 5
        ? { text: "baru", bg: "var(--c-api, #475569)" }
        : null;
    return null;
  };

  // Banner dinamis sesuai storyboard:
  let bannerText = "Apa yang berubah dari Modul 06?";
  if (activeStopIdx === 1) bannerText = DIFFS[0].banner;
  else if (activeStopIdx === 2) bannerText = DIFFS[1].banner;
  else if (activeStopIdx === 3) bannerText = DIFFS[2].banner;
  else if (activeStopIdx === 4) bannerText = DIFFS[3].banner;
  else if (activeStopIdx === 5)
    bannerText = "Rangkuman Arsitektur: Janji Modul 06 Terbukti!";

  // Spring animation untuk panel diff / summary:
  const sprPanel = spring({
    frame:
      (activeStopIdx === 5
        ? pStop5
        : activeStopIdx === 4
          ? pStop4
          : activeStopIdx === 3
            ? pStop3
            : activeStopIdx === 2
              ? pStop2
              : pStop1) * 30,
    fps: FPS,
    config: { stiffness: 150, damping: 15 },
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
        opacity: interpolate(pStop0, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {/* =================================================================== */}
      {/* 1. HEADER JUDUL & BANNER DINAMIS                                    */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          top: 35,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "var(--text-dark, #0F172A)",
          }}
        >
          Peta Perubahan & Evolusi
        </h1>

        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#FFFFFF",
            backgroundColor: "var(--text-dark, #0F172A)",
            padding: "8px 24px",
            borderRadius: 30,
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.2)",
          }}
        >
          {bannerText}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. 5 KOTAK LAPISAN DENGAN LENCANA STATUS (y = 120, 320x100px)       */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 120,
          display: "flex",
          justifyContent: "space-between",
          zIndex: 20,
        }}
      >
        {/* Kotak 1: UI */}
        <div style={{ position: "relative", width: 320 }}>
          <div
            style={{
              width: 320,
              height: 96,
              borderRadius: 16,
              backgroundColor: "var(--c-ui, #3B82F6)",
              color: "var(--on-ui, #FFFFFF)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: focusedLayer === "ui" ? "4px solid #FFFFFF" : "none",
              boxShadow:
                focusedLayer === "ui"
                  ? "0 0 0 6px rgba(59, 130, 246, 0.4), 0 12px 28px rgba(0,0,0,0.2)"
                  : "0 4px 14px rgba(0,0,0,0.08)",
              transform: focusedLayer === "ui" ? "scale(1.04)" : "scale(1)",
              opacity:
                focusedLayer !== null &&
                focusedLayer !== "ui" &&
                activeStopIdx < 5
                  ? 0.4
                  : 1,
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 700 }}>Composable UI</span>
            <span style={{ fontSize: 13, opacity: 0.85 }}>DetailScreen</span>
          </div>
          {getBadgeForLayer("ui") && (
            <div
              style={{
                position: "absolute",
                top: -14,
                right: 12,
                backgroundColor: "#0F172A",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 800,
                padding: "3px 12px",
                borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.4)",
              }}
            >
              {getBadgeForLayer("ui")?.text}
            </div>
          )}
        </div>

        {/* Kotak 2: ViewModel */}
        <div style={{ position: "relative", width: 320 }}>
          <div
            style={{
              width: 320,
              height: 96,
              borderRadius: 16,
              backgroundColor: "var(--c-vm, #F97316)",
              color: "var(--on-vm, #0F172A)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: focusedLayer === "vm" ? "4px solid #FFFFFF" : "none",
              boxShadow:
                focusedLayer === "vm"
                  ? "0 0 0 6px rgba(249, 115, 22, 0.4), 0 12px 28px rgba(0,0,0,0.2)"
                  : "0 4px 14px rgba(0,0,0,0.08)",
              transform: focusedLayer === "vm" ? "scale(1.04)" : "scale(1)",
              opacity:
                focusedLayer !== null &&
                focusedLayer !== "vm" &&
                activeStopIdx < 5
                  ? 0.4
                  : 1,
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 700 }}>ViewModel</span>
            <span style={{ fontSize: 13, opacity: 0.85 }}>DetailViewModel</span>
          </div>
          {getBadgeForLayer("vm") && (
            <div
              style={{
                position: "absolute",
                top: -14,
                right: 12,
                backgroundColor: "#0F172A",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 800,
                padding: "3px 12px",
                borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.4)",
              }}
            >
              {getBadgeForLayer("vm")?.text}
            </div>
          )}
        </div>

        {/* Kotak 3: Repository */}
        <div style={{ position: "relative", width: 320 }}>
          <div
            style={{
              width: 320,
              height: 96,
              borderRadius: 16,
              backgroundColor: "var(--c-repo, #22C55E)",
              color: "var(--on-repo, #0F172A)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: focusedLayer === "repo" ? "4px solid #FFFFFF" : "none",
              boxShadow:
                focusedLayer === "repo"
                  ? "0 0 0 6px rgba(34, 197, 94, 0.4), 0 12px 28px rgba(0,0,0,0.2)"
                  : "0 4px 14px rgba(0,0,0,0.08)",
              transform: focusedLayer === "repo" ? "scale(1.04)" : "scale(1)",
              opacity:
                focusedLayer !== null &&
                focusedLayer !== "repo" &&
                activeStopIdx < 5
                  ? 0.4
                  : 1,
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 700 }}>Repository</span>
            <span style={{ fontSize: 13, opacity: 0.85 }}>
              StudentRepository
            </span>
          </div>
          {getBadgeForLayer("repo") && (
            <div
              style={{
                position: "absolute",
                top: -14,
                right: 12,
                backgroundColor: "#0F172A",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 800,
                padding: "3px 12px",
                borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.4)",
              }}
            >
              {getBadgeForLayer("repo")?.text}
            </div>
          )}
        </div>

        {/* Kotak 4: Remote Data Source */}
        <div style={{ position: "relative", width: 320 }}>
          <div
            style={{
              width: 320,
              height: 96,
              borderRadius: 16,
              backgroundColor: "var(--c-ds, #1E3A8A)",
              color: "var(--on-ds, #FFFFFF)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: focusedLayer === "rds" ? "4px solid #FFFFFF" : "none",
              boxShadow:
                focusedLayer === "rds"
                  ? "0 0 0 6px rgba(30, 58, 138, 0.4), 0 12px 28px rgba(0,0,0,0.2)"
                  : "0 4px 14px rgba(0,0,0,0.08)",
              transform: focusedLayer === "rds" ? "scale(1.04)" : "scale(1)",
              opacity:
                focusedLayer !== null &&
                focusedLayer !== "rds" &&
                activeStopIdx < 5
                  ? 0.4
                  : 1,
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 700 }}>
              Remote Data Source
            </span>
            <span
              style={{
                fontSize: 13,
                opacity: 0.85,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              StudentRemoteDataSource
            </span>
          </div>
          {getBadgeForLayer("rds") && (
            <div
              style={{
                position: "absolute",
                top: -14,
                right: 12,
                backgroundColor: "var(--err, #DC2626)",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 800,
                padding: "3px 12px",
                borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.4)",
              }}
            >
              {getBadgeForLayer("rds")?.text}
            </div>
          )}
        </div>

        {/* Kotak 5: REST API */}
        <div style={{ position: "relative", width: 320 }}>
          <div
            style={{
              width: 320,
              height: 96,
              borderRadius: 16,
              backgroundColor: "var(--c-api, #475569)",
              color: "var(--on-api, #FFFFFF)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "3px dashed rgba(255, 255, 255, 0.6)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              opacity: focusedLayer !== null && activeStopIdx < 5 ? 0.4 : 1,
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 700 }}>REST API</span>
            <span style={{ fontSize: 13, opacity: 0.85 }}>
              di luar aplikasi
            </span>
          </div>
          {getBadgeForLayer("api") && (
            <div
              style={{
                position: "absolute",
                top: -14,
                right: 12,
                backgroundColor: "var(--ok, #16A34A)",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 800,
                padding: "3px 12px",
                borderRadius: 12,
                border: "1.5px solid rgba(255,255,255,0.4)",
              }}
            >
              {getBadgeForLayer("api")?.text}
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. AREA TENGAH & BAWAH: PANEL DIFF ATAU RINGKASAN (y = 250 s.d. 980)*/}
      {/* =================================================================== */}
      {activeStopIdx === 0 ? (
        // State 33: Teks Pengantar
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 360,
            bottom: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: "var(--text-dark, #0F172A)",
            }}
          >
            Kita periksa perubahan lapis demi lapis, dari bawah ke atas.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "var(--text-muted, #64748B)",
              maxWidth: 1000,
              lineHeight: 1.4,
            }}
          >
            Apakah integrasi Retrofit merusak lapisan UI? Mari buktikan isolasi
            arsitektur Clean Architecture!
          </div>
        </div>
      ) : activeStopIdx >= 1 && activeStopIdx <= 4 ? (
        // State 34 s.d. 37: Panel Diff Lapis Demi Lapis
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 260,
            bottom: 60,
            backgroundColor: "var(--editor-bg, #282A36)",
            borderRadius: 20,
            border: "2px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transform: `scale(${Math.min(1, sprPanel)})`,
            zIndex: 25,
          }}
        >
          {/* Editor Tab Header */}
          <div
            style={{
              height: 46,
              backgroundColor: "rgba(0, 0, 0, 0.35)",
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
                  fontSize: 16,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: 600,
                }}
              >
                Git Diff · Modul 06 → Modul 07
              </span>
            </div>
            <span
              style={{
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                color: "#BD93F9",
                fontWeight: 700,
              }}
            >
              {DIFFS[activeStopIdx - 1].banner}
            </span>
          </div>

          {/* Isi Baris Diff (+ dan -) */}
          <div
            style={{
              padding: "24px 32px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 23,
              lineHeight: 1.6,
              color: "#F8F8F2",
              overflowY: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              whiteSpace: "pre",
              tabSize: 4,
            }}
          >
            {DIFFS[activeStopIdx - 1].lines.map((dl, idx) => {
              const isAdd = dl.kind === "+";
              const isDel = dl.kind === "-";

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: isAdd
                      ? "rgba(80, 250, 123, 0.15)"
                      : isDel
                        ? "rgba(255, 85, 85, 0.18)"
                        : "transparent",
                    color: isAdd ? "#50FA7B" : isDel ? "#FF8080" : "#F8F8F2",
                    padding: "2px 10px",
                    borderRadius: 4,
                    whiteSpace: "pre",
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      userSelect: "none",
                      fontWeight: 800,
                      opacity: isAdd || isDel ? 1 : 0.2,
                    }}
                  >
                    {dl.kind}
                  </span>
                  <span>{dl.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // State 38: Rangkuman 2 Kolom (Berubah vs Tetap) + Baris Jembatan
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 250,
            bottom: 40,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            zIndex: 25,
          }}
        >
          {/* Panel Dua Kolom: Berubah vs Tetap */}
          <div
            style={{
              flex: 1,
              display: "flex",
              gap: 32,
            }}
          >
            {/* Kolom Kiri: Yang Berubah */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "2px solid rgba(249, 115, 22, 0.2)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                padding: "24px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 32,
                  fontWeight: 800,
                  color: "var(--c-vm, #EA580C)",
                }}
              >
                <span>🔄</span>
                <span>Yang Berubah (Modul 07)</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  fontSize: 24,
                  color: "var(--text-dark, #0F172A)",
                  lineHeight: 1.4,
                }}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  <span
                    style={{ color: "var(--c-vm, #EA580C)", fontWeight: 700 }}
                  >
                    •
                  </span>
                  <span>
                    <strong>Data Source:</strong> Diganti dengan Remote Data
                    Source (Retrofit Client).
                  </span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span
                    style={{ color: "var(--c-vm, #EA580C)", fontWeight: 700 }}
                  >
                    •
                  </span>
                  <span>
                    <strong>Repository:</strong> Kontrak menjadi asinkron
                    (`callback`) & memetakan DTO ke Student.
                  </span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span
                    style={{ color: "var(--c-vm, #EA580C)", fontWeight: 700 }}
                  >
                    •
                  </span>
                  <span>
                    <strong>ViewModel:</strong> Mengelola Tri-State (Loading,
                    Error, Success).
                  </span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span
                    style={{ color: "var(--c-vm, #EA580C)", fontWeight: 700 }}
                  >
                    •
                  </span>
                  <span>
                    <strong>Domain Model:</strong> Student memakai `email` dan
                    `university`.
                  </span>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Yang Tetap */}
            <div
              style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "2px solid rgba(22, 163, 74, 0.2)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                padding: "24px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 32,
                  fontWeight: 800,
                  color: "var(--ok, #16A34A)",
                }}
              >
                <span>🛡️</span>
                <span>Yang Tetap Utuh (Terisolasi)</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  fontSize: 24,
                  color: "var(--text-dark, #0F172A)",
                  lineHeight: 1.4,
                }}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  <span
                    style={{ color: "var(--ok, #16A34A)", fontWeight: 700 }}
                  >
                    •
                  </span>
                  <span>
                    <strong>UI Bebas Retrofit:</strong> Layar tidak mengimpor
                    library jaringan apa pun.
                  </span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span
                    style={{ color: "var(--ok, #16A34A)", fontWeight: 700 }}
                  >
                    •
                  </span>
                  <span>
                    <strong>Struktur 4 Layer:</strong> Alur Unidirectional Data
                    Flow tetap konsisten.
                  </span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span
                    style={{ color: "var(--ok, #16A34A)", fontWeight: 700 }}
                  >
                    •
                  </span>
                  <span>
                    <strong>Navigasi:</strong> Rute Home, Detail, dan Backstack
                    tidak berubah.
                  </span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <span
                    style={{ color: "var(--ok, #16A34A)", fontWeight: 700 }}
                  >
                    •
                  </span>
                  <span>
                    <strong>State Hoisting:</strong> Layar murni membaca UI
                    State dari ViewModel.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Baris Jembatan Penutup (HANYA LABEL TEKS, TANPA KODE) */}
          <div
            style={{
              height: 76,
              backgroundColor: "var(--text-dark, #0F172A)",
              color: "#FFFFFF",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              fontSize: 26,
              fontWeight: 700,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.25)",
            }}
          >
            <span>🚀</span>
            <span>Materi Berikutnya:</span>
            <span
              style={{
                color: "#50FA7B",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Callback Asinkron → Kotlin Coroutines & Flow
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

import React from "react";
import { interpolate, spring } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { LayerBox } from "../components/LayerBox";

export const Scene3Layers: React.FC = () => {
  // 5 Stop untuk scene 'layers'
  const pStop0 = useStopProgress("layers", 0); // State 7 (frame 192..216, durasi 24)
  const pStop1 = useStopProgress("layers", 1); // State 8 (frame 216..276, durasi 60)
  const pStop2 = useStopProgress("layers", 2); // State 9 (frame 276..336, durasi 60)
  const pStop3 = useStopProgress("layers", 3); // State 10 (frame 336..366, durasi 30)
  const pStop4 = useStopProgress("layers", 4); // State 11 (frame 366..396, durasi 30)

  // =========================================================================
  // KOORDINAT KOTAK (5 Slot, lebar 320, gap 40, y = 340, tinggi 280)
  // Slot 1 (UI): x = 80, center x = 240
  // Slot 2 (VM): x = 440, center x = 600
  // Slot 3 (Repo): x = 800, center x = 960
  // Slot 4 (RDS): x = 1160, center x = 1320
  // Slot 5 (API): x = 1520, center x = 1680
  const boxTop = 340;
  const boxHeight = 280;

  // Pulse effect per kotak saat panah lewat:
  // pStop1 (Event, bergerak ke kanan: 0 -> 1)
  // Kotak 0 (p: 0..0.2), Kotak 1 (0.2..0.4), Kotak 2 (0.4..0.6), Kotak 3 (0.6..0.8), Kotak 4 (0.8..1.0)
  const getEventPulseScale = (idx: number) => {
    if (pStop1 <= 0 || pStop2 > 0) return 1;
    const start = idx * 0.2;
    const end = start + 0.2;
    if (pStop1 >= start && pStop1 <= end) {
      const q = (pStop1 - start) / 0.2;
      return 1 + 0.05 * Math.sin(Math.PI * q);
    }
    return 1;
  };

  // Caption Event per kotak (Stop 1)
  const eventCaptions = [
    "klik / buka layar",
    "loadStudents()",
    "getStudents(callback)",
    "api.getUsers().enqueue(…)",
    "GET /users?limit=10",
  ];

  // Caption Wujud Data per kotak (Stop 2)
  const dataCaptions = [
    "dirender",
    "HomeUiState",
    "Result<List<Student>>",
    "Result<List<UserDto>>",
    "JSON (teks)",
  ];

  // Efek shapeShift (cross-fade 8 frame):
  // pStop2: panah response bergerak dari kanan ke kiri (API -> UI)
  // Kotak 4 (p: 0..0.2), Kotak 3 (0.2..0.4), Kotak 2 (0.4..0.6), Kotak 1 (0.6..0.8), Kotak 0 (0.8..1.0)
  const getCaptionForBox = (idx: number) => {
    if (pStop1 === 0) return undefined; // State 7: tanpa caption
    if (pStop2 === 0) return eventCaptions[idx]; // State 8: event caption

    // State 9..11: shapeShift wujud data
    // Urutan dari kanan: idx 4 dulu, lalu 3, 2, 1, 0
    const reverseOrder = 4 - idx;
    const startP = reverseOrder * 0.18;
    if (pStop2 >= startP) {
      return dataCaptions[idx];
    }
    return eventCaptions[idx];
  };

  // Panah Event (y = 290): dari UI (x=240) ke REST API (x=1680)
  // Panjang total = 1680 - 240 = 1440px
  const arrowEventWidth = interpolate(pStop1, [0, 1], [0, 1440], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowEventOpacity =
    pStop1 > 0 && pStop3 === 0
      ? 1
      : pStop3 > 0
      ? interpolate(pStop3, [0, 0.5], [1, 0.15])
      : 0;

  // Panah Response (y = 670): dari REST API (x=1680) ke UI (x=240)
  // Bergerak dari kanan ke kiri di bawah kotak
  const arrowResponseProgress = interpolate(pStop2, [0, 1], [0, 1440], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowResponseOpacity =
    pStop2 > 0 && pStop3 === 0
      ? 1
      : pStop3 > 0
      ? interpolate(pStop3, [0, 0.5], [1, 0.15])
      : 0;

  // =========================================================================
  // ANIMASI arcForbidden (State 10 & 11)
  // Busur #1 (UI -> Remote DS): start x=240, end x=1320. dx=1080.
  // Busur #2 (VM -> Remote DS): start x=600, end x=1320. dx=720.
  // Puncak busur y ≈ 185.
  // =========================================================================
  const sprCross1 = spring({
    frame: Math.max(0, pStop3 - 0.75) * 4 * 24,
    fps: FPS,
    durationInFrames: 24,
    config: { stiffness: 140, damping: 13 },
  });

  const sprCross2 = spring({
    frame: Math.max(0, pStop4 - 0.75) * 4 * 24,
    fps: FPS,
    durationInFrames: 24,
    config: { stiffness: 140, damping: 13 },
  });

  // Opacity busur 1 saat busur 2 aktif meredup ke 0.4
  const arc1Opacity =
    pStop3 > 0
      ? pStop4 > 0
        ? interpolate(pStop4, [0, 0.5], [1, 0.4])
        : 1
      : 0;

  const arc2Opacity = pStop4 > 0 ? 1 : 0;

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
      {/* Judul Scene 3 */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "var(--text-dark, #0F172A)",
          }}
        >
          Aliran Data Lintas Layer
        </h1>
        <p
          style={{
            fontSize: 28,
            color: "var(--text-muted, #64748B)",
            margin: 0,
            fontWeight: 500,
          }}
        >
          Pemisahan Tanggung Jawab &bull; Unidirectional Data Flow &bull; Larangan Jalan Pintas
        </p>
      </div>

      {/* =================================================================== */}
      {/* SVG LAYER: KONEKTOR, PANAH ALIRAN, DAN BUSUR TERLARANG              */}
      {/* =================================================================== */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: 1920,
          height: 1080,
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        {/* Konektor tipis antar kotak pada y = 480 (sumbu tengah kotak) */}
        <line
          x1={80}
          y1={480}
          x2={1840}
          y2={480}
          stroke="rgba(15, 23, 42, 0.1)"
          strokeWidth={3}
          strokeDasharray="6 6"
        />

        {/* 1. Panah Event / Request (ke kanan, y = 290) */}
        {arrowEventOpacity > 0 && (
          <g opacity={arrowEventOpacity}>
            {/* Garis lintasan panah */}
            <line
              x1={240}
              y1={290}
              x2={240 + arrowEventWidth}
              y2={290}
              stroke="var(--arrow-event, #0F172A)"
              strokeWidth={6}
              strokeLinecap="round"
            />
            {/* Kepala panah event */}
            {arrowEventWidth > 30 && (
              <polygon
                points={`${240 + arrowEventWidth},290 ${240 + arrowEventWidth - 18},280 ${240 + arrowEventWidth - 18},300`}
                fill="var(--arrow-event, #0F172A)"
              />
            )}
            {/* Label Panah Event */}
            <text
              x={960}
              y={272}
              fill="var(--arrow-event, #0F172A)"
              fontSize={24}
              fontWeight={700}
              fontFamily="'JetBrains Mono', monospace"
              textAnchor="middle"
            >
              Event / Request →
            </text>
          </g>
        )}

        {/* 2. Panah Response / State (ke kiri, y = 670) */}
        {arrowResponseOpacity > 0 && (
          <g opacity={arrowResponseOpacity}>
            {/* Garis lintasan panah (dari 1680 ke kiri) */}
            <line
              x1={1680}
              y1={670}
              x2={1680 - arrowResponseProgress}
              y2={670}
              stroke="var(--arrow-state, #9333EA)"
              strokeWidth={6}
              strokeLinecap="round"
            />
            {/* Kepala panah response */}
            {arrowResponseProgress > 30 && (
              <polygon
                points={`${1680 - arrowResponseProgress},670 ${1680 - arrowResponseProgress + 18},660 ${1680 - arrowResponseProgress + 18},680`}
                fill="var(--arrow-state, #9333EA)"
              />
            )}
            {/* Label Panah Response */}
            <text
              x={960}
              y={705}
              fill="var(--arrow-state, #9333EA)"
              fontSize={24}
              fontWeight={700}
              fontFamily="'JetBrains Mono', monospace"
              textAnchor="middle"
            >
              ← Response / State
            </text>
          </g>
        )}

        {/* 3. Busur Terlarang #1: UI -> Remote Data Source (State 10) */}
        {/* Start: (240, 340), End: (1320, 340), Puncak: y = 185 */}
        {pStop3 > 0 && (
          <g opacity={arc1Opacity}>
            <path
              d="M 240 340 Q 780 180 1320 340"
              fill="none"
              stroke="var(--err, #DC2626)"
              strokeWidth={5}
              strokeDasharray="10 8"
              strokeLinecap="round"
              pathLength={1}
              strokeDashoffset={1 - Math.min(1, pStop3 * 1.25)}
            />
          </g>
        )}

        {/* 4. Busur Terlarang #2: ViewModel -> Remote Data Source (State 11) */}
        {/* Start: (600, 340), End: (1320, 340), Puncak: y = 190 */}
        {pStop4 > 0 && (
          <g opacity={arc2Opacity}>
            <path
              d="M 600 340 Q 960 190 1320 340"
              fill="none"
              stroke="var(--err, #DC2626)"
              strokeWidth={5}
              strokeDasharray="10 8"
              strokeLinecap="round"
              pathLength={1}
              strokeDashoffset={1 - Math.min(1, pStop4 * 1.25)}
            />
          </g>
        )}
      </svg>

      {/* =================================================================== */}
      {/* TANDA SILANG MERAH (X) POP-IN DI PUNCAK BUSUR                       */}
      {/* =================================================================== */}
      {/* Tanda Silang Busur #1: Posisi di puncak busur (x=780, y=185) */}
      {pStop3 >= 0.75 && (
        <div
          style={{
            position: "absolute",
            left: 780,
            top: 185,
            transform: `translate(-50%, -50%) scale(${Math.min(1, sprCross1)})`,
            zIndex: 35,
            color: "var(--err, #DC2626)",
            fontSize: 90,
            fontWeight: 900,
            lineHeight: 1,
            textShadow: "0 8px 24px rgba(220, 38, 38, 0.4)",
            userSelect: "none",
            opacity: arc1Opacity,
          }}
        >
          ✕
        </div>
      )}

      {/* Tanda Silang Busur #2: Posisi di puncak busur 2 (x=960, y=190) */}
      {pStop4 >= 0.75 && (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 190,
            transform: `translate(-50%, -50%) scale(${Math.min(1, sprCross2)})`,
            zIndex: 35,
            color: "var(--err, #DC2626)",
            fontSize: 90,
            fontWeight: 900,
            lineHeight: 1,
            textShadow: "0 8px 24px rgba(220, 38, 38, 0.4)",
            userSelect: "none",
          }}
        >
          ✕
        </div>
      )}

      {/* =================================================================== */}
      {/* 5 KOTAK LAPISAN ARSITEKTUR                                          */}
      {/* =================================================================== */}
      {/* Kotak 1: Composable UI */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: boxTop,
          transform: `scale(${getEventPulseScale(0)})`,
          transition: "transform 0.1s ease",
          zIndex: 30,
        }}
      >
        <LayerBox
          layer="ui"
          name="Composable UI"
          sublabel="HomeScreen / DetailScreen"
          caption={getCaptionForBox(0)}
          width={320}
          height={boxHeight}
        />
      </div>

      {/* Kotak 2: ViewModel */}
      <div
        style={{
          position: "absolute",
          left: 440,
          top: boxTop,
          transform: `scale(${getEventPulseScale(1)})`,
          transition: "transform 0.1s ease",
          zIndex: 30,
        }}
      >
        <LayerBox
          layer="vm"
          name="ViewModel"
          sublabel="DetailViewModel"
          caption={getCaptionForBox(1)}
          width={320}
          height={boxHeight}
        />
      </div>

      {/* Kotak 3: Repository */}
      <div
        style={{
          position: "absolute",
          left: 800,
          top: boxTop,
          transform: `scale(${getEventPulseScale(2)})`,
          transition: "transform 0.1s ease",
          zIndex: 30,
        }}
      >
        <LayerBox
          layer="repo"
          name="Repository"
          sublabel="DefaultStudentRepository"
          caption={getCaptionForBox(2)}
          width={320}
          height={boxHeight}
        />
      </div>

      {/* Kotak 4: Remote Data Source */}
      <div
        style={{
          position: "absolute",
          left: 1160,
          top: boxTop,
          transform: `scale(${getEventPulseScale(3)})`,
          transition: "transform 0.1s ease",
          zIndex: 30,
        }}
      >
        <LayerBox
          layer="rds"
          name="Remote Data Source"
          sublabel="StudentApiService · RetrofitClient"
          caption={getCaptionForBox(3)}
          width={320}
          height={boxHeight}
        />
      </div>

      {/* Kotak 5: REST API */}
      <div
        style={{
          position: "absolute",
          left: 1520,
          top: boxTop,
          transform: `scale(${getEventPulseScale(4)})`,
          transition: "transform 0.1s ease",
          zIndex: 30,
        }}
      >
        <LayerBox
          layer="api"
          name="REST API"
          sublabel="DummyJSON"
          caption={getCaptionForBox(4)}
          width={320}
          height={boxHeight}
        />
      </div>

      {/* =================================================================== */}
      {/* TEKS ATURAN & LARANGAN DI BAGIAN BAWAH (y >= 750)                   */}
      {/* =================================================================== */}
      {/* Teks Penjelasan State 7 (Stop 0): Dasar Arsitektur */}
      {pStop1 === 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 110,
            left: 80,
            right: 80,
            textAlign: "center",
            fontSize: 40,
            fontWeight: 600,
            color: "var(--text-dark, #0F172A)",
          }}
        >
          Lima layer, satu arah: Event bergerak ke kanan →, Response kembali ke kiri ←
        </div>
      )}

      {/* Teks Penjelasan State 8 (Stop 1): Event Request */}
      {pStop1 > 0 && pStop2 === 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 110,
            left: 80,
            right: 80,
            textAlign: "center",
            fontSize: 40,
            fontWeight: 600,
            color: "var(--text-dark, #0F172A)",
          }}
        >
          Hanya <span style={{ color: "var(--c-ds, #1E3A8A)", fontWeight: 700 }}>Remote Data Source</span> yang menyentuh Retrofit dan memanggil server eksternal.
        </div>
      )}

      {/* Teks Penjelasan State 9 (Stop 2): Metamorfosis Wujud Data */}
      {pStop2 > 0 && pStop3 === 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 80,
            right: 80,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 700, color: "var(--arrow-state, #9333EA)" }}>
            Perubahan Wujud Data Sepanjang Perjalanan:
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--text-dark, #0F172A)",
              backgroundColor: "rgba(147, 51, 234, 0.08)",
              padding: "8px 24px",
              borderRadius: 12,
              border: "1.5px solid rgba(147, 51, 234, 0.2)",
            }}
          >
            JSON (teks) → UserDto → Student → HomeUiState → Render Layar
          </div>
        </div>
      )}

      {/* Teks Larangan State 10 (Stop 3): UI -> Remote DS Dilarang */}
      {pStop3 > 0 && pStop4 === 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 80,
            right: 80,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "var(--err, #DC2626)",
            }}
          >
            UI dilarang memanggil Retrofit atau StudentApiService!
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 26,
              fontWeight: 600,
              color: "var(--text-muted, #64748B)",
              backgroundColor: "rgba(220, 38, 38, 0.08)",
              padding: "6px 20px",
              borderRadius: 8,
              border: "1px solid rgba(220, 38, 38, 0.2)",
            }}
          >
            HomeScreen / DetailScreen tidak boleh mengimpor retrofit2
          </div>
        </div>
      )}

      {/* Teks Larangan State 11 (Stop 4): VM -> Remote DS Dilarang */}
      {pStop4 > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 100,
            left: 80,
            right: 80,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "var(--err, #DC2626)",
            }}
          >
            ViewModel meminta data lewat Repository, bukan langsung ke Remote Data Source!
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: "var(--text-muted, #64748B)",
            }}
          >
            Repository tetap menjadi satu-satunya gerbang akses data terpadu aplikasi.
          </div>
        </div>
      )}
    </div>
  );
};

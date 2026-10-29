import React from "react";
import { interpolate, spring } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { LayerBox } from "../components/LayerBox";

export const Scene1Recap: React.FC = () => {
  // Stop 1.1: durasi 30 frame
  const pStop1 = useStopProgress("recap", 1);

  // easeSpring untuk posisi slideIn kotak REST API
  const sprSlide = spring({
    frame: pStop1 * 30,
    fps: FPS,
    durationInFrames: 30,
    config: { stiffness: 120, damping: 14 },
  });

  // Kotak ke-5 (REST API) masuk dari kanan: 1920 -> 1520px
  const apiX = interpolate(sprSlide, [0, 1], [1920, 1520]);
  const apiOpacity = interpolate(pStop1, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Garis putus-putus pembatas aplikasi fade-in
  const boundaryOpacity = interpolate(pStop1, [0.1, 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // boxSwap untuk kotak Data Source (slot 4):
  // isi lama keluar ke atas (opacity 1->0, translateY -16), isi baru masuk dari bawah (translateY 16->0, opacity 0->1)
  const oldDsOpacity = interpolate(pStop1, [0, 0.4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const oldDsY = interpolate(pStop1, [0, 0.4], [0, -16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const newDsOpacity = interpolate(pStop1, [0.4, 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const newDsY = interpolate(pStop1, [0.4, 0.9], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Teks bawah berubah dari Modul 06 ke pertanyaan Modul 07
  const textModul06Opacity = interpolate(pStop1, [0, 0.3], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textModul07Opacity = interpolate(pStop1, [0.4, 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Lebar slot = 320, gap = 40. Start x = 80
  // Slot 1: x = 80
  // Slot 2: x = 440
  // Slot 3: x = 800
  // Slot 4: x = 1160
  // Boundary line: x = 1500 (antara slot 4 dan 5)
  // Slot 5: x = 1520
  const boxY = 400;
  const boxHeight = 220;

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
      {/* Judul Scene 1 */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 80,
          right: 80,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "var(--text-dark, #0F172A)",
          }}
        >
          Modul 07: Data dari Internet
        </h1>
        <p
          style={{
            fontSize: 32,
            color: "var(--text-muted, #64748B)",
            margin: "12px 0 0 0",
            fontWeight: 500,
          }}
        >
          Rekap Arsitektur: Dari In-Memory Data Source ke REST API Eksternal
        </p>
      </div>

      {/* Kotak Slot 1: Composable UI */}
      <div style={{ position: "absolute", left: 80, top: boxY }}>
        <LayerBox
          layer="ui"
          name="Composable UI"
          sublabel="DetailScreen.kt"
          width={320}
          height={boxHeight}
        />
      </div>

      {/* Kotak Slot 2: ViewModel */}
      <div style={{ position: "absolute", left: 440, top: boxY }}>
        <LayerBox
          layer="vm"
          name="ViewModel"
          sublabel="DetailViewModel.kt"
          width={320}
          height={boxHeight}
        />
      </div>

      {/* Kotak Slot 3: Repository */}
      <div style={{ position: "absolute", left: 800, top: boxY }}>
        <LayerBox
          layer="repo"
          name="Repository"
          sublabel="StudentRepository.kt"
          width={320}
          height={boxHeight}
        />
      </div>

      {/* Kotak Slot 4: Data Source (dengan boxSwap) */}
      <div style={{ position: "absolute", left: 1160, top: boxY }}>
        {/* Konten Lama: Local Data Source (in-memory) */}
        {oldDsOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: oldDsOpacity,
              transform: `translateY(${oldDsY}px)`,
              pointerEvents: oldDsOpacity <= 0.1 ? "none" : "auto",
            }}
          >
            <LayerBox
              layer="rds"
              name="Data Source"
              sublabel="in-memory list"
              width={320}
              height={boxHeight}
            />
          </div>
        )}

        {/* Konten Baru: Remote Data Source */}
        {newDsOpacity > 0 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: newDsOpacity,
              transform: `translateY(${newDsY}px)`,
            }}
          >
            <LayerBox
              layer="rds"
              name="Remote Data Source"
              sublabel="StudentRemoteDataSource"
              width={320}
              height={boxHeight}
            />
          </div>
        )}
      </div>

      {/* Garis Putus-Putus Vertikal: Batas Aplikasi */}
      {boundaryOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: 1498,
            top: boxY - 30,
            bottom: 220,
            width: 4,
            opacity: boundaryOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Garis Putus-Putus */}
          <div
            style={{
              width: 4,
              flex: 1,
              borderLeft: "4px dashed rgba(100, 116, 139, 0.4)",
            }}
          />
          {/* Tag Label Batas Aplikasi */}
          <div
            style={{
              position: "absolute",
              top: -36,
              transform: "translateX(-50%)",
              left: 2,
              backgroundColor: "rgba(100, 116, 139, 0.12)",
              color: "var(--text-muted, #64748B)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 18,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              border: "1px solid rgba(100, 116, 139, 0.25)",
            }}
          >
            Batas Aplikasi
          </div>
        </div>
      )}

      {/* Kotak Slot 5: REST API (slideIn dari kanan ke x=1520) */}
      <div
        style={{
          position: "absolute",
          left: apiX,
          top: boxY,
          opacity: apiOpacity,
        }}
      >
        <LayerBox
          layer="api"
          name="REST API"
          sublabel="DummyJSON"
          caption="di luar aplikasi"
          width={320}
          height={boxHeight}
        />
      </div>

      {/* Teks Bawah State 0: Modul 06 */}
      {textModul06Opacity > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 80,
            opacity: textModul06Opacity,
            fontSize: 42,
            fontWeight: 600,
            color: "var(--text-dark, #0F172A)",
            lineHeight: 1.3,
          }}
        >
          Modul 06: semua data berasal dari dalam aplikasi
        </div>
      )}

      {/* Teks Bawah State 1: Apa yang berubah? Apa yang tetap? */}
      {textModul07Opacity > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 80,
            opacity: textModul07Opacity,
            fontSize: 42,
            fontWeight: 700,
            color: "var(--c-vm, #F97316)",
            lineHeight: 1.3,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <span>Apa yang berubah?</span>
          <span style={{ color: "var(--text-muted, #64748B)", fontWeight: 400 }}>&bull;</span>
          <span style={{ color: "var(--c-repo, #22C55E)" }}>Apa yang tetap?</span>
        </div>
      )}
    </div>
  );
};

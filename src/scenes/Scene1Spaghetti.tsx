import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, spring, Easing } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { RAW_CODE, parseLayers } from "../assets/code";
import { EditorWindow } from "../components/EditorWindow";
import { CodeBlock } from "../components/CodeBlock";
import { Callout } from "../components/Callout";
import { WarningCard } from "../components/WarningCard";
import { FPS } from "../deck/stops";
import { Img } from "remotion";
import logoCurriculum from "../assets/logo-curriculum.png";
import logoMgm from "../assets/logo-mgm.png";

export const Scene1Spaghetti: React.FC = () => {
  const frame = useCurrentFrame();
  const { lines, layerOf } = useMemo(() => parseLayers(RAW_CODE), []);
  const codeText = useMemo(() => lines.join("\n"), [lines]);

  // Stop 1: typeCode (0 s.d. 1 selama frame 0 - 90)
  const p1 = useStopProgress(0, 1);

  // Stop 2: dim + highlight baris 3–9 + callout 1 (frame 90 - 114)
  const p2 = useStopProgress(0, 2);

  // Stop 3: highlight pindah ke baris 16–18 + callout 2 (frame 114 - 138)
  const p3 = useStopProgress(0, 3);

  // Stop 4: semua baris meredup + warning card di tengah (frame 138 - 162)
  const p4 = useStopProgress(0, 4);

  // Per-line emphasis & background calculation
  const lineEmphasis = (lineIdx: number) => {
    // Stop 0 & 1: belum ada sorotan
    if (p2 <= 0) {
      return { opacity: 1, background: 0 };
    }

    // Stop 2: baris 3–9 disorot (index 2 s.d. 8), baris lain meredup
    if (p3 <= 0) {
      const isDataLine = lineIdx >= 2 && lineIdx <= 8;
      if (isDataLine) {
        return { opacity: 1, background: 0.125 * p2 };
      } else {
        return { opacity: 1 - 0.7 * p2, background: 0 };
      }
    }

    // Stop 3: cross-fade ke baris 16–18 (index 15 s.d. 17)
    if (p4 <= 0) {
      const isDataLine = lineIdx >= 2 && lineIdx <= 8;
      const isUiLine = lineIdx >= 15 && lineIdx <= 17;
      if (isDataLine) {
        return { opacity: 0.3 + 0.7 * (1 - p3), background: 0.125 * (1 - p3) };
      } else if (isUiLine) {
        return { opacity: 0.3 + 0.7 * p3, background: 0.125 * p3 };
      } else {
        return { opacity: 0.3, background: 0 };
      }
    }

    // Stop 4: baris 16–18 meredup, semua baris menjadi 0.3
    const isUiLine = lineIdx >= 15 && lineIdx <= 17;
    if (isUiLine) {
      return { opacity: 0.3 + 0.7 * (1 - p4), background: 0.125 * (1 - p4) };
    } else {
      return { opacity: 0.3, background: 0 };
    }
  };

  // Callout 1 (Stop 2: Baris 3–9)
  const callout1InOpacity = interpolate(p2, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const callout1OutOpacity = interpolate(p3, [0, 1], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const callout1Opacity = callout1InOpacity * callout1OutOpacity;

  const sprCallout1 = spring({
    frame: p2 * 24,
    fps: FPS,
    durationInFrames: 24,
    config: { stiffness: 120, damping: 14 },
  });
  const callout1TranslateY = interpolate(sprCallout1, [0, 1], [16, 0]);

  // Callout 2 (Stop 3: Baris 16–18)
  const callout2InOpacity = interpolate(p3, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const callout2OutOpacity = interpolate(p4, [0, 1], [1, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const callout2Opacity = callout2InOpacity * callout2OutOpacity;

  const sprCallout2 = spring({
    frame: p3 * 24,
    fps: FPS,
    durationInFrames: 24,
    config: { stiffness: 120, damping: 14 },
  });
  const callout2TranslateY = interpolate(sprCallout2, [0, 1], [16, 0]);

  // Header branding perkuliahan pada Stop 0 (fades out saat mengetik di Stop 1)
  const headerOpacity = interpolate(p1, [0, 0.4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: "var(--bg-dark, #191A21)",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Header Branding Perkuliahan (Stop 0) */}
      {headerOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: 24,
            left: "var(--safe, 80px)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: headerOpacity,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <Img
            src={logoMgm}
            alt="MGM Logo"
            style={{ height: 42, width: "auto", objectFit: "contain" }}
          />
          <Img
            src={logoCurriculum}
            alt="Curriculum Logo"
            style={{ height: 42, width: "auto", objectFit: "contain" }}
          />
          <div
            style={{
              width: 1.5,
              height: 28,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              margin: "0 4px",
            }}
          />
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                margin: 0,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              PAPB — ARSITEKTUR
            </h1>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-muted, #94A3B8)",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
              }}
            >
              Modul Praktikum 06 — Arsitektur Aplikasi Android
            </div>
          </div>
        </div>
      )}

      {/* Editor Window */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <EditorWindow>
          <CodeBlock
            code={codeText}
            typeProgress={p1}
            frame={frame}
            layerOf={layerOf}
            lineEmphasis={p2 > 0 ? lineEmphasis : undefined}
          />

          {/* Callout 1 (Stop 2) */}
          <Callout
            opacity={callout1Opacity}
            translateY={callout1TranslateY}
            top={307}
          >
            <span>
              Ganti sumber data{" "}
              <span
                style={{
                  color: "var(--laser, #EF4444)",
                  fontWeight: 700,
                  margin: "0 6px",
                }}
              >
                →
              </span>{" "}
              ubah baris 3–9
            </span>
          </Callout>

          {/* Callout 2 (Stop 3) */}
          <Callout
            opacity={callout2Opacity}
            translateY={callout2TranslateY}
            top={769}
          >
            <span>
              Ubah tampilan{" "}
              <span
                style={{
                  color: "var(--laser, #EF4444)",
                  fontWeight: 700,
                  margin: "0 6px",
                }}
              >
                →
              </span>{" "}
              ubah baris 16–18
            </span>
          </Callout>
        </EditorWindow>
      </div>

      {/* Warning Card at Center (Stop 4) */}
      <WarningCard progress={p4} />
    </div>
  );
};

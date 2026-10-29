import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SETTLED, lookup } from "./stops";
import { Watermark } from "../components/Watermark";
import { Scene1Recap } from "../scenes/Scene1Recap";
import { Scene2Cycle } from "../scenes/Scene2Cycle";
import { Scene3Layers } from "../scenes/Scene3Layers";
import { Scene4Mapping } from "../scenes/Scene4Mapping";
import { Scene5Async } from "../scenes/Scene5Async";
import { Scene6States } from "../scenes/Scene6States";
import { Scene7Errors } from "../scenes/Scene7Errors";
import { Scene8Summary } from "../scenes/Scene8Summary";

export const Deck: React.FC = () => {
  const frame = useCurrentFrame();

  // Tentukan state yang aktif (0 s.d. 38)
  let currentStateIndex = 0;
  for (let i = 0; i < SETTLED.length; i++) {
    if (frame >= SETTLED[i]) {
      currentStateIndex = i;
    }
  }

  // Batas frame transisi:
  // Scene 1: frame 0 s.d. 48 (settled di frame 30, fade-out selama 30..48)
  const s1End = lookup("recap", 1).end; // 30
  const s2Start = lookup("cycle", 0).start; // 30
  const s2End = lookup("cycle", 4).end; // 192
  const s3Start = lookup("layers", 0).start; // 192
  const s3InEnd = lookup("layers", 0).end; // 216
  const s3End = lookup("layers", 4).end; // 396
  const s4Start = lookup("mapping", 0).start; // 396
  const s4InEnd = lookup("mapping", 0).end; // 420
  const s4End = lookup("mapping", 4).end; // 546
  const s5Start = lookup("async", 0).start; // 546
  const s5InEnd = lookup("async", 0).end; // 570
  const s5End = lookup("async", 5).end; // 726
  const s6Start = lookup("states", 0).start; // 726
  const s6InEnd = lookup("states", 0).end; // 750
  const s6End = lookup("states", 4).end; // 864
  const s7Start = lookup("errors", 0).start; // 864
  const s7InEnd = lookup("errors", 0).end; // 888
  const s7End = lookup("errors", 4).end; // 1008
  const s8Start = lookup("summary", 0).start; // 1008
  const s8InEnd = lookup("summary", 0).end; // 1032

  // 1. Scene 1 (Rekap): frame 0 s.d. 48
  const isScene1Active = frame < s2Start + 18;
  const scene1ExitOpacity = interpolate(frame, [s1End, s2Start + 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Scene 2 (Siklus): frame 30 s.d. 216
  const isScene2Active = frame >= s1End && frame < s3InEnd;
  const scene2Opacity = interpolate(
    frame,
    [s1End, s2Start + 18, s2End, s3InEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 3. Scene 3 (Aliran Data Lintas Layer): frame 192 s.d. 420
  const isScene3Active = frame >= s3Start && frame < s4InEnd;
  const scene3Opacity = interpolate(
    frame,
    [s3Start, s3InEnd, s3End, s4InEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 4. Scene 4 (Transformasi DTO ke Student): frame 396 s.d. 570
  const isScene4Active = frame >= s4Start && frame < s5InEnd;
  const scene4Opacity = interpolate(
    frame,
    [s4Start, s4InEnd, s4End, s5InEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 5. Scene 5 (Callback Asinkron): frame 546 s.d. 750
  const isScene5Active = frame >= s5Start && frame < s6InEnd;
  const scene5Opacity = interpolate(
    frame,
    [s5Start, s5InEnd, s5End, s6InEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 6. Scene 6 (Tiga Kondisi Layar): frame 726 s.d. 888
  const isScene6Active = frame >= s6Start && frame < s7InEnd;
  const scene6Opacity = interpolate(
    frame,
    [s6Start, s6InEnd, s6End, s7InEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 7. Scene 7 (Penanganan Error): frame 864 s.d. 1032
  const isScene7Active = frame >= s7Start && frame < s8InEnd;
  const scene7Opacity = interpolate(
    frame,
    [s7Start, s7InEnd, s7End, s8InEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 8. Scene 8 (Ringkasan & Jembatan ke Depan): frame 1008 s.d. 1207
  const isScene8Active = frame >= s8Start;
  const scene8Opacity = interpolate(
    frame,
    [s8Start, s8InEnd],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const isLightBg = true;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: isLightBg
          ? "var(--bg-light, #F8FAFC)"
          : "var(--bg-dark, #191A21)",
        color: "var(--text-dark, #0F172A)",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Watermark Persistent di Pojok Kanan Atas */}
      <Watermark isLightBg={isLightBg} />

      {/* Scene 1: Rekap (State 0 - 1) */}
      {isScene1Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene1ExitOpacity,
            pointerEvents: frame >= s1End ? "none" : "auto",
          }}
        >
          <Scene1Recap />
        </div>
      )}

      {/* Scene 2: Siklus Request - Response (State 2 - 6) */}
      {isScene2Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene2Opacity,
            pointerEvents: frame >= s2End ? "none" : "auto",
          }}
        >
          <Scene2Cycle />
        </div>
      )}

      {/* Scene 3: Aliran Data Lintas Layer (State 7 - 11) */}
      {isScene3Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene3Opacity,
            pointerEvents: frame >= s3End ? "none" : "auto",
          }}
        >
          <Scene3Layers />
        </div>
      )}

      {/* Scene 4: Transformasi DTO ke Student (State 12 - 16) */}
      {isScene4Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene4Opacity,
            pointerEvents: frame >= s4End ? "none" : "auto",
          }}
        >
          <Scene4Mapping />
        </div>
      )}

      {/* Scene 5: Callback Asinkron (State 17 - 22) */}
      {isScene5Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene5Opacity,
            pointerEvents: frame >= s5End ? "none" : "auto",
          }}
        >
          <Scene5Async />
        </div>
      )}

      {/* Scene 6: Tiga Kondisi Layar (State 23 - 27) */}
      {isScene6Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene6Opacity,
            pointerEvents: frame >= s6End ? "none" : "auto",
          }}
        >
          <Scene6States />
        </div>
      )}

      {/* Scene 7: Penanganan Error (State 28 - 32) */}
      {isScene7Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene7Opacity,
            pointerEvents: frame >= s7End ? "none" : "auto",
          }}
        >
          <Scene7Errors />
        </div>
      )}

      {/* Scene 8: Ringkasan & Jembatan ke Depan (State 33 - 38) */}
      {isScene8Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene8Opacity,
            pointerEvents: "auto",
          }}
        >
          <Scene8Summary />
        </div>
      )}

      {/* Discreet Navigation Indicator at Bottom (39 state) */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          display: "flex",
          justifyContent: "space-between",
          gap: 3,
          pointerEvents: "none",
          opacity: 0.6,
        }}
      >
        {SETTLED.map((settledFrame, idx) => {
          const isActive = idx === currentStateIndex;
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                padding: "4px 1px",
                borderRadius: 4,
                backgroundColor: isActive
                  ? "var(--c-ui, #3B82F6)"
                  : "var(--editor-bg, #282A36)",
                color: isActive
                  ? "var(--on-ui, #FFFFFF)"
                  : "var(--text-muted, #64748B)",
                textAlign: "center",
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: isActive ? 700 : 400,
                border: isActive
                  ? "1px solid var(--c-ui, #3B82F6)"
                  : "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div>{idx}</div>
              <div style={{ fontSize: 8, opacity: 0.8 }}>{settledFrame}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

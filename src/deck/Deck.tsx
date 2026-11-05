import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SETTLED } from "./stops";
import { Watermark } from "../components/Watermark";
import { Scene1PainPoints } from "../scenes/Scene1PainPoints";
import { Scene2Suspend } from "../scenes/Scene2Suspend";
import { Scene3Structured } from "../scenes/Scene3Structured";
import { Scene4StateFlow } from "../scenes/Scene4StateFlow";
import { Scene5FlowSearch } from "../scenes/Scene5FlowSearch";
import { Scene6Summary } from "../scenes/Scene6Summary";

// Deck Modul 08: Kotlin Coroutines & Flow (PAPB FILKOM UB)
// 6 Scene terpadu, 31 settled states (Frame 0..900, TOTAL_FRAMES: 901)

export const Deck: React.FC = () => {
  const frame = useCurrentFrame();

  // Tentukan state yang aktif (0 s.d. 30)
  let currentStateIndex = 0;
  for (let i = 0; i < SETTLED.length; i++) {
    if (frame >= SETTLED[i]) {
      currentStateIndex = i;
    }
  }

  // Scene 1: frame 0 s.d. 114 (settled di frame 90, fade out 90..114 menuju Scene 2)
  const isScene1Active = frame < 114;
  const scene1Opacity = interpolate(frame, [90, 114], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 2: frame 90 s.d. 264 (fade in 90..114, settled 114..240, fade out 240..264 menuju Scene 3)
  const isScene2Active = frame >= 90 && frame < 264;
  const scene2InOpacity = interpolate(frame, [90, 114], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scene2OutOpacity = interpolate(frame, [240, 264], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scene2Opacity = Math.min(scene2InOpacity, scene2OutOpacity);

  // Scene 3: frame 240 s.d. 414 (fade in 240..264, settled 264..390, fade out 390..414 menuju Scene 4)
  const isScene3Active = frame >= 240 && frame < 414;
  const scene3InOpacity = interpolate(frame, [240, 264], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scene3OutOpacity = interpolate(frame, [390, 414], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scene3Opacity = Math.min(scene3InOpacity, scene3OutOpacity);

  // Scene 4: frame 390 s.d. 564 (fade in 390..414, settled 414..540, fade out 540..564 menuju Scene 5)
  const isScene4Active = frame >= 390 && frame < 564;
  const scene4InOpacity = interpolate(frame, [390, 414], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scene4OutOpacity = interpolate(frame, [540, 564], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scene4Opacity = Math.min(scene4InOpacity, scene4OutOpacity);

  // Scene 5: frame 540 s.d. 750 (fade in 540..564, settled 564..726, fade out 726..750 menuju Scene 6)
  const isScene5Active = frame >= 540 && frame < 750;
  const scene5InOpacity = interpolate(frame, [540, 564], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scene5OutOpacity = interpolate(frame, [726, 750], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scene5Opacity = Math.min(scene5InOpacity, scene5OutOpacity);

  // Scene 6: frame 726 s.d. 901 (fade in 726..750, settled 750..900)
  const isScene6Active = frame >= 726;
  const scene6Opacity = interpolate(frame, [726, 750], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        backgroundColor: "var(--bg-light, #F8FAFC)",
        color: "var(--text-dark, #0F172A)",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Watermark Persistent Perkuliahan (CLAUDE.md) */}
      <Watermark />

      {/* SCENE 1: Titik Jenuh Callback (State 0 - 3) */}
      {isScene1Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene1Opacity,
            pointerEvents: frame < 90 ? "auto" : "none",
          }}
        >
          <Scene1PainPoints />
        </div>
      )}

      {/* SCENE 2: Konsep Suspend & Analogi Pembatas Buku (State 4 - 8) */}
      {isScene2Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene2Opacity,
            pointerEvents: frame >= 114 && frame < 240 ? "auto" : "none",
          }}
        >
          <Scene2Suspend />
        </div>
      )}

      {/* SCENE 3: Structured Concurrency & viewModelScope (State 9 - 13) */}
      {isScene3Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene3Opacity,
            pointerEvents: frame >= 264 && frame < 390 ? "auto" : "none",
          }}
        >
          <Scene3Structured />
        </div>
      )}

      {/* SCENE 4: Penampung State Modern & Lifecycle-Aware (State 14 - 18) */}
      {isScene4Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene4Opacity,
            pointerEvents: frame >= 414 && frame < 540 ? "auto" : "none",
          }}
        >
          <Scene4StateFlow />
        </div>
      )}

      {/* SCENE 5: Aliran Data Reaktif Flow (State 19 - 24) */}
      {isScene5Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene5Opacity,
            pointerEvents: frame >= 564 && frame < 726 ? "auto" : "none",
          }}
        >
          <Scene5FlowSearch />
        </div>
      )}

      {/* SCENE 6: Peta Refactoring & Jembatan ke Modul 09 (State 25 - 30) */}
      {isScene6Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene6Opacity,
            pointerEvents: frame >= 750 ? "auto" : "none",
          }}
        >
          <Scene6Summary />
        </div>
      )}

      {/* Discreet Navigation Indicator at Bottom (31 state) */}
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
          opacity: 0.8,
          zIndex: 30,
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
                  ? "var(--c-coroutine, #8B5CF6)"
                  : "var(--editor-bg, #282A36)",
                color: isActive ? "#FFFFFF" : "var(--text-muted, #64748B)",
                textAlign: "center",
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: isActive ? 700 : 400,
                border: isActive
                  ? "1px solid var(--c-coroutine, #8B5CF6)"
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

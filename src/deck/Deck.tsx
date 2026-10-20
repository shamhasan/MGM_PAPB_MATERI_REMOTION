import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SETTLED, lookup } from "./stops";
import { Scene1Spaghetti } from "../scenes/Scene1Spaghetti";
import { Scene2Restaurant } from "../scenes/Scene2Restaurant";
import { SceneSplit } from "../scenes/SceneSplit";
import { Scene5Flow } from "../scenes/Scene5Flow";
import { Scene6TestChanges } from "../scenes/Scene6TestChanges";

export const Deck: React.FC = () => {
  const frame = useCurrentFrame();

  // Tentukan state yang aktif
  let currentStateIndex = 0;
  for (let i = 0; i < SETTLED.length; i++) {
    if (frame >= SETTLED[i]) {
      currentStateIndex = i;
    }
  }

  // Hitung batas-batas scene secara dinamis dari stops.ts
  const s1End = lookup(0, 4).end; // 162
  const s2InEnd = lookup(1, 0).end; // 180
  const s2End = lookup(1, 4).end; // 276
  const s3InEnd = lookup(2, 0).end; // 294
  const s3SplitEnd = lookup(2, 2).end; // 378
  const s4End = lookup(3, 4).end; // 474
  const s5End = lookup(4, 2).end; // 618

  // Scene 1: frame 0 s.d. s2InEnd (fade out selama s1End -> s2InEnd)
  const isScene1Active = frame < s2InEnd;
  const scene1ExitOpacity = interpolate(frame, [s1End, s2InEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 2: frame s1End s.d. s3InEnd (fade out selama s2End -> s3InEnd)
  const isScene2Active = frame >= s1End && frame < s3InEnd;
  const scene2ExitOpacity = interpolate(frame, [s2End, s3InEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene 3 & 4 (SceneSplit): frame s2End s.d. s4End
  const isSceneSplitActive = frame >= s2End && frame <= s4End;

  // Scene 5 (Flow): frame > s4End s.d. s5End
  const isScene5Active = frame > s4End && frame <= s5End;

  // Scene 6 (Uji Perubahan): frame > s5End
  const isScene6Active = frame > s5End;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor:
          (frame >= s1End && frame < s2End) || frame >= s3SplitEnd
            ? "var(--bg-light, #F8FAFC)"
            : "var(--bg-dark, #191A21)",
        color: "var(--text-light, #F8F8F2)",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scene 1 (Spaghetti) */}
      {isScene1Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene1ExitOpacity,
            pointerEvents: frame >= s1End ? "none" : "auto",
          }}
        >
          <Scene1Spaghetti />
        </div>
      )}

      {/* Scene 2 (Restaurant) */}
      {isScene2Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene2ExitOpacity,
            pointerEvents: frame >= s2End ? "none" : "auto",
          }}
        >
          <Scene2Restaurant />
        </div>
      )}

      {/* Scene 3 + 4 (SceneSplit: Tebas Kode & Empat Lapis) */}
      {isSceneSplitActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          <SceneSplit />
        </div>
      )}

      {/* Scene 5 (Flow: Aliran Eksekusi) */}
      {isScene5Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          <Scene5Flow />
        </div>
      )}

      {/* Scene 6 (Uji Perubahan) */}
      {isScene6Active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          <Scene6TestChanges />
        </div>
      )}

      {/* Discreet Navigation Indicator at Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          display: "flex",
          justifyContent: "space-between",
          gap: 6,
          pointerEvents: "none",
          opacity: 0.35,
        }}
      >
        {SETTLED.map((settledFrame, idx) => {
          const isActive = idx === currentStateIndex;
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                padding: "4px 2px",
                borderRadius: 6,
                backgroundColor: isActive
                  ? "var(--c-ui, #3B82F6)"
                  : "var(--editor-bg, #282A36)",
                color: isActive
                  ? "var(--on-ui, #FFFFFF)"
                  : "var(--text-muted, #64748B)",
                textAlign: "center",
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: isActive ? 700 : 400,
                border: isActive
                  ? "1px solid var(--c-ui, #3B82F6)"
                  : "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <div>{idx}</div>
              <div style={{ fontSize: 9, opacity: 0.8 }}>f:{settledFrame}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

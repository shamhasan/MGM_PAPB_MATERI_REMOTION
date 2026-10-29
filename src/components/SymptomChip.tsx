import React from "react";
import { interpolate, spring } from "remotion";
import { FPS } from "../deck/stops";

export interface SymptomChipProps {
  symptom: string;
  fix?: string;
  progress?: number; // 0 to 1
  style?: React.CSSProperties;
}

export const SymptomChip: React.FC<SymptomChipProps> = ({
  symptom,
  fix,
  progress = 1,
  style,
}) => {
  // Spring fall animation for symptom chip (translateY -120 -> 0)
  const spr = spring({
    frame: progress * 24,
    fps: FPS,
    durationInFrames: 24,
    config: { stiffness: 120, damping: 14 },
  });

  const chipTranslateY = interpolate(spr, [0, 1], [-120, 0]);
  const chipOpacity = interpolate(progress, [0, 0.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fix card fades in and moves up 16px after progress >= 0.6
  const fixProgress = Math.max(0, Math.min(1, (progress - 0.6) / 0.4));
  const fixTranslateY = interpolate(fixProgress, [0, 1], [16, 0]);
  const fixOpacity = fixProgress;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        userSelect: "none",
        ...style,
      }}
    >
      {/* Chip Gejala (Latar --text-dark, mono 36px, border-left 8px --err) */}
      <div
        style={{
          transform: `translateY(${chipTranslateY}px)`,
          opacity: chipOpacity,
          backgroundColor: "var(--text-dark, #0F172A)",
          color: "var(--text-light, #F8F8F2)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 36,
          fontWeight: 700,
          padding: "16px 28px",
          borderRadius: 12,
          borderLeft: "8px solid var(--err, #DC2626)",
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          maxWidth: 900,
        }}
      >
        <span style={{ color: "var(--err, #DC2626)" }}>✕</span>
        <span>{symptom}</span>
      </div>

      {/* Kartu Perbaikan (Latar putih, border 4px --ok, teks Inter 42px --text-dark) */}
      {fix && fixProgress > 0 && (
        <div
          style={{
            transform: `translateY(${fixTranslateY}px)`,
            opacity: fixOpacity,
            backgroundColor: "#FFFFFF",
            border: "4px solid var(--ok, #16A34A)",
            borderRadius: 16,
            padding: "24px 36px",
            boxShadow: "0 16px 36px rgba(22, 163, 74, 0.15)",
            fontFamily: "'Inter', sans-serif",
            fontSize: 42,
            fontWeight: 600,
            color: "var(--text-dark, #0F172A)",
            display: "flex",
            alignItems: "center",
            gap: 20,
            maxWidth: 1100,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: "var(--ok, #16A34A)",
              color: "var(--on-ok, #0F172A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            ✓
          </div>
          <span>{fix}</span>
        </div>
      )}
    </div>
  );
};

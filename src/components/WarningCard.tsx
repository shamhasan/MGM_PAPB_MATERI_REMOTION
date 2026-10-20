import React from "react";
import { spring, interpolate, Easing } from "remotion";
import { AlertTriangle } from "lucide-react";
import { FPS } from "../deck/stops";

export interface WarningCardProps {
  progress: number; // 0 to 1 (from useStopProgress(0, 2))
  style?: React.CSSProperties;
}

export const WarningCard: React.FC<WarningCardProps> = ({
  progress,
  style,
}) => {
  if (progress <= 0) return null;

  // Spring animation for scale & translateY (duration: 24 frames)
  const spr = spring({
    frame: progress * 24,
    fps: FPS,
    durationInFrames: 24,
    config: { stiffness: 120, damping: 14 },
  });

  const scale = interpolate(spr, [0, 1], [0.88, 1]);
  const translateY = interpolate(spr, [0, 1], [24, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const reasons = [
    "Dua pekerjaan berbeda, satu tempat",
    "Ubah satu, yang lain ikut berisiko",
    "Sulit dites dengan data palsu",
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`,
        opacity,
        zIndex: 50,
        width: 1180,
        backgroundColor: "#2B1B1B",
        border: "4px solid var(--laser, #EF4444)",
        borderRadius: 24,
        padding: "44px 56px",
        boxShadow:
          "0 0 16px var(--laser, #EF4444), 0 0 36px rgba(239, 68, 68, 0.45), 0 24px 60px rgba(0, 0, 0, 0.8)",
        color: "var(--text-light, #F8F8F2)",
        fontFamily: "'Inter', sans-serif",
        boxSizing: "border-box",
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 36,
          paddingBottom: 24,
          borderBottom: "1px solid rgba(239, 68, 68, 0.3)",
        }}
      >
        <AlertTriangle
          size={48}
          color="var(--laser, #EF4444)"
          strokeWidth={2.5}
        />
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "var(--text-light, #F8F8F2)",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Satu fungsi, banyak alasan untuk berubah
        </h2>
      </div>

      {/* Reasons List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {reasons.map((text, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 42,
              fontWeight: 500,
              lineHeight: 1.3,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "var(--laser, #EF4444)",
                flexShrink: 0,
                boxShadow: "0 0 8px var(--laser, #EF4444)",
              }}
            />
            <span
              style={{
                color: "var(--text-light, #F8F8F2)",
                fontWeight: 600,
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

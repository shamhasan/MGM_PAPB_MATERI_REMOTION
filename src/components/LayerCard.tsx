import React from "react";
import { spring, interpolate, Easing } from "remotion";
import { Layer } from "../assets/code";
import { FPS } from "../deck/stops";

export type LayerId = Layer | "datasource" | "repository" | "viewmodel";

export interface LayerCardProps {
  layer: LayerId;
  roleName: string;
  chipLabel: string;
  taskLabel: string;
  taskDetail: string;
  icon: React.ReactNode;
  progress: number; // 0 to 1
  caption?: string; // e.g. "di luar aplikasi" untuk varian api
  style?: React.CSSProperties;
}

export const LayerCard: React.FC<LayerCardProps> = ({
  layer,
  roleName,
  chipLabel,
  taskLabel,
  taskDetail,
  icon,
  progress,
  caption,
  style,
}) => {
  if (progress <= 0) return null;

  // Spring animation for scale & translateY (24 frames)
  const spr = spring({
    frame: progress * 24,
    fps: FPS,
    durationInFrames: 24,
    config: { stiffness: 120, damping: 14 },
  });

  const scale = interpolate(spr, [0, 1], [0.85, 1]);
  const translateY = interpolate(spr, [0, 1], [24, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isApi = layer === "api";
  const isDs = layer === "rds" || layer === "datasource";
  const isVm = layer === "vm" || layer === "viewmodel";
  const isRepo = layer === "repo" || layer === "repository";

  const colorVar = isApi
    ? "var(--c-api, #475569)"
    : isDs
    ? "var(--c-ds, #1E3A8A)"
    : isVm
    ? "var(--c-vm, #F97316)"
    : isRepo
    ? "var(--c-repo, #22C55E)"
    : "var(--c-ui, #3B82F6)";

  const onColorVar = isApi
    ? "var(--on-api, #FFFFFF)"
    : isDs
    ? "var(--on-ds, #FFFFFF)"
    : isVm
    ? "var(--on-vm, #0F172A)"
    : isRepo
    ? "var(--on-repo, #0F172A)"
    : "var(--on-ui, #FFFFFF)";

  return (
    <div
      style={{
        width: 410,
        height: 620,
        backgroundColor: colorVar,
        color: onColorVar,
        borderRadius: 24,
        padding: "44px 32px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        boxShadow: "0 16px 40px rgba(15, 23, 42, 0.15)",
        border: isApi ? "4px dashed rgba(255, 255, 255, 0.7)" : undefined,
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        fontFamily: "'Inter', sans-serif",
        userSelect: "none",
        position: "relative",
        ...style,
      }}
    >
      {/* Icon: 96px, stroke 2 */}
      <div
        style={{
          width: 96,
          height: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        {icon}
      </div>

      {/* Role Name */}
      <h3
        style={{
          fontSize: 44,
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.15,
          color: onColorVar,
        }}
      >
        {roleName}
      </h3>

      {/* Chip: (UI), (ViewModel), dll. */}
      <div
        style={{
          marginTop: 14,
          marginBottom: 32,
          display: "inline-block",
          padding: "6px 20px",
          borderRadius: 9999,
          backgroundColor: "rgba(0, 0, 0, 0.12)",
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: "0.02em",
          color: onColorVar,
        }}
      >
        {chipLabel}
      </div>

      {/* Caption tambahan (misal: "di luar aplikasi" pada varian api) */}
      {(caption || isApi) && (
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 24,
            fontWeight: 600,
            opacity: 0.85,
            marginBottom: 16,
            color: onColorVar,
          }}
        >
          {caption || "di luar aplikasi"}
        </div>
      )}

      {/* Task Description (Inter 42px min) */}
      <div
        style={{
          marginTop: "auto",
          width: "100%",
          paddingTop: 24,
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          fontSize: 42,
          fontWeight: 600,
          lineHeight: 1.25,
          color: onColorVar,
        }}
      >
        <span style={{ opacity: 0.85, fontSize: 36, fontWeight: 500 }}>
          {taskLabel}
        </span>
        <span>{taskDetail}</span>
      </div>
    </div>
  );
};

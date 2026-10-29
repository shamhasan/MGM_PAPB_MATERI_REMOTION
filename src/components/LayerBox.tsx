import React from "react";
import { Layer } from "../assets/code";

export interface LayerBoxProps {
  layer: Layer;
  name: string;
  sublabel?: string;
  caption?: string; // e.g. wujud data or event
  isFocused?: boolean;
  isDimmed?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const LayerBox: React.FC<LayerBoxProps> = ({
  layer,
  name,
  sublabel,
  caption,
  isFocused = false,
  isDimmed = false,
  width = 320,
  height = 280,
  style,
}) => {
  const isApi = layer === "api";
  const isDs = layer === "rds";
  const isVm = layer === "vm";
  const isRepo = layer === "repo";

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

  const defaultSublabel = isApi
    ? "DummyJSON (di luar aplikasi)"
    : isDs
    ? "StudentApiService · RetrofitClient"
    : undefined;

  const effectiveSublabel = sublabel ?? defaultSublabel;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: colorVar,
        color: onColorVar,
        borderRadius: 20,
        padding: "18px 20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        userSelect: "none",
        fontFamily: "'Inter', sans-serif",
        gap: 8,
        border: isApi
          ? "4px dashed rgba(255, 255, 255, 0.7)"
          : isFocused
          ? `4px solid #FFFFFF`
          : "2px solid rgba(255, 255, 255, 0.15)",
        boxShadow: isFocused
          ? `0 0 0 6px rgba(255, 255, 255, 0.3), 0 16px 40px rgba(0, 0, 0, 0.3)`
          : "0 10px 28px rgba(0, 0, 0, 0.12)",
        opacity: isDimmed ? 0.35 : 1,
        transition: "all 0.2s ease",
        ...style,
      }}
    >
      {/* Layer Name (Inter Bold 32px) */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          lineHeight: 1.15,
          color: onColorVar,
        }}
      >
        {name}
      </div>

      {/* Sublabel / Technical Info */}
      {effectiveSublabel && (
        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            lineHeight: 1.25,
            color: onColorVar,
            opacity: 0.88,
            fontFamily: isApi || isDs ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          {effectiveSublabel}
        </div>
      )}

      {/* Caption Inside Box (JetBrains Mono 22px, e.g. Event or Data Representation) */}
      {caption && (
        <div
          style={{
            marginTop: 4,
            backgroundColor: "rgba(0, 0, 0, 0.22)",
            padding: "6px 12px",
            borderRadius: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.2,
            color: onColorVar,
            border: "1px solid rgba(255, 255, 255, 0.18)",
            maxWidth: "100%",
            boxSizing: "border-box",
            wordBreak: "break-word",
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

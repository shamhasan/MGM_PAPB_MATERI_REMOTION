import React from "react";
import { Timer, CheckCheck, Scissors, Ban } from "lucide-react";

export interface OperatorNodeProps {
  type: "debounce" | "distinct" | "collectLatest" | "generic";
  label: string;
  sublabel?: string;
  isActive?: boolean;
  isOpen?: boolean;
  timerProgress?: number; // 0..1 untuk putaran timer atau waktu mundur
  isCancelled?: boolean;  // Efek pembatalan burst
  style?: React.CSSProperties;
}

/**
 * Kartu node operator Flow pada pipa pencarian (Scene 5).
 * Sesuai spesifikasi docs/04-design-delta.md bagian 4.C.
 */
export const OperatorNode: React.FC<OperatorNodeProps> = ({
  type,
  label,
  sublabel,
  isActive = false,
  isOpen = false,
  timerProgress = 0,
  isCancelled = false,
  style,
}) => {
  const getTheme = () => {
    switch (type) {
      case "debounce":
        return {
          bg: "rgba(249, 115, 22, 0.12)",
          border: "var(--c-vm, #F97316)",
          color: "var(--c-vm, #F97316)",
          icon: <Timer size={22} style={{ transform: `rotate(${timerProgress * 360}deg)` }} />,
        };
      case "distinct":
        return {
          bg: "rgba(6, 182, 212, 0.12)",
          border: "var(--c-flow, #06B6D4)",
          color: "var(--c-flow, #06B6D4)",
          icon: <CheckCheck size={22} />,
        };
      case "collectLatest":
        return {
          bg: isCancelled ? "rgba(239, 68, 68, 0.15)" : "rgba(139, 92, 246, 0.12)",
          border: isCancelled ? "var(--c-cancel, #EF4444)" : "var(--c-coroutine, #8B5CF6)",
          color: isCancelled ? "var(--c-cancel, #EF4444)" : "var(--c-coroutine, #8B5CF6)",
          icon: isCancelled ? <Ban size={22} /> : <Scissors size={22} />,
        };
      default:
        return {
          bg: "rgba(15, 23, 42, 0.08)",
          border: "var(--pipe-border, rgba(6, 182, 212, 0.35))",
          color: "var(--text-dark, #0F172A)",
          icon: null,
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 18px",
        borderRadius: 16,
        backgroundColor: isActive ? theme.bg : "var(--editor-bg, #282A36)",
        border: `2px solid ${isActive ? theme.border : "rgba(255, 255, 255, 0.1)"}`,
        color: isActive ? theme.color : "var(--text-muted, #94A3B8)",
        boxShadow: isActive ? `0 6px 20px ${theme.bg}` : "none",
        fontFamily: "'Inter', sans-serif",
        textAlign: "center",
        minWidth: 170,
        minHeight: 92,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {theme.icon}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 800,
            fontSize: 18,
            color: isActive ? theme.color : "var(--text-light, #F8F8F2)",
          }}
        >
          {label}
        </span>
      </div>

      {sublabel && (
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginTop: 4,
            color: isActive ? "var(--text-dark, #0F172A)" : "var(--text-muted, #94A3B8)",
          }}
        >
          {sublabel}
        </span>
      )}

      {/* Indikator Katup Buka/Tutup */}
      {type === "debounce" && (
        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 999,
            backgroundColor: isOpen ? "rgba(22, 163, 74, 0.2)" : "rgba(249, 115, 22, 0.2)",
            color: isOpen ? "var(--life-active, #16A34A)" : "var(--c-vm, #F97316)",
          }}
        >
          {isOpen ? "KATUP BUKA" : "MENAHAN (500ms)"}
        </div>
      )}

      {/* Efek Ledakan Batal (cancelBurst) */}
      {type === "collectLatest" && isCancelled && (
        <div
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: 20,
            border: "2px solid var(--c-cancel, #EF4444)",
            animation: "none",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};


import React from "react";

export interface PacketProps {
  label: string;
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  variant?: "event" | "state" | "ok" | "err" | "default";
  style?: React.CSSProperties;
}

export const Packet: React.FC<PacketProps> = ({
  label,
  x = 0,
  y = 0,
  scale = 1,
  opacity = 1,
  variant = "default",
  style,
}) => {
  const bgVar =
    variant === "event"
      ? "var(--arrow-event, #0F172A)"
      : variant === "state"
      ? "var(--arrow-state, #9333EA)"
      : variant === "ok"
      ? "var(--ok, #16A34A)"
      : variant === "err"
      ? "var(--err, #DC2626)"
      : "var(--text-dark, #0F172A)";

  const textColor =
    variant === "ok" ? "var(--on-ok, #0F172A)" : "#FFFFFF";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        zIndex: 50,
        backgroundColor: bgVar,
        color: textColor,
        padding: "10px 24px",
        borderRadius: 9999,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: "0.02em",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
        border: "2px solid rgba(255, 255, 255, 0.25)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        userSelect: "none",
        ...style,
      }}
    >
      {label}
    </div>
  );
};

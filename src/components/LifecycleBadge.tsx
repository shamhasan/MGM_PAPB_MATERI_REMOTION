import React from "react";
import { Eye, EyeOff } from "lucide-react";

export interface LifecycleBadgeProps {
  status: "active" | "idle";
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Pill badge indikator status siklus hidup Compose (Scene 4).
 * Sesuai spesifikasi docs/04-design-delta.md bagian 4.E.
 */
export const LifecycleBadge: React.FC<LifecycleBadgeProps> = ({
  status,
  style,
  className,
}) => {
  const isActive = status === "active";

  const borderColor = isActive
    ? "var(--life-active, #16A34A)"
    : "var(--life-idle, #F59E0B)";

  const backgroundColor = isActive
    ? "rgba(22, 163, 74, 0.15)"
    : "rgba(245, 158, 11, 0.15)";

  const textColor = isActive
    ? "var(--life-active, #16A34A)"
    : "var(--life-idle, #F59E0B)";

  const label = isActive ? "RESUMED (Koleksi Aktif)" : "STOPPED (Koleksi Dijeda)";

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        width: 260,
        height: 46,
        borderRadius: 999,
        backgroundColor,
        border: `2px solid ${borderColor}`,
        backdropFilter: "blur(8px)",
        padding: "0 18px",
        boxShadow: isActive
          ? "0 4px 16px rgba(22, 163, 74, 0.25)"
          : "0 4px 14px rgba(245, 158, 11, 0.2)",
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
    >
      {/* Titik Lampu Indikator */}
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: borderColor,
          boxShadow: isActive ? `0 0 10px ${borderColor}` : "none",
          flexShrink: 0,
        }}
      />

      {/* Ikon Lucide */}
      {isActive ? (
        <Eye size={20} color={borderColor} strokeWidth={2.2} />
      ) : (
        <EyeOff size={20} color={borderColor} strokeWidth={2.2} />
      )}

      {/* Teks Label Status */}
      <span
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: textColor,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
};


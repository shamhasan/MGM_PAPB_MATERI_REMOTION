import React from "react";
import { Bookmark } from "lucide-react";

export interface BookmarkIndicatorProps {
  label?: string;
  glow?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Ornamen pita emas penanda suspensi baris kode (Scene 2).
 * Sesuai spesifikasi docs/04-design-delta.md bagian 4.A.
 */
export const BookmarkIndicator: React.FC<BookmarkIndicatorProps> = ({
  label = "SUSPEND",
  glow = false,
  style,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: 44,
        height: 84,
        backgroundColor: "var(--c-bookmark, #EAB308)",
        color: "var(--on-bookmark, #0F172A)",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 16px), 0 100%)",
        boxShadow: glow
          ? "0 0 26px rgba(234, 179, 8, 0.75), 0 4px 16px rgba(234, 179, 8, 0.5)"
          : "0 4px 16px rgba(234, 179, 8, 0.45)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 10,
        gap: 6,
        zIndex: 20,
        ...style,
      }}
    >
      <Bookmark size={22} strokeWidth={2.5} color="var(--on-bookmark, #0F172A)" />
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 800,
          fontSize: 12,
          letterSpacing: "0.12em",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
};


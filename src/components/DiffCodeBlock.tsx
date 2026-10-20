import React from "react";

export interface DiffLine {
  type: "normal" | "add" | "del";
  text: string;
}

export interface DiffCodeBlockProps {
  lines: DiffLine[];
  style?: React.CSSProperties;
}

export const DiffCodeBlock: React.FC<DiffCodeBlockProps> = ({
  lines,
  style,
}) => {
  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 15,
        lineHeight: 1.45,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        userSelect: "none",
        ...style,
      }}
    >
      {lines.map((item, idx) => {
        let bg = "transparent";
        let color = "var(--text-light, #F8F8F2)";
        let prefix = "  ";

        if (item.type === "add") {
          bg = "rgba(34, 197, 94, 0.2)";
          color = "#4ADE80";
          prefix = "+ ";
        } else if (item.type === "del") {
          bg = "rgba(239, 68, 68, 0.2)";
          color = "#F87171";
          prefix = "- ";
        }

        return (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "flex-start",
              backgroundColor: bg,
              borderRadius: 4,
              padding: "2px 6px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            <span
              style={{
                userSelect: "none",
                fontWeight: 700,
                color: item.type === "add" ? "#22C55E" : item.type === "del" ? "#EF4444" : "var(--text-muted, #64748B)",
                minWidth: 18,
              }}
            >
              {prefix}
            </span>
            <span style={{ color, flex: 1, fontWeight: item.type === "normal" ? 400 : 600 }}>
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

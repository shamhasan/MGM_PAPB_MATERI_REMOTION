import React from "react";

export type DiffLine =
  | { type: "normal" | "add" | "del"; text: string }
  | { kind: " " | "+" | "-"; text: string };

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
        fontSize: 16,
        lineHeight: 1.5,
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

        const isAdd = ("type" in item && item.type === "add") || ("kind" in item && item.kind === "+");
        const isDel = ("type" in item && item.type === "del") || ("kind" in item && item.kind === "-");

        if (isAdd) {
          bg = "rgba(34, 197, 94, 0.2)";
          color = "#4ADE80";
          prefix = "+ ";
        } else if (isDel) {
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
              padding: "3px 8px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            <span
              style={{
                userSelect: "none",
                fontWeight: 800,
                color: isAdd ? "#22C55E" : isDel ? "#EF4444" : "var(--text-muted, #64748B)",
                minWidth: 20,
              }}
            >
              {prefix}
            </span>
            <span style={{ color, flex: 1, fontWeight: isAdd || isDel ? 600 : 400 }}>
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

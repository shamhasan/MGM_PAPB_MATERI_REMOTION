import React from "react";

export interface StatePanelProps {
  students: string;
  isLoading: string;
  errorMessage: string;
  activeField?: "students" | "isLoading" | "errorMessage";
  style?: React.CSSProperties;
}

export const StatePanel: React.FC<StatePanelProps> = ({
  students,
  isLoading,
  errorMessage,
  activeField,
  style,
}) => {
  return (
    <div
      style={{
        backgroundColor: "var(--editor-bg, #282A36)",
        borderRadius: 20,
        boxShadow: "0 16px 40px rgba(0, 0, 0, 0.25)",
        overflow: "hidden",
        border: "1.5px solid rgba(255, 255, 255, 0.1)",
        userSelect: "none",
        fontFamily: "'JetBrains Mono', monospace",
        ...style,
      }}
    >
      {/* Header bar without description */}
      <div
        style={{
          height: 52,
          backgroundColor: "rgba(0, 0, 0, 0.25)",
          borderBottom: "1.5px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#FF5555",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#FFB86C",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#50FA7B",
            }}
          />
        </div>
        <span
          style={{
            marginLeft: 12,
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text-light, #F8F8F2)",
            letterSpacing: "0.02em",
          }}
        >
          HomeUiState
        </span>
      </div>

      {/* State Fields List (JetBrains Mono 28px) */}
      <div
        style={{
          padding: "28px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          fontSize: 28,
          lineHeight: 1.4,
        }}
      >
        {/* Field 1: students */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            borderRadius: 8,
            backgroundColor:
              activeField === "students"
                ? "rgba(22, 163, 74, 0.18)"
                : "transparent",
            borderLeft:
              activeField === "students"
                ? "4px solid var(--ok, #16A34A)"
                : "4px solid transparent",
          }}
        >
          <span style={{ color: "#8BE9FD" }}>students</span>
          <span
            style={{ color: "var(--text-muted, #64748B)", margin: "0 12px" }}
          >
            =
          </span>
          <span
            style={{
              color:
                students === "[8 item]"
                  ? "var(--ok, #16A34A)"
                  : "var(--text-light, #F8F8F2)",
              fontWeight: students === "[8 item]" ? 700 : 400,
            }}
          >
            {students}
          </span>
        </div>

        {/* Field 2: isLoading */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            borderRadius: 8,
            backgroundColor:
              activeField === "isLoading"
                ? "rgba(59, 130, 246, 0.18)"
                : "transparent",
            borderLeft:
              activeField === "isLoading"
                ? "4px solid var(--c-ui, #3B82F6)"
                : "4px solid transparent",
          }}
        >
          <span style={{ color: "#8BE9FD" }}>isLoading</span>
          <span
            style={{ color: "var(--text-muted, #64748B)", margin: "0 12px" }}
          >
            =
          </span>
          <span
            style={{
              color:
                isLoading === "true"
                  ? "var(--c-vm, #F97316)"
                  : "var(--text-muted, #64748B)",
              fontWeight: isLoading === "true" ? 700 : 400,
            }}
          >
            {isLoading}
          </span>
        </div>

        {/* Field 3: errorMessage */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            borderRadius: 8,
            backgroundColor:
              activeField === "errorMessage"
                ? "rgba(220, 38, 38, 0.18)"
                : "transparent",
            borderLeft:
              activeField === "errorMessage"
                ? "4px solid var(--err, #DC2626)"
                : "4px solid transparent",
          }}
        >
          <span style={{ color: "#8BE9FD" }}>errorMessage</span>
          <span
            style={{ color: "var(--text-muted, #64748B)", margin: "0 12px" }}
          >
            =
          </span>
          <span
            style={{
              color:
                errorMessage !== "null"
                  ? "var(--err, #DC2626)"
                  : "var(--text-muted, #64748B)",
              fontWeight: errorMessage !== "null" ? 700 : 400,
            }}
          >
            {errorMessage}
          </span>
        </div>
      </div>
    </div>
  );
};

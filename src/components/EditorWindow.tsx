import React from "react";

export interface EditorWindowProps {
  children?: React.ReactNode;
  dimmed?: boolean;
  tabTitle?: string;
  style?: React.CSSProperties;
}

export const EditorWindow: React.FC<EditorWindowProps> = ({
  children,
  dimmed = false,
  tabTitle = "DetailScreen.kt",
  style,
}) => {
  return (
    <div
      style={{
        width: 1760,
        backgroundColor: "var(--editor-bg, #282A36)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
        opacity: dimmed ? 0.3 : 1,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        ...style,
      }}
    >
      {/* Title Bar: 56px height */}
      <div
        style={{
          height: 56,
          backgroundColor: "#1E1F29",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          position: "relative",
        }}
      >
        {/* Three dots (Window Controls) */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#FF5555",
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#F1FA8C",
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#50FA7B",
            }}
          />
        </div>

        {/* Tab: DetailScreen.kt */}
        <div
          style={{
            marginLeft: 32,
            height: 42,
            backgroundColor: "var(--editor-bg, #282A36)",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderTop: "2px solid var(--c-ui, #3B82F6)",
            color: "var(--text-light, #F8F8F2)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          <span>{tabTitle}</span>
        </div>
      </div>

      {/* Editor Content Area */}
      <div
        style={{
          padding: "20px 24px",
          backgroundColor: "var(--editor-bg, #282A36)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
};

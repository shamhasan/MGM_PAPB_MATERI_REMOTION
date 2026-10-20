import React from "react";

export interface CalloutProps {
  children: React.ReactNode;
  opacity: number;
  translateY: number;
  top: number;
  style?: React.CSSProperties;
}

export const Callout: React.FC<CalloutProps> = ({
  children,
  opacity,
  translateY,
  top,
  style,
}) => {
  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        top,
        transform: `translateY(calc(-50% + ${translateY}px))`,
        maxWidth: 560,
        backgroundColor: "#2B1B1B",
        border: "4px solid var(--laser, #EF4444)",
        borderRadius: 20,
        padding: "22px 30px",
        boxShadow:
          "0 0 16px var(--laser, #EF4444), 0 0 36px rgba(239, 68, 68, 0.35), 0 16px 40px rgba(0, 0, 0, 0.7)",
        color: "var(--text-light, #F8F8F2)",
        fontFamily: "'Inter', sans-serif",
        fontSize: 42,
        fontWeight: 600,
        lineHeight: 1.3,
        opacity,
        zIndex: 30,
        pointerEvents: "none",
        boxSizing: "border-box",
        userSelect: "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

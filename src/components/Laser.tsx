import React from "react";
import { interpolate } from "remotion";

export interface LaserProps {
  progress: number; // 0 to 1
  width?: number;
  style?: React.CSSProperties;
}

export const Laser: React.FC<LaserProps> = ({
  progress,
  width = 1760,
  style,
}) => {
  if (progress <= 0) return null;

  const currentWidth = interpolate(progress, [0, 1], [0, width], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        height: 4,
        width: currentWidth,
        backgroundColor: "var(--laser, #EF4444)",
        boxShadow: "0 0 12px var(--laser, #EF4444), 0 0 32px var(--laser, #EF4444)",
        zIndex: 40,
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* Laser Head Glow */}
      <div
        style={{
          position: "absolute",
          right: -6,
          top: -6,
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 0 16px var(--laser, #EF4444), 0 0 32px #FFFFFF",
        }}
      />
    </div>
  );
};

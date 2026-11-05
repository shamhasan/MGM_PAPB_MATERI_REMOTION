import React from "react";
import { Img } from "remotion";
import logoCurriculum from "../assets/logo-curriculum.png";
import logoMgm from "../assets/logo-mgm.png";

interface WatermarkProps {
  isLightBg?: boolean;
}

export const Watermark: React.FC<WatermarkProps> = ({ isLightBg = true }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 32,
        right: 60,
        zIndex: 100,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "8px 20px",
        borderRadius: 9999,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        backgroundColor: isLightBg
          ? "rgba(15, 23, 42, 0.07)"
          : "rgba(255, 255, 255, 0.08)",
        border: isLightBg
          ? "1.5px solid rgba(15, 23, 42, 0.15)"
          : "1.5px solid rgba(255, 255, 255, 0.18)",
        boxShadow: isLightBg
          ? "0 4px 16px rgba(0, 0, 0, 0.06)"
          : "0 6px 24px rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Logo Curriculum Mini (Tinggi 38px) */}
      <Img
        src={logoCurriculum}
        alt="Curriculum Logo"
        style={{
          height: 38,
          width: "auto",
          objectFit: "contain",
          filter: isLightBg ? "drop-shadow(0 1px 3px rgba(0,0,0,0.15))" : "none",
        }}
      />

      {/* Logo MGM Mini (Tinggi 38px) */}
      <Img
        src={logoMgm}
        alt="MGM Logo"
        style={{
          height: 38,
          width: "auto",
          objectFit: "contain",
          filter: isLightBg ? "drop-shadow(0 1px 3px rgba(0,0,0,0.15))" : "none",
        }}
      />

      {/* Vertical Divider */}
      <div
        style={{
          width: 1.5,
          height: 24,
          backgroundColor: isLightBg
            ? "rgba(15, 23, 42, 0.25)"
            : "rgba(255, 255, 255, 0.25)",
          margin: "0 4px",
        }}
      />

      {/* Watermark Initial SHAM (Font Size 18px Bold) */}
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: isLightBg ? "#0F172A" : "#FFFFFF",
          opacity: 0.95,
          userSelect: "none",
        }}
      >
        SHAM
      </span>
    </div>
  );
};

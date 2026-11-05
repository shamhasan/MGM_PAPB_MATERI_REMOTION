import React from "react";
import { FlowStep, SEARCH_FLOW_STEPS } from "../assets/code";

export interface QueryParticle {
  id: string;
  text: string;
  x: number; // Posisi horizontal relatif terhadap pipa (px)
  scale?: number;
  opacity?: number;
}

export interface FlowPipelineProps {
  activeStepId?: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  activeNodes?: string[]; // Daftar ID node yang sedang menyala/aktif
  debounceTimerProgress?: number;
  queryParticles?: QueryParticle[];
  cancelledBurst?: boolean;
  style?: React.CSSProperties;
}

/**
 * Konveyor rel pipa Flow 7 stasiun (Scene 5).
 * Sesuai spesifikasi docs/04-design-delta.md bagian 4.B & Gambar 3 Modul 08.
 */
export const FlowPipeline: React.FC<FlowPipelineProps> = ({
  activeStepId,
  activeNodes = [],
  queryParticles = [],
  cancelledBurst = false,
  style,
}) => {
  // Penentuan warna node sesuai dokumen spesifikasi 4.B
  const getNodeColor = (id: FlowStep["id"]) => {
    switch (id) {
      case "A":
      case "B":
      case "C":
        return { bg: "var(--c-ui, #3B82F6)", text: "#FFFFFF", border: "#60A5FA" };
      case "D":
        return { bg: "var(--c-vm, #F97316)", text: "var(--text-dark, #0F172A)", border: "#FB923C" };
      case "E":
        return { bg: "var(--c-coroutine, #8B5CF6)", text: "#FFFFFF", border: "#A78BFA" };
      case "F":
        return { bg: "var(--c-repo, #22C55E)", text: "var(--text-dark, #0F172A)", border: "#4ADE80" };
      case "G":
        return { bg: "#1E293B", text: "#FFFFFF", border: "#38BDF8" };
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: 1760,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
    >
      {/* Rel Pipa Kaca Konveyor */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 130,
          borderRadius: 32,
          backgroundColor: "var(--pipe-bg, rgba(15, 23, 42, 0.05))",
          border: "2px solid var(--pipe-border, rgba(6, 182, 212, 0.35))",
          boxShadow: "0 0 24px var(--pipe-glow, rgba(6, 182, 212, 0.2))",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          overflow: "visible",
        }}
      >
        {/* Lintasan Rel Tengah */}
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            height: 4,
            backgroundColor: "rgba(6, 182, 212, 0.25)",
            zIndex: 1,
          }}
        />

        {/* 7 Stasiun Lingkaran (Node A - G) */}
        {SEARCH_FLOW_STEPS.map((step) => {
          const colors = getNodeColor(step.id);
          const isNodeActive = activeStepId === step.id || activeNodes.includes(step.id);

          return (
            <div
              key={step.id}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 3,
              }}
            >
              {/* Lingkaran Stasiun 64x64px */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor: isNodeActive ? colors.bg : "var(--editor-bg, #282A36)",
                  color: isNodeActive ? colors.text : "var(--text-muted, #94A3B8)",
                  border: `3px solid ${isNodeActive ? colors.border : "rgba(255, 255, 255, 0.15)"}`,
                  boxShadow: isNodeActive ? `0 0 20px ${colors.border}` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  fontWeight: 800,
                  userSelect: "none",
                }}
              >
                {step.id}
              </div>

              {/* Sublabel di Bawah Node (docs/04 section 3) */}
              <div
                style={{
                  position: "absolute",
                  top: 78,
                  width: 220,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 800,
                    fontSize: 18,
                    color: isNodeActive ? "var(--text-dark, #0F172A)" : "var(--text-muted, #64748B)",
                  }}
                >
                  {step.label}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isNodeActive ? "var(--text-dark, #1E293B)" : "var(--text-muted, #64748B)",
                    lineHeight: 1.3,
                  }}
                >
                  {step.sublabel}
                </span>
              </div>
            </div>
          );
        })}

        {/* Partikel Query Berjalan di Dalam Pipa */}
        {queryParticles.map((particle) => (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: particle.x,
              top: "50%",
              transform: `translate(-50%, -50%) scale(${particle.scale ?? 1})`,
              opacity: particle.opacity ?? 1,
              padding: "6px 16px",
              borderRadius: 999,
              backgroundColor: "var(--c-flow, #06B6D4)",
              color: "var(--on-flow, #0F172A)",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800,
              fontSize: 14,
              boxShadow: "0 0 16px rgba(6, 182, 212, 0.6)",
              zIndex: 4,
              pointerEvents: "none",
            }}
          >
            {particle.text}
          </div>
        ))}

        {/* Efek Ledakan Pembatalan (cancelBurst) */}
        {cancelledBurst && (
          <div
            style={{
              position: "absolute",
              left: "60%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 90,
              height: 90,
              borderRadius: "50%",
              border: "3px dashed var(--c-cancel, #EF4444)",
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              boxShadow: "0 0 30px rgba(239, 68, 68, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--c-cancel, #EF4444)",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800,
              fontSize: 12,
              zIndex: 5,
            }}
          >
            BURST!
          </div>
        )}
      </div>
    </div>
  );
};


import React from "react";
import { GitBranch, ShieldAlert } from "lucide-react";

export interface ParentChildTreeProps {
  status?: "idle" | "running" | "cancelled";
  hasWarning?: boolean;
  warningShake?: number;
  laserSweepProgress?: number; // 0..1 untuk sapuan garis potong laser
  childLabel?: string;
  style?: React.CSSProperties;
}

/**
 * Diagram pohon hierarki Structured Concurrency (Scene 3).
 * Sesuai spesifikasi docs/04-design-delta.md bagian 4.D.
 */
export const ParentChildTree: React.FC<ParentChildTreeProps> = ({
  status = "idle",
  hasWarning = false,
  warningShake = 0,
  laserSweepProgress = 0,
  childLabel = "Job #1: loadStudents()",
  style,
}) => {
  const isCancelled = status === "cancelled";
  const isRunning = status === "running";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
    >
      {/* Node Induk: HomeViewModel (380 x 126 px) */}
      <div
        style={{
          width: 380,
          height: 126,
          borderRadius: 16,
          border: "2px solid var(--c-vm, #F97316)",
          backgroundColor: "var(--editor-bg, #282A36)",
          boxShadow: "0 12px 28px rgba(249, 115, 22, 0.15)",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: "var(--c-vm, #F97316)",
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--c-vm, #F97316)",
              }}
            >
              HomeViewModel
            </span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted, #94A3B8)" }}>
            Lifecycle-Bound
          </span>
        </div>

        {/* Ruang Lingkup: viewModelScope */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            backgroundColor: "rgba(249, 115, 22, 0.14)",
            border: "1px solid rgba(249, 115, 22, 0.35)",
            color: "var(--text-light, #F8F8F2)",
          }}
        >
          <GitBranch size={20} color="var(--c-vm, #F97316)" />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            viewModelScope
          </span>
        </div>
      </div>

      {/* Garis Penghubung Vertikal Putus-putus */}
      <div
        style={{
          width: 2,
          height: 48,
          borderLeft: "2px dashed var(--c-vm, #F97316)",
          opacity: isCancelled ? 0.4 : 0.8,
        }}
      />

      {/* Node Anak: Job #1 (320 x 88 px) */}
      <div
        style={{
          width: 320,
          height: 88,
          borderRadius: 14,
          backgroundColor: isCancelled ? "rgba(30, 41, 59, 0.6)" : "var(--editor-bg, #282A36)",
          border: isCancelled
            ? "2px solid rgba(239, 68, 68, 0.4)"
            : isRunning
              ? "2px solid var(--life-active, #16A34A)"
              : "2px solid rgba(255, 255, 255, 0.15)",
          boxShadow: isRunning ? "0 0 20px rgba(22, 163, 74, 0.25)" : "none",
          padding: "12px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          opacity: isCancelled ? 0.35 : 1,
          transform: warningShake ? `translateX(${warningShake}px)` : undefined,
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: 16,
              color: isCancelled
                ? "var(--text-muted, #94A3B8)"
                : isRunning
                  ? "var(--life-active, #16A34A)"
                  : "var(--text-light, #F8F8F2)",
            }}
          >
            {childLabel}
          </span>
          <span
            style={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              color: isCancelled
                ? "var(--c-cancel, #EF4444)"
                : isRunning
                  ? "var(--life-active, #16A34A)"
                  : "var(--text-muted, #94A3B8)",
              fontWeight: 700,
            }}
          >
            {isCancelled ? "BATAL" : isRunning ? "ACTIVE" : "STANDBY"}
          </span>
        </div>

        <div style={{ fontSize: 13, color: "var(--text-muted, #94A3B8)", marginTop: 4 }}>
          {isCancelled ? "Pembersihan Otomatis" : "Terikat pada Induk"}
        </div>

        {/* Cap Stempel Merah CANCELLED Miring saat Pembatalan */}
        {isCancelled && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-12deg)",
              border: "3px solid var(--c-cancel, #EF4444)",
              borderRadius: 8,
              padding: "4px 16px",
              color: "var(--c-cancel, #EF4444)",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 900,
              fontSize: 20,
              letterSpacing: "0.15em",
              backgroundColor: "rgba(15, 23, 42, 0.85)",
              pointerEvents: "none",
            }}
          >
            CANCELLED
          </div>
        )}

        {/* Sapuan Garis Laser Neon Pembatalan */}
        {laserSweepProgress > 0 && laserSweepProgress <= 1 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${laserSweepProgress * 100}%`,
              width: 3,
              backgroundColor: "var(--laser, #EF4444)",
              boxShadow: "0 0 16px var(--laser, #EF4444), 0 0 32px var(--laser, #EF4444)",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* Wadah Peringatan Exception Swallowing (ShieldAlert) */}
      {hasWarning && (
        <div
          style={{
            marginTop: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 18px",
            borderRadius: 8,
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            border: "1.5px solid var(--err, #DC2626)",
            color: "var(--err, #DC2626)",
            fontSize: 15,
            fontWeight: 700,
            transform: warningShake ? `translateX(${warningShake}px)` : undefined,
          }}
        >
          <ShieldAlert size={20} />
          <span>Jangan telan CancellationException! Wajib re-throw.</span>
        </div>
      )}
    </div>
  );
};


import React from "react";
import { PHONE_ROWS } from "../assets/code";

export type PhoneScreenMode = "empty" | "loading" | "error" | "success" | "custom";

export interface PhoneMockProps {
  mode?: PhoneScreenMode;
  title?: string;
  errorMessage?: string;
  rows?: string[];
  buttonScale?: number; // for tap animation (1 -> 0.94 -> 1)
  rippleProgress?: number; // 0 to 1
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const PhoneMock: React.FC<PhoneMockProps> = ({
  mode = "empty",
  title = "Home",
  errorMessage = "Unable to resolve host…",
  rows = PHONE_ROWS,
  buttonScale = 1,
  rippleProgress = 0,
  children,
  style,
}) => {
  return (
    <div
      style={{
        width: 440,
        height: 800,
        borderRadius: 48,
        backgroundColor: "#0F172A", // Solid Dark Bezel
        padding: 12,
        boxSizing: "border-box",
        boxShadow: "0 28px 70px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
        border: "1.5px solid rgba(255, 255, 255, 0.15)",
        ...style,
      }}
    >
      {/* Inner Screen - Solid 100% White */}
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: 36,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Top App Bar (64px, "Home") */}
        <div
          style={{
            height: 64,
            minHeight: 64,
            backgroundColor: "#F8FAFC",
            borderBottom: "1.5px solid rgba(15, 23, 42, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#0F172A",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
        </div>

        {/* Screen Content Area */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          }}
        >
          {children ? (
            children
          ) : mode === "loading" ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
              }}
            >
              <div
                className="spinner"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  border: "8px solid rgba(15, 23, 42, 0.15)",
                  borderTopColor: "var(--text-dark, #0F172A)",
                  boxSizing: "border-box",
                }}
              />
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: "var(--text-muted, #64748B)",
                }}
              >
                Memuat data…
              </span>
            </div>
          ) : mode === "error" ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 24px",
                textAlign: "center",
                gap: 24,
              }}
            >
              {/* Error Message */}
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: "var(--err, #DC2626)",
                  lineHeight: 1.35,
                  fontFamily: "'JetBrains Mono', monospace",
                  backgroundColor: "rgba(220, 38, 38, 0.08)",
                  padding: "16px 20px",
                  borderRadius: 16,
                  border: "1.5px solid rgba(220, 38, 38, 0.2)",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {errorMessage}
              </div>

              {/* Retry Button with scale & ripple */}
              <div
                style={{
                  position: "relative",
                  transform: `scale(${buttonScale})`,
                  display: "inline-block",
                }}
              >
                <div
                  style={{
                    backgroundColor: "var(--c-ui, #3B82F6)",
                    color: "var(--on-ui, #FFFFFF)",
                    padding: "14px 32px",
                    borderRadius: 9999,
                    fontSize: 26,
                    fontWeight: 700,
                    boxShadow: "0 6px 18px rgba(59, 130, 246, 0.35)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  Coba Lagi
                  {/* Ripple overlay */}
                  {rippleProgress > 0 && rippleProgress < 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: 140 * rippleProgress,
                        height: 140 * rippleProgress,
                        transform: "translate(-50%, -50%)",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        opacity: 1 - rippleProgress,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : mode === "success" ? (
            <div
              style={{
                flex: 1,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                overflow: "hidden",
              }}
            >
              {rows.map((rowText, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    backgroundColor: "var(--bg-light, #F8FAFC)",
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "var(--text-dark, #0F172A)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "var(--ok, #16A34A)",
                    }}
                  />
                  <span>{rowText}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

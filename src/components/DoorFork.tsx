import React from "react";

export interface DoorForkProps {
  activeDoor?: "none" | "onResponse" | "onFailure" | "both";
  responseStatus?: "ok" | "err" | "neutral";
  failureStatus?: "ok" | "err" | "neutral";
  showCheckGate?: boolean; // Diamond gate: isSuccessful && body != null
  gatePassed?: boolean;
  onResponseDetail?: string;
  onFailureDetail?: string;
  style?: React.CSSProperties;
}

export const DoorFork: React.FC<DoorForkProps> = ({
  activeDoor = "none",
  responseStatus = "ok",
  failureStatus = "err",
  showCheckGate = false,
  gatePassed,
  onResponseDetail,
  onFailureDetail,
  style,
}) => {
  const isResponseActive = activeDoor === "onResponse" || activeDoor === "both";
  const isFailureActive = activeDoor === "onFailure" || activeDoor === "both";

  const responseBorderColor = isResponseActive
    ? responseStatus === "ok"
      ? "var(--ok, #16A34A)"
      : "var(--err, #DC2626)"
    : "rgba(15, 23, 42, 0.15)";

  const failureBorderColor = isFailureActive
    ? failureStatus === "err"
      ? "var(--err, #DC2626)"
      : "var(--ok, #16A34A)"
    : "rgba(15, 23, 42, 0.15)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 36,
        userSelect: "none",
        fontFamily: "'JetBrains Mono', monospace",
        position: "relative",
        ...style,
      }}
    >
      {/* Door 1: onResponse (360x140, sudut 16px, nama mono 32) */}
      <div
        style={{
          width: 360,
          height: 140,
          borderRadius: 16,
          backgroundColor: isResponseActive ? "#FFFFFF" : "var(--bg-light, #F8FAFC)",
          border: `6px solid ${responseBorderColor}`,
          boxShadow: isResponseActive
            ? "0 12px 32px rgba(0, 0, 0, 0.12)"
            : "0 4px 12px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 20px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "var(--text-dark, #0F172A)",
          }}
        >
          onResponse
        </div>
        {onResponseDetail && (
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 22,
              fontWeight: 500,
              color: "var(--text-muted, #64748B)",
              marginTop: 6,
            }}
          >
            {onResponseDetail}
          </div>
        )}

        {/* Gerbang Belah Ketupat 56px: isSuccessful && body != null */}
        {showCheckGate && (
          <div
            style={{
              position: "absolute",
              right: -140,
              display: "flex",
              alignItems: "center",
              gap: 16,
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                transform: "rotate(45deg)",
                backgroundColor:
                  gatePassed === true
                    ? "var(--ok, #16A34A)"
                    : gatePassed === false
                    ? "var(--err, #DC2626)"
                    : "var(--text-dark, #0F172A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                style={{
                  transform: "rotate(-45deg)",
                  color: "#FFFFFF",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                ?
              </div>
            </div>

            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "var(--text-dark, #0F172A)",
                backgroundColor: "#FFFFFF",
                padding: "6px 14px",
                borderRadius: 8,
                border: "1.5px solid rgba(15, 23, 42, 0.15)",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            >
              isSuccessful && body != null
            </div>
          </div>
        )}
      </div>

      {/* Door 2: onFailure (360x140, sudut 16px, nama mono 32) */}
      <div
        style={{
          width: 360,
          height: 140,
          borderRadius: 16,
          backgroundColor: isFailureActive ? "#FFFFFF" : "var(--bg-light, #F8FAFC)",
          border: `6px solid ${failureBorderColor}`,
          boxShadow: isFailureActive
            ? "0 12px 32px rgba(0, 0, 0, 0.12)"
            : "0 4px 12px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 20px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "var(--text-dark, #0F172A)",
          }}
        >
          onFailure
        </div>
        {onFailureDetail && (
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 22,
              fontWeight: 500,
              color: "var(--text-muted, #64748B)",
              marginTop: 6,
            }}
          >
            {onFailureDetail}
          </div>
        )}
      </div>
    </div>
  );
};

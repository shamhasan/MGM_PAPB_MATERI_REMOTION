import React from "react";

export interface StationData {
  number: number;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
}

export interface RailProps {
  stations: StationData[];
  activeStationIndex: number; // 0 to 4
  tokenPositionX?: number; // animated pixel x position of the 40px token
  style?: React.CSSProperties;
}

export const Rail: React.FC<RailProps> = ({
  stations,
  activeStationIndex,
  tokenPositionX,
  style,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: 1600,
        height: 220,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        userSelect: "none",
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
    >
      {/* Horizontal Rail Connecting Line at center of number circles (y = 28px) */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 160,
          right: 160,
          height: 4,
          backgroundColor: "rgba(15, 23, 42, 0.15)",
          zIndex: 1,
        }}
      />

      {/* Floating 40px Moving Token on Rail if provided */}
      {tokenPositionX !== undefined && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: tokenPositionX - 20, // center the 40px circle
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "var(--text-dark, #0F172A)",
            border: "3px solid #FFFFFF",
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.4)",
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
      )}

      {/* 5 Station Slots (each 320px wide) */}
      {stations.map((st, idx) => {
        const isPassed = idx < activeStationIndex;
        const isActive = idx === activeStationIndex;
        const isPending = idx > activeStationIndex;

        const circleBg = isActive
          ? "var(--text-dark, #0F172A)"
          : isPassed
          ? "rgba(15, 23, 42, 0.4)"
          : "#FFFFFF";

        const circleColor = isActive
          ? "#FFFFFF"
          : isPassed
          ? "#FFFFFF"
          : "var(--text-muted, #64748B)";

        const circleBorder = isPending
          ? "3px solid var(--text-muted, #64748B)"
          : "3px solid transparent";

        const slotOpacity = isPassed ? 0.6 : isPending ? 0.75 : 1;

        return (
          <div
            key={st.number}
            style={{
              width: 320,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
              zIndex: 2,
              opacity: slotOpacity,
              transition: "opacity 0.2s ease",
            }}
          >
            {/* Number Circle (56px) */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: circleBg,
                color: circleColor,
                border: circleBorder,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 700,
                boxShadow: isActive ? "0 6px 16px rgba(15, 23, 42, 0.25)" : "none",
                marginBottom: 16,
              }}
            >
              {st.number}
            </div>

            {/* Station Lucide Icon (96px, stroke 2) */}
            <div
              style={{
                width: 96,
                height: 96,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isActive
                  ? "var(--text-dark, #0F172A)"
                  : "var(--text-muted, #64748B)",
                marginBottom: 12,
              }}
            >
              {st.icon}
            </div>

            {/* Station Title (Inter Bold 44px) */}
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                lineHeight: 1.15,
                color: "var(--text-dark, #0F172A)",
                marginBottom: 6,
              }}
            >
              {st.name}
            </div>

            {/* Station Subtitle (Inter 30px) */}
            <div
              style={{
                fontSize: 30,
                fontWeight: 500,
                color: "var(--text-muted, #64748B)",
                lineHeight: 1.25,
              }}
            >
              {st.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
};

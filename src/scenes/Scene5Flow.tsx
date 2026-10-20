import React from "react";
import { spring, interpolate, Easing } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";

// ─── Konstanta Layout ────────────────────────────────────────────────────────

const BOX_W = 410;
const BOX_H = 200;
const GAP = 40;
const TOTAL_W = BOX_W * 4 + GAP * 3; // 1760
const START_X = (1920 - TOTAL_W) / 2; // 80
const BOX_Y = 380;

const LAYER_ORDER = ["ui", "viewmodel", "repository", "datasource"] as const;
type Layer = (typeof LAYER_ORDER)[number];

const LAYER_NAMES: Record<Layer, string> = {
  ui: "Composable UI",
  viewmodel: "ViewModel",
  repository: "Repository",
  datasource: "Data Source",
};

const LAYER_COLORS: Record<Layer, string> = {
  ui: "var(--c-ui, #3B82F6)",
  viewmodel: "var(--c-vm, #F97316)",
  repository: "var(--c-repo, #22C55E)",
  datasource: "var(--c-ds, #1E3A8A)",
};


// Caption kode per layer per arah aliran
const EVENT_CAPTIONS: Record<Layer, string> = {
  ui: "onClick { … }",
  viewmodel: "loadStudent(id)",
  repository: "getStudentById(id)",
  datasource: "students.find { … }",
};

const STATE_CAPTIONS: Record<Layer, string> = {
  datasource: "Student",
  repository: "Student",
  viewmodel: "DetailUiState",
  ui: "render ke layar",
};

// ─── Helper easing ────────────────────────────────────────────────────────────

function easeSpring(p: number, frames: number): number {
  return spring({
    frame: p * frames,
    fps: FPS,
    durationInFrames: frames,
    config: { stiffness: 120, damping: 14 },
  });
}

function easeOpacity(p: number): number {
  return interpolate(p, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Komponen Kotak Seragam ───────────────────────────────────────────────────

interface BoxProps {
  layer: Layer;
  index: number;
  pulse: number;       // 0–1 pulse progress untuk efek berdenyut
  morphP: number;      // morphToBoxes progress
  caption: string;
  captionOpacity: number;
  captionBelow: boolean; // true = caption di bawah (event), false = di atas (state)
}

const FlowBox: React.FC<BoxProps> = ({
  layer,
  index,
  pulse,
  morphP,
  caption,
  captionOpacity,
  captionBelow,
}) => {
  const x = START_X + index * (BOX_W + GAP);
  const pulseFactor = 1 + 0.05 * Math.sin(Math.PI * pulse);
  const glowOpacity = pulse * 0.8;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: BOX_Y,
        width: BOX_W,
        height: BOX_H,
        opacity: easeOpacity(morphP),
        transform: `scale(${pulseFactor})`,
        transformOrigin: "center center",
      }}
    >
      {/* Glow ring saat pulse */}
      <div
        style={{
          position: "absolute",
          inset: -8,
          borderRadius: 28,
          boxShadow: `0 0 0 4px ${LAYER_COLORS[layer]}`,
          opacity: glowOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Kotak */}
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "var(--bg-light, #F8FAFC)",
          border: `3px solid ${LAYER_COLORS[layer]}`,
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: LAYER_COLORS[layer],
            textAlign: "center",
            lineHeight: 1.15,
            padding: "0 16px",
          }}
        >
          {LAYER_NAMES[layer]}
        </div>
      </div>

      {/* Caption kode */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: BOX_W,
          textAlign: "center",
          top: captionBelow ? BOX_H + 16 : undefined,
          bottom: captionBelow ? undefined : BOX_H + 16,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 28,
          color: "var(--text-muted, #64748B)",
          opacity: captionOpacity,
          pointerEvents: "none",
        }}
      >
        {caption}
      </div>
    </div>
  );
};

// ─── Komponen Konektor Abu-abu ────────────────────────────────────────────────

const Connectors: React.FC<{ opacity: number }> = ({ opacity }) => {
  const arrowY = BOX_Y + BOX_H / 2;
  const totalConnectorW = TOTAL_W;

  return (
    <svg
      style={{
        position: "absolute",
        left: START_X,
        top: arrowY - 2,
        width: totalConnectorW,
        height: 4,
        opacity,
        pointerEvents: "none",
      }}
      viewBox={`0 0 ${totalConnectorW} 4`}
      preserveAspectRatio="none"
    >
      {[0, 1, 2].map((i) => {
        const x1 = i * (BOX_W + GAP) + BOX_W;
        const x2 = x1 + GAP;
        return (
          <line
            key={i}
            x1={x1}
            y1={2}
            x2={x2}
            y2={2}
            stroke="var(--text-muted, #64748B)"
            strokeWidth={2}
            strokeDasharray="6 4"
          />
        );
      })}
    </svg>
  );
};

// ─── Komponen Panah Aliran ────────────────────────────────────────────────────

interface FlowArrowProps {
  p: number;           // progress 0→1
  color: string;
  label: string;
  above: boolean;      // true = di atas kotak (event), false = di bawah (state)
  direction: "ltr" | "rtl";
}

const FlowArrow: React.FC<FlowArrowProps> = ({ p, color, label, above, direction }) => {
  // Path horizontal across all 4 boxes
  const pathY = above ? BOX_Y - 56 : BOX_Y + BOX_H + 56;
  const arrowX1 = START_X + BOX_W / 2;
  const arrowX2 = START_X + TOTAL_W - BOX_W / 2;
  const pathLength = arrowX2 - arrowX1;

  const strokeOffset = 1 - p;
  const headVisible = p >= 0.9;
  const headX = direction === "ltr" ? arrowX1 + p * pathLength : arrowX2 - p * pathLength;

  const labelY = above ? pathY - 48 : pathY + 48;

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        pointerEvents: "none",
        overflow: "visible",
      }}
      viewBox="0 0 1920 1080"
    >
      {/* Garis panah menggunakan pathLength=1 dan strokeDasharray=1 */}
      <path
        d={`M ${direction === "ltr" ? arrowX1 : arrowX2},${pathY} L ${direction === "ltr" ? arrowX2 : arrowX1},${pathY}`}
        fill="none"
        stroke={color}
        strokeWidth={6}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={strokeOffset}
        strokeLinecap="round"
      />

      {/* Kepala panah — elemen terpisah, muncul saat p >= 0.9 */}
      {headVisible && (
        <polygon
          points={
            direction === "ltr"
              ? `${headX},${pathY - 12} ${headX + 20},${pathY} ${headX},${pathY + 12}`
              : `${headX},${pathY - 12} ${headX - 20},${pathY} ${headX},${pathY + 12}`
          }
          fill={color}
          opacity={interpolate(p, [0.9, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      )}

      {/* Label teks */}
      <text
        x={START_X + TOTAL_W / 2}
        y={labelY}
        textAnchor="middle"
        fontSize={42}
        fontWeight={700}
        fontFamily="'Inter', sans-serif"
        fill={color}
        opacity={easeOpacity(interpolate(p, [0, 0.2], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }))}
      >
        {label}
      </text>
    </svg>
  );
};

// ─── Komponen Utama Scene 5 ───────────────────────────────────────────────────

export const Scene5Flow: React.FC = () => {
  // State 15 — morphToBoxes (scene 4, stop 0, 24 frame)
  const pMorph = useStopProgress(4, 0);

  // State 16 — flowArrow event (scene 4, stop 1, 60 frame)
  const pEvent = useStopProgress(4, 1);

  // State 17 — flowArrow state (scene 4, stop 2, 60 frame)
  const pState = useStopProgress(4, 2);

  const morphSpring = easeSpring(pMorph, 24);

  // ── Pulse per kotak untuk event (LTR: index 0→3) ──
  function eventPulse(index: number): number {
    // Ujung panah berada di posisi kotak index ketika p ≈ index/3
    const center = index / 3;
    const q = Math.max(0, 1 - Math.abs(pEvent - center) / 0.18);
    return q;
  }

  // ── Pulse per kotak untuk state (RTL: index 3→0) ──
  function statePulse(index: number): number {
    const center = (3 - index) / 3;
    const q = Math.max(0, 1 - Math.abs(pState - center) / 0.18);
    return q;
  }

  // ── Caption opacity per kotak: fade in saat pulse, lalu tetap muncul ──
  function eventCaptionOpacity(index: number): number {
    const center = index / 3;
    const threshold = center - 0.1;
    return easeOpacity(
      interpolate(pEvent, [threshold, threshold + 0.15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
  }

  // State captions: crossfade (tiap caption ganti saat ujung panah melewati kotak)
  function stateCaptionOpacity(index: number): number {
    const center = (3 - index) / 3;
    const threshold = center - 0.1;
    return easeOpacity(
      interpolate(pState, [threshold, threshold + 0.15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
  }

  // Header fade-in
  const headerOpacity = easeOpacity(morphSpring);

  // Dependency text fade-in
  const depTextOpacity = easeOpacity(
    interpolate(pMorph, [0.5, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Connector opacity
  const connectorOpacity = easeOpacity(morphSpring);

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--bg-light, #F8FAFC)",
        fontFamily: "'Inter', sans-serif",
        userSelect: "none",
      }}
    >
      {/* Judul "Aliran Eksekusi" */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          textAlign: "center",
          opacity: headerOpacity,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "var(--text-dark, #0F172A)",
            lineHeight: 1.1,
          }}
        >
          Aliran Eksekusi
        </div>
      </div>

      {/* Konektor abu-abu antar kotak */}
      <Connectors opacity={connectorOpacity} />

      {/* 4 Kotak Seragam */}
      {LAYER_ORDER.map((layer, index) => {
        const isEventActive = pEvent > 0;
        const isStateActive = pState > 0;

        const caption = isStateActive
          ? STATE_CAPTIONS[layer]
          : EVENT_CAPTIONS[layer];

        const captionOpacity = isStateActive
          ? stateCaptionOpacity(index)
          : isEventActive
          ? eventCaptionOpacity(index)
          : 0;

        const pulseVal = isStateActive
          ? statePulse(index)
          : isEventActive
          ? eventPulse(index)
          : 0;

        return (
          <FlowBox
            key={layer}
            layer={layer}
            index={index}
            pulse={pulseVal}
            morphP={morphSpring}
            caption={caption}
            captionOpacity={captionOpacity}
            captionBelow={!isStateActive}
          />
        );
      })}

      {/* Teks dependency bawah */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          textAlign: "center",
          opacity: depTextOpacity,
          fontSize: 42,
          fontWeight: 600,
          color: "var(--text-muted, #64748B)",
        }}
      >
        Arah dependency: UI → ViewModel → Repository → Data Source
      </div>

      {/* Panah Event (State 16) */}
      {pEvent > 0 && (
        <FlowArrow
          p={pEvent}
          color="var(--arrow-event, #0F172A)"
          label="User Event / Request"
          above={true}
          direction="ltr"
        />
      )}

      {/* Panah State (State 17) */}
      {pState > 0 && (
        <FlowArrow
          p={pState}
          color="var(--arrow-state, #A855F7)"
          label="Model Data → UI State"
          above={false}
          direction="rtl"
        />
      )}
    </div>
  );
};

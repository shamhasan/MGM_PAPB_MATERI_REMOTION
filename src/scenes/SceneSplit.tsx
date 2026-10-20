import React, { useMemo } from "react";
import { spring, interpolate, Easing } from "remotion";
import { Highlight, themes } from "prism-react-renderer";
import { useStopProgress } from "../deck/useStopProgress";
import { RAW_CODE, parseLayers, dedentLines, Layer, LAYER_METADATA } from "../assets/code";
import { EditorWindow } from "../components/EditorWindow";
import { Laser } from "../components/Laser";
import { FPS } from "../deck/stops";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Konstanta Rect Awal & Akhir didefinisikan sekali dan dipakai bersama (docs/05 & 07)
const INITIAL_RECTS: Record<Layer, Rect> = {
  datasource: { x: 80, y: 253, w: 1760, h: 168 },
  repository: { x: 80, y: 463, w: 1760, h: 84 },
  viewmodel: { x: 80, y: 589, w: 1760, h: 168 },
  ui: { x: 80, y: 799, w: 1760, h: 126 },
};

const FINAL_RECTS: Record<Layer, Rect> = {
  ui: { x: 80, y: 150, w: 410, h: 440 },
  viewmodel: { x: 530, y: 150, w: 410, h: 440 },
  repository: { x: 980, y: 150, w: 410, h: 440 },
  datasource: { x: 1430, y: 150, w: 410, h: 440 },
};

const ORDERED_LAYERS: Layer[] = ["ui", "viewmodel", "repository", "datasource"];

export const SceneSplit: React.FC = () => {
  const { lines, layerOf } = useMemo(() => parseLayers(RAW_CODE), []);

  // Stop 3.0: sceneIn (18 frame)
  const pSceneIn = useStopProgress(2, 0);

  // Stop 3.1: laserCut (48 frame)
  const pLaserCut = useStopProgress(2, 1);

  // Stop 3.2: splitBlock (36 frame)
  const pSplit = useStopProgress(2, 2);

  // Scene 4: Stops 1 s.d. 4 (focusGrow berurutan)
  const pFocusDs = useStopProgress(3, 1);
  const pFocusRepo = useStopProgress(3, 2);
  const pFocusVm = useStopProgress(3, 3);
  const pFocusUi = useStopProgress(3, 4);

  // Dedented code snippets per layer
  const snippets = useMemo(() => {
    const map: Record<Layer, string> = {
      datasource: "",
      repository: "",
      viewmodel: "",
      ui: "",
    };
    for (const l of ORDERED_LAYERS) {
      const layerLines: string[] = [];
      lines.forEach((line, idx) => {
        if (layerOf[idx] === l) {
          layerLines.push(line);
        }
      });
      map[l] = dedentLines(layerLines, 4).join("\n");
    }
    return map;
  }, [lines, layerOf]);

  // Laser cut sweep progresses (16 frame each)
  const cut1 = interpolate(pLaserCut, [0, 1 / 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cut2 = interpolate(pLaserCut, [1 / 3, 2 / 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cut3 = interpolate(pLaserCut, [2 / 3, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene opacity from sceneIn
  const sceneOpacity = interpolate(pSceneIn, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Split spring (36 frames)
  const splitSpring = spring({
    frame: pSplit * 36,
    fps: FPS,
    durationInFrames: 36,
    config: { stiffness: 120, damping: 14 },
  });

  // Editor chrome and wrapper lines fade out
  const chromeOpacity = interpolate(pSplit, [0, 0.4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background cross-fade from dark to light
  const bgLightOpacity = interpolate(pSplit, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Helper focus card calculation
  const getCardScaleAndGlow = (layer: Layer) => {
    let focusProgress = 0;
    let unfocusProgress = 0;

    if (layer === "datasource") {
      focusProgress = pFocusDs;
      unfocusProgress = pFocusRepo;
    } else if (layer === "repository") {
      focusProgress = pFocusRepo;
      unfocusProgress = pFocusVm;
    } else if (layer === "viewmodel") {
      focusProgress = pFocusVm;
      unfocusProgress = pFocusUi;
    } else if (layer === "ui") {
      focusProgress = pFocusUi;
      unfocusProgress = 0;
    }

    const growSpring = spring({
      frame: focusProgress * 24,
      fps: FPS,
      durationInFrames: 24,
      config: { stiffness: 120, damping: 14 },
    });

    const shrinkSpring = spring({
      frame: unfocusProgress * 24,
      fps: FPS,
      durationInFrames: 24,
      config: { stiffness: 120, damping: 14 },
    });

    // Scale 1 -> 1.12 -> 1
    const currentScale = 1 + 0.12 * growSpring - 0.12 * shrinkSpring;
    const isFocused = focusProgress > 0 && unfocusProgress < 1;

    return {
      scale: currentScale,
      zIndex: isFocused ? 20 : 10,
      glow: isFocused,
    };
  };

  // Label visibility (fades in and translates up 16px, stays permanently)
  const getLabelTransformAndOpacity = (layer: Layer) => {
    let p = 0;
    if (layer === "datasource") p = pFocusDs;
    else if (layer === "repository") p = pFocusRepo;
    else if (layer === "viewmodel") p = pFocusVm;
    else if (layer === "ui") p = pFocusUi;

    const spr = spring({
      frame: p * 24,
      fps: FPS,
      durationInFrames: 24,
      config: { stiffness: 120, damping: 14 },
    });

    const opacity = interpolate(p, [0, 1], [0, 1], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const translateY = interpolate(spr, [0, 1], [16, 0]);

    return { opacity, translateY };
  };

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        opacity: sceneOpacity,
        overflow: "hidden",
        userSelect: "none",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background Dark (Scene 3) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "var(--bg-dark, #191A21)",
        }}
      />

      {/* Background Light (Fade in during splitBlock) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "var(--bg-light, #F8FAFC)",
          opacity: bgLightOpacity,
        }}
      />

      {/* Editor Frame & Wrapper Lines (fade out on split) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 93,
          width: 1760,
          opacity: chromeOpacity,
          pointerEvents: "none",
        }}
      >
        <EditorWindow>
          {/* Top wrapper lines (1 & 2) */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 30,
              lineHeight: 1.4,
              color: "var(--text-light, #F8F8F2)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", height: 42 }}>
              <div style={{ width: 56, textAlign: "right", paddingRight: 28, color: "var(--text-muted, #64748B)" }}>
                1
              </div>
              <div style={{ color: "#FF79C6" }}>@Composable</div>
            </div>
            <div style={{ display: "flex", height: 42 }}>
              <div style={{ width: 56, textAlign: "right", paddingRight: 28, color: "var(--text-muted, #64748B)" }}>
                2
              </div>
              <div>
                <span style={{ color: "#FF79C6" }}>fun </span>
                <span style={{ color: "#50FA7B" }}>DetailScreen</span>
                <span>(studentId: </span>
                <span style={{ color: "#8BE9FD" }}>Int</span>
                <span>) &#123;</span>
              </div>
            </div>

            {/* Spacer for 4 layer blocks and empty lines (height: 714px) */}
            <div style={{ height: 714 }} />

            {/* Bottom wrapper line (19) */}
            <div style={{ display: "flex", height: 42 }}>
              <div style={{ width: 56, textAlign: "right", paddingRight: 28, color: "var(--text-muted, #64748B)" }}>
                19
              </div>
              <div>&#125;</div>
            </div>
          </div>
        </EditorWindow>
      </div>

      {/* 3 Laser Cut Lines (during Stop 3.1) */}
      {pSplit === 0 && (
        <>
          {/* Cut 1 (between datasource & repository, Y = 442) */}
          <div style={{ position: "absolute", left: 80, top: 442, width: 1760 }}>
            <Laser progress={cut1} width={1760} />
          </div>

          {/* Cut 2 (between repository & viewmodel, Y = 568) */}
          <div style={{ position: "absolute", left: 80, top: 568, width: 1760 }}>
            <Laser progress={cut2} width={1760} />
          </div>

          {/* Cut 3 (between viewmodel & ui, Y = 778) */}
          <div style={{ position: "absolute", left: 80, top: 778, width: 1760 }}>
            <Laser progress={cut3} width={1760} />
          </div>
        </>
      )}

      {/* 4 Pecahan Blok Kode Berpindah Secara Absolut */}
      {ORDERED_LAYERS.map((layer) => {
        const initial = INITIAL_RECTS[layer];
        const final = FINAL_RECTS[layer];
        const meta = LAYER_METADATA[layer];

        // Interpolasi posisi & ukuran selama splitBlock
        const currentX = interpolate(splitSpring, [0, 1], [initial.x, final.x]);
        const currentY = interpolate(splitSpring, [0, 1], [initial.y, final.y]);
        const currentW = interpolate(splitSpring, [0, 1], [initial.w, final.w]);
        const currentH = interpolate(splitSpring, [0, 1], [initial.h, final.h]);

        // Bilah warna lapisan 8px
        const isCut =
          (layer === "datasource" && cut1 >= 1) ||
          (layer === "repository" && cut2 >= 1) ||
          (layer === "viewmodel" && cut3 >= 1) ||
          (layer === "ui" && cut3 >= 1);

        const { scale, zIndex, glow } = getCardScaleAndGlow(layer);
        const { opacity: labelOpacity, translateY: labelY } = getLabelTransformAndOpacity(layer);

        // Thumbnail code font size in card mode
        const codeFontSize = interpolate(splitSpring, [0, 1], [30, 15]);
        const codeLineHeight = interpolate(splitSpring, [0, 1], [42, 22]);

        const cardShadow = glow
          ? `0 0 0 6px ${meta.colorVar}33, 0 16px 40px #0F172A33`
          : pSplit > 0
          ? "0 12px 32px rgba(15, 23, 42, 0.12)"
          : "none";

        return (
          <React.Fragment key={layer}>
            {/* Card / Sliced Block */}
            <div
              style={{
                position: "absolute",
                left: currentX,
                top: currentY,
                width: currentW,
                height: currentH,
                backgroundColor: "var(--editor-bg, #282A36)",
                borderRadius: interpolate(splitSpring, [0, 1], [0, 16]),
                borderLeft: isCut && pSplit < 0.5 ? `8px solid ${meta.colorVar}` : "none",
                borderTop: pSplit >= 0.5 ? `8px solid ${meta.colorVar}` : "none",
                boxShadow: cardShadow,
                transform: `scale(${scale})`,
                zIndex,
                overflow: "hidden",
                boxSizing: "border-box",
                padding: pSplit >= 0.5 ? "20px 24px" : "0 24px 0 108px",
                display: "flex",
                flexDirection: "column",
                justifyContent: pSplit >= 0.5 ? "flex-start" : "center",
              }}
            >
              {/* Highlighted code inside piece */}
              <Highlight theme={themes.dracula} code={snippets[layer]} language="kotlin">
                {({ tokens, getLineProps, getTokenProps }) => (
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: codeFontSize, lineHeight: `${codeLineHeight}px` }}>
                    {tokens.map((lineTokens, lineIdx) => (
                      <div key={lineIdx} {...getLineProps({ line: lineTokens })} style={{ whiteSpace: "pre" }}>
                        {lineTokens.map((token, tokenIdx) => (
                          <span key={tokenIdx} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </Highlight>
            </div>

            {/* Label di Bawah Kartu (Scene 4) */}
            {pSplit >= 0.8 && (
              <div
                style={{
                  position: "absolute",
                  left: final.x,
                  top: final.y + final.h + 24,
                  width: final.w,
                  opacity: labelOpacity,
                  transform: `translateY(${labelY}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 12,
                  pointerEvents: "none",
                }}
              >
                {/* Chip Nama Lapisan */}
                <div
                  style={{
                    backgroundColor: meta.colorVar,
                    color: meta.onColorVar,
                    padding: "8px 24px",
                    borderRadius: 9999,
                    fontSize: 34,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  {meta.label}
                </div>

                {/* Deskripsi */}
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    color: "var(--text-dark, #0F172A)",
                    lineHeight: 1.25,
                  }}
                >
                  {meta.description}
                </div>

                {/* Nama Kelas Modul */}
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 26,
                    color: "var(--text-muted, #64748B)",
                    fontWeight: 500,
                  }}
                >
                  {meta.className}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

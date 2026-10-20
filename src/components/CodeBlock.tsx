import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Layer } from "../assets/code";

export interface CodeBlockProps {
  code: string;
  language?: string;
  typeProgress?: number; // 0 to 1
  frame?: number;
  dimmed?: boolean;
  showLineNumbers?: boolean;
  startLineNumber?: number;
  layerOf?: (Layer | null)[];
  style?: React.CSSProperties;
  lineEmphasis?: (lineIdx: number) => number | { opacity?: number; background?: number | string };
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "kotlin",
  typeProgress,
  frame = 0,
  dimmed = false,
  showLineNumbers = true,
  startLineNumber = 1,
  layerOf,
  style,
  lineEmphasis,
}) => {
  const isTyping = typeProgress !== undefined && typeProgress < 1;
  const totalChars = code.length;
  const visibleChars =
    typeProgress !== undefined
      ? Math.floor(typeProgress * totalChars)
      : totalChars;

  // Cursor blinks: 15 frames on, 15 frames off at 30 fps (pure function of frame)
  const showCursor = isTyping && frame % 30 < 15;

  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 30,
        lineHeight: 1.4,
        color: "var(--text-light, #F8F8F2)",
        opacity: dimmed ? 0.3 : 1,
        userSelect: "none",
        ...style,
      }}
    >
      <Highlight theme={themes.dracula} code={code} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => {
          let charOffset = 0;
          const tokenPositions = tokens.map((lineTokens) => {
            const lineData = lineTokens.map((token) => {
              const start = charOffset;
              const end = start + token.content.length;
              charOffset = end;
              return { token, start, end };
            });
            charOffset += 1; // \n
            return lineData;
          });

          return (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {tokens.map((lineTokens, lineIdx) => {
                const lineNumber = startLineNumber + lineIdx;
                const lineLayer = layerOf ? layerOf[lineIdx] : null;
                const lineData = tokenPositions[lineIdx];

                let lineOpacity = dimmed ? 0.3 : 1;
                let lineBackground = "transparent";

                if (lineEmphasis) {
                  const res = lineEmphasis(lineIdx);
                  if (typeof res === "number") {
                    const clamped = Math.max(0, Math.min(1, res));
                    lineOpacity = 0.3 + 0.7 * clamped;
                    if (clamped > 0) {
                      lineBackground = `rgba(255, 255, 255, ${0.125 * clamped})`;
                    }
                  } else if (res) {
                    if (res.opacity !== undefined) {
                      lineOpacity = res.opacity;
                    }
                    if (res.background !== undefined) {
                      lineBackground =
                        typeof res.background === "number"
                          ? `rgba(255, 255, 255, ${res.background})`
                          : res.background;
                    }
                  }
                }

                return (
                  <div
                    key={lineIdx}
                    data-layer={lineLayer || undefined}
                    {...getLineProps({ line: lineTokens })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: 42, // 30px * 1.4
                      position: "relative",
                      opacity: lineOpacity,
                      backgroundColor: lineBackground,
                      borderRadius: 4,
                    }}
                  >
                    {/* Line Number Gutter */}
                    {showLineNumbers && (
                      <div
                        style={{
                          width: 56,
                          minWidth: 56,
                          textAlign: "right",
                          paddingRight: 28,
                          color: "var(--text-muted, #64748B)",
                          fontSize: 30,
                          lineHeight: "42px",
                          userSelect: "none",
                        }}
                      >
                        {lineNumber}
                      </div>
                    )}

                    {/* Line Content */}
                    <div
                      style={{
                        flex: 1,
                        whiteSpace: "pre",
                        display: "flex",
                        alignItems: "center",
                        height: 42,
                      }}
                    >
                      {lineData.map(
                        ({ token, start: tokenStart, end: tokenEnd }, tokenIdx) => {
                          const tokenProps = getTokenProps({ token });

                          // Normal mode: all characters visible
                          if (typeProgress === undefined || typeProgress >= 1) {
                            return (
                              <span key={tokenIdx} {...tokenProps}>
                                {token.content}
                              </span>
                            );
                          }

                          // Fully hidden
                          if (tokenStart >= visibleChars) {
                            return (
                              <span
                                key={tokenIdx}
                                {...tokenProps}
                                style={{ ...tokenProps.style, opacity: 0 }}
                              >
                                {token.content}
                              </span>
                            );
                          }

                          // Fully visible
                          if (tokenEnd <= visibleChars) {
                            return (
                              <span key={tokenIdx} {...tokenProps}>
                                {token.content}
                              </span>
                            );
                          }

                          // Partially visible (boundary token)
                          const visibleLen = visibleChars - tokenStart;
                          const visiblePart = token.content.slice(0, visibleLen);
                          const hiddenPart = token.content.slice(visibleLen);

                          return (
                            <span key={tokenIdx} {...tokenProps}>
                              <span>{visiblePart}</span>
                              {showCursor && (
                                <span
                                  style={{
                                    color: "var(--c-ui, #3B82F6)",
                                    fontWeight: 700,
                                  }}
                                >
                                  |
                                </span>
                              )}
                              <span style={{ opacity: 0 }}>{hiddenPart}</span>
                            </span>
                          );
                        }
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      </Highlight>
    </div>
  );
};

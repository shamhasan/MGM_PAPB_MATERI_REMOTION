import React from "react";
import { Highlight, themes } from "prism-react-renderer";

export interface JsonBlockProps {
  json: string;
  typeProgress?: number; // 0 to 1
  frame?: number;
  fontSize?: number;
  lineHeight?: number;
  lineEmphasis?: (lineNumber: number) => {
    opacity?: number;
    background?: string;
    label?: string;
    labelColor?: string;
  } | null;
  statusChip?: {
    text: string;
    opacity?: number;
  };
  style?: React.CSSProperties;
}

export const JsonBlock: React.FC<JsonBlockProps> = ({
  json,
  typeProgress,
  frame = 0,
  fontSize = 24,
  lineHeight = 1.35,
  lineEmphasis,
  statusChip,
  style,
}) => {
  const lineHeightPx = Math.round(fontSize * lineHeight);
  const totalChars = json.length;
  const isTyping = typeProgress !== undefined && typeProgress < 1;
  const visibleChars =
    typeProgress !== undefined
      ? Math.floor(typeProgress * totalChars)
      : totalChars;

  const showCursor = isTyping && frame % 30 < 15;

  return (
    <div
      style={{
        backgroundColor: "var(--editor-bg, #282A36)",
        borderRadius: 16,
        padding: "24px 32px",
        boxShadow: "0 16px 40px rgba(0, 0, 0, 0.25)",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize,
        lineHeight,
        color: "var(--text-light, #F8F8F2)",
        position: "relative",
        userSelect: "none",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Optional Status Chip in top-right (e.g. 200 OK) */}
      {statusChip && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 28,
            zIndex: 10,
            opacity: statusChip.opacity ?? 1,
            backgroundColor: "var(--ok, #16A34A)",
            color: "var(--on-ok, #0F172A)",
            padding: "6px 18px",
            borderRadius: 9999,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.04em",
            boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
          }}
        >
          {statusChip.text}
        </div>
      )}

      <Highlight theme={themes.dracula} code={json} language="json">
        {({ tokens, getLineProps, getTokenProps }) => {
          let charOffset = 0;
          const tokenPositions = tokens.map((lineTokens) => {
            const lineData = lineTokens.map((token) => {
              const start = charOffset;
              const end = start + token.content.length;
              charOffset = end;
              return { token, start, end };
            });
            charOffset += 1; // newline
            return lineData;
          });

          return (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {tokens.map((lineTokens, lineIdx) => {
                const lineNumber = lineIdx + 1; // 1-indexed
                const lineData = tokenPositions[lineIdx];

                const emphasis = lineEmphasis ? lineEmphasis(lineNumber) : null;
                const lineOpacity = emphasis?.opacity ?? 1;
                const lineBackground = emphasis?.background ?? "transparent";
                const lineLabel = emphasis?.label;
                const lineLabelColor = emphasis?.labelColor ?? "var(--text-muted, #64748B)";

                return (
                  <div
                    key={lineIdx}
                    {...getLineProps({ line: lineTokens })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: lineHeightPx,
                      position: "relative",
                      opacity: lineOpacity,
                      backgroundColor: lineBackground,
                      borderRadius: 4,
                      padding: "0 6px",
                      transition: "background-color 0.2s ease, opacity 0.2s ease",
                    }}
                  >
                    {/* Line Number Gutter */}
                    <div
                      style={{
                        width: 44,
                        minWidth: 44,
                        textAlign: "right",
                        paddingRight: 20,
                        color: "var(--text-muted, #64748B)",
                        fontSize: fontSize - 2,
                        opacity: 0.7,
                        userSelect: "none",
                      }}
                    >
                      {lineNumber}
                    </div>

                    {/* Code Content */}
                    <div
                      style={{
                        flex: 1,
                        whiteSpace: "pre",
                        display: "flex",
                        alignItems: "center",
                        height: lineHeightPx,
                      }}
                    >
                      {lineData.map(
                        ({ token, start: tokenStart, end: tokenEnd }, tokenIdx) => {
                          const tokenProps = getTokenProps({ token });

                          if (typeProgress === undefined || typeProgress >= 1) {
                            return (
                              <span key={tokenIdx} {...tokenProps}>
                                {token.content}
                              </span>
                            );
                          }

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

                          if (tokenEnd <= visibleChars) {
                            return (
                              <span key={tokenIdx} {...tokenProps}>
                                {token.content}
                              </span>
                            );
                          }

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

                    {/* Line Callout Label (e.g. "metadata paging", "tidak dipakai") */}
                    {lineLabel && (
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          color: lineLabelColor,
                          marginLeft: 24,
                          padding: "2px 10px",
                          borderRadius: 6,
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {lineLabel}
                      </div>
                    )}
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

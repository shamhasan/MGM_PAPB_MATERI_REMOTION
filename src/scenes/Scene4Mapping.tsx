import React from "react";
import { interpolate, spring } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { JSON_SHORT, MAPPER_CODE } from "../assets/code";

export const Scene4Mapping: React.FC = () => {
  // 5 Stop untuk scene 'mapping':
  // Stop 0: State 12 (frame 396..420, durasi 24)
  // Stop 1: State 13 (frame 420..450, durasi 30)
  // Stop 2: State 14 (frame 450..480, durasi 30)
  // Stop 3: State 15 (frame 480..516, durasi 36)
  // Stop 4: State 16 (frame 516..546, durasi 30)
  const pStop0 = useStopProgress("mapping", 0);
  const pStop1 = useStopProgress("mapping", 1);
  const pStop2 = useStopProgress("mapping", 2);
  const pStop3 = useStopProgress("mapping", 3);
  const pStop4 = useStopProgress("mapping", 4);

  // Baris-baris pada JSON_SHORT:
  const rawJsonLines = JSON_SHORT.text.split("\n");

  // Spring animations:
  const sprUserResponse = spring({
    frame: pStop1 * 30,
    fps: FPS,
    config: { stiffness: 160, damping: 14 },
  });

  const sprUserDto = spring({
    frame: pStop2 * 30,
    fps: FPS,
    config: { stiffness: 160, damping: 14 },
  });

  const sprStudent = spring({
    frame: pStop3 * 36,
    fps: FPS,
    config: { stiffness: 150, damping: 15 },
  });

  const sprRepoTag = spring({
    frame: pStop4 * 30,
    fps: FPS,
    config: { stiffness: 180, damping: 12 },
  });

  // Animasi peleburan nama pada Stop 3:
  // pStop3: 0..0.45 token bergerak ke tengah; 0.45..0.6 cross-fade; 0.6..1.0 selesai
  const mergeProgress = interpolate(pStop3, [0, 0.55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "var(--bg-light, #F8FAFC)",
        color: "var(--text-dark, #0F172A)",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
        opacity: interpolate(pStop0, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {/* =================================================================== */}
      {/* 1. HEADER JUDUL & SUBJUDUL                                          */}
      {/* =================================================================== */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "var(--text-dark, #0F172A)",
          }}
        >
          Transformasi DTO ke Student
        </h1>
        <p
          style={{
            fontSize: 26,
            color: "var(--text-muted, #64748B)",
            margin: 0,
            fontWeight: 500,
          }}
        >
          Membedakan Kontrak API Eksternal dari Model Domain Aplikasi
        </p>
      </div>

      {/* =================================================================== */}
      {/* 2. TIGA KOLOM UTAMA (y = 170 s.d. 630)                              */}
      {/* =================================================================== */}

      {/* KOLOM 1: JSON EKSTERNAL (x=80, lebar=580, tinggi=450) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 170,
          width: 580,
          height: 450,
          backgroundColor: "var(--editor-bg, #282A36)",
          borderRadius: 20,
          border: "2px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 20,
        }}
      >
        {/* Editor Tab Header */}
        <div
          style={{
            height: 42,
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FF5555" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FFB86C" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#50FA7B" }} />
            <span
              style={{
                marginLeft: 12,
                fontSize: 15,
                fontFamily: "'JetBrains Mono', monospace",
                color: "rgba(255, 255, 255, 0.75)",
                fontWeight: 600,
              }}
            >
              DummyJSON (Raw Payload)
            </span>
          </div>
          <span
            style={{
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              color: "var(--c-api, #94A3B8)",
              fontWeight: 600,
            }}
          >
            REST API
          </span>
        </div>

        {/* JSON Code Body with fieldLight */}
        <div
          style={{
            padding: "12px 16px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 20,
            lineHeight: 1.45,
            color: "#F8F8F2",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          {rawJsonLines.map((line, idx) => {
            const lineNum = idx + 1;
            const isWrapperLine = JSON_SHORT.wrapper.includes(lineNum);
            const isUsedLine = JSON_SHORT.used.includes(lineNum);
            const isUnusedLine = JSON_SHORT.unused.includes(lineNum);

            // Efek fieldLight per Stop:
            let bg = "transparent";
            let op = 0.9;
            let tag: string | null = null;

            if (pStop1 > 0 && pStop2 === 0) {
              // State 13: sorot pembungkus wrapper (users, total, skip, limit)
              if (isWrapperLine) {
                bg = "rgba(147, 51, 234, 0.25)";
                op = 1;
                tag = lineNum === 13 ? "metadata paging" : "array data";
              } else {
                op = 0.55;
              }
            } else if (pStop2 > 0) {
              // State 14+: sorot 5 field DTO
              if (isUsedLine) {
                bg = "rgba(34, 197, 94, 0.22)";
                op = 1;
              } else if (isUnusedLine) {
                op = 0.35;
                tag = "tidak dipakai";
              } else if (isWrapperLine) {
                op = 0.5;
              } else {
                op = 0.4;
              }
            }

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: bg,
                  opacity: op,
                  borderRadius: 4,
                  padding: "0 6px",
                  transition: "background-color 0.2s, opacity 0.2s",
                }}
              >
                <div style={{ display: "flex", gap: 12 }}>
                  <span
                    style={{
                      width: 22,
                      color: "rgba(255, 255, 255, 0.28)",
                      textAlign: "right",
                      fontSize: 16,
                      userSelect: "none",
                    }}
                  >
                    {lineNum}
                  </span>
                  <span style={{ whiteSpace: "pre" }}>{line}</span>
                </div>
                {tag && (
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      backgroundColor: tag === "tidak dipakai" ? "rgba(220, 38, 38, 0.25)" : "rgba(147, 51, 234, 0.4)",
                      color: tag === "tidak dipakai" ? "#FCA5A5" : "#E9D5FF",
                      padding: "1px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {tag}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* KOLOM 2: DTO (x=700, lebar=530, tinggi=450) */}
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 170,
          width: 530,
          height: 450,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          zIndex: 20,
        }}
      >
        {/* Kartu 1: UserResponse (muncul di Stop 1) */}
        {pStop1 > 0 ? (
          <div
            style={{
              backgroundColor: "rgba(30, 58, 138, 0.08)",
              border: "2px solid var(--c-ds, #1E3A8A)",
              borderRadius: 16,
              padding: "16px 20px",
              boxShadow: "0 8px 24px rgba(30, 58, 138, 0.12)",
              transform: `scale(${Math.min(1, sprUserResponse)})`,
              transformOrigin: "center top",
              opacity: Math.min(1, sprUserResponse),
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: "var(--c-ds, #1E3A8A)" }}>
                UserResponse (Wrapper)
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  backgroundColor: "rgba(30, 58, 138, 0.12)",
                  color: "var(--c-ds, #1E3A8A)",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                data/remote/dto
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: "var(--text-dark, #0F172A)", display: "flex", flexDirection: "column", gap: 4 }}>
              <div>val users: List&lt;UserDto&gt;</div>
              <div style={{ color: "var(--text-muted, #64748B)" }}>
                val total: Int, val skip: Int, val limit: Int
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              height: 110,
              borderRadius: 16,
              border: "2px dashed rgba(15, 23, 42, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted, #94A3B8)",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            Menunggu parsing pembungkus API...
          </div>
        )}

        {/* Kartu 2: UserDto (muncul di Stop 2) */}
        {pStop2 > 0 ? (
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid rgba(15, 23, 42, 0.2)",
              borderRadius: 16,
              padding: "18px 20px",
              boxShadow: "0 10px 28px rgba(0, 0, 0, 0.08)",
              transform: `scale(${Math.min(1, sprUserDto)})`,
              transformOrigin: "center top",
              opacity: Math.min(1, sprUserDto),
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: "var(--text-dark, #0F172A)" }}>
                UserDto (Kontrak Remote)
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  backgroundColor: "rgba(15, 23, 42, 0.08)",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                Hanya 5 Field Terpilih
              </span>
            </div>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 18,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginTop: 10,
              }}
            >
              <div style={{ padding: "3px 8px", backgroundColor: "rgba(15, 23, 42, 0.04)", borderRadius: 6 }}>
                val id: Int = 1
              </div>
              <div
                style={{
                  padding: "3px 8px",
                  backgroundColor: pStop3 > 0 ? "rgba(59, 130, 246, 0.15)" : "rgba(15, 23, 42, 0.04)",
                  borderRadius: 6,
                  color: pStop3 > 0 ? "var(--c-ui, #2563EB)" : "inherit",
                  fontWeight: pStop3 > 0 ? 700 : 500,
                }}
              >
                val firstName: String = "Emily"
              </div>
              <div
                style={{
                  padding: "3px 8px",
                  backgroundColor: pStop3 > 0 ? "rgba(59, 130, 246, 0.15)" : "rgba(15, 23, 42, 0.04)",
                  borderRadius: 6,
                  color: pStop3 > 0 ? "var(--c-ui, #2563EB)" : "inherit",
                  fontWeight: pStop3 > 0 ? 700 : 500,
                }}
              >
                val lastName: String = "Johnson"
              </div>
              <div style={{ padding: "3px 8px", backgroundColor: "rgba(15, 23, 42, 0.04)", borderRadius: 6 }}>
                val email: String = "emily.johnson@…"
              </div>
              <div style={{ padding: "3px 8px", backgroundColor: "rgba(15, 23, 42, 0.04)", borderRadius: 6 }}>
                val university: String = "University of W…"
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              borderRadius: 16,
              border: "2px dashed rgba(15, 23, 42, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted, #94A3B8)",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            Menunggu seleksi data model...
          </div>
        )}
      </div>

      {/* GERBANG gateMerge DI ANTARA KOLOM 2 DAN KOLOM 3 (x=1240 s.d. 1350) */}
      <div
        style={{
          position: "absolute",
          left: 1245,
          top: 350,
          width: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 25,
          opacity: pStop3 > 0 ? 1 : 0.2,
          transition: "opacity 0.2s",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--c-repo, #15803D)",
            marginBottom: 6,
            textAlign: "center",
          }}
        >
          toStudent()
        </div>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            backgroundColor: pStop3 > 0 ? "var(--c-repo, #22C55E)" : "rgba(15, 23, 42, 0.1)",
            color: pStop3 > 0 ? "#0F172A" : "rgba(15, 23, 42, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            fontWeight: 800,
            boxShadow: pStop3 > 0 ? "0 4px 16px rgba(34, 197, 94, 0.4)" : "none",
          }}
        >
          →
        </div>
      </div>

      {/* KOLOM 3: DOMAIN MODEL STUDENT (x=1360, lebar=480, tinggi=450) */}
      <div
        style={{
          position: "absolute",
          left: 1360,
          top: 170,
          width: 480,
          height: 450,
          zIndex: 20,
        }}
      >
        {pStop3 > 0 ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#FFFFFF",
              border: "3px solid var(--c-ui, #3B82F6)",
              borderRadius: 20,
              padding: "24px 24px",
              boxSizing: "border-box",
              boxShadow: "0 16px 40px rgba(59, 130, 246, 0.18)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transform: `scale(${Math.min(1, sprStudent)})`,
              transformOrigin: "center center",
              opacity: Math.min(1, sprStudent),
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "var(--c-ui, #1D4ED8)" }}>
                  Student (Model Aplikasi)
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    backgroundColor: "rgba(59, 130, 246, 0.12)",
                    color: "var(--c-ui, #1D4ED8)",
                    padding: "3px 10px",
                    borderRadius: 6,
                  }}
                >
                  data/model
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 16, color: "var(--text-muted, #64748B)", fontWeight: 500 }}>
                Hanya model ini yang dikenal oleh ViewModel dan Composable UI.
              </p>
            </div>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 19,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ padding: "8px 12px", backgroundColor: "rgba(15, 23, 42, 0.04)", borderRadius: 8 }}>
                val id: Int = 1
              </div>

              {/* Field Name Gabungan */}
              <div
                style={{
                  padding: "8px 12px",
                  backgroundColor: "rgba(34, 197, 94, 0.15)",
                  border: "1.5px solid rgba(34, 197, 94, 0.35)",
                  borderRadius: 8,
                  fontWeight: 700,
                  color: "#166534",
                }}
              >
                {mergeProgress < 0.5 ? (
                  <span style={{ opacity: 0.7 }}>$firstName $lastName</span>
                ) : (
                  <span>val name = "Emily Johnson"</span>
                )}
              </div>

              <div style={{ padding: "8px 12px", backgroundColor: "rgba(15, 23, 42, 0.04)", borderRadius: 8 }}>
                val email: String
              </div>
              <div style={{ padding: "8px 12px", backgroundColor: "rgba(15, 23, 42, 0.04)", borderRadius: 8 }}>
                val university: String
              </div>
            </div>

            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--c-repo, #15803D)",
                backgroundColor: "rgba(34, 197, 94, 0.08)",
                padding: "8px 14px",
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              ✓ Bersih dari dependensi kontrak server
            </div>
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 20,
              border: "2px dashed rgba(15, 23, 42, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted, #94A3B8)",
              fontSize: 20,
              fontWeight: 500,
              textAlign: "center",
              padding: 24,
              boxSizing: "border-box",
            }}
          >
            Model Domain Student akan dihasilkan lewat Mapper...
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 3. AREA BAWAH: PANEL KODE MAPPER ATAU RANGKUMAN (y = 640 s.d. 1010) */}
      {/* =================================================================== */}

      {/* Keterangan State 12: JSON mentah */}
      {pStop1 === 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 110,
            left: 80,
            right: 80,
            textAlign: "center",
            fontSize: 42,
            fontWeight: 600,
            color: "var(--text-dark, #0F172A)",
          }}
        >
          Server mengirim banyak field. Aplikasi kita hanya membutuhkan sebagian kecil.
        </div>
      )}

      {/* Keterangan State 13: UserResponse wrapper */}
      {pStop1 > 0 && pStop2 === 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 110,
            left: 80,
            right: 80,
            textAlign: "center",
            fontSize: 42,
            fontWeight: 600,
            color: "var(--text-dark, #0F172A)",
          }}
        >
          <span style={{ color: "var(--c-ds, #1E3A8A)", fontWeight: 700 }}>total</span>,{" "}
          <span style={{ color: "var(--c-ds, #1E3A8A)", fontWeight: 700 }}>skip</span>, dan{" "}
          <span style={{ color: "var(--c-ds, #1E3A8A)", fontWeight: 700 }}>limit</span> adalah milik wrapper{" "}
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>UserResponse</span>, bukan milik tiap item student!
        </div>
      )}

      {/* Keterangan State 14: UserDto 5 fields */}
      {pStop2 > 0 && pStop3 === 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 110,
            left: 80,
            right: 80,
            textAlign: "center",
            fontSize: 42,
            fontWeight: 600,
            color: "var(--text-dark, #0F172A)",
          }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>UserDto</span> hanya menyaring 5 field yang dibutuhkan dan tinggal di folder{" "}
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--c-ds, #1E3A8A)", fontWeight: 700 }}>data/remote/dto</span>.
        </div>
      )}

      {/* State 15: Panel Kode Mapper */}
      {pStop3 > 0 && pStop4 === 0 && (
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 60,
            height: 290,
            backgroundColor: "var(--editor-bg, #282A36)",
            borderRadius: 18,
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.25)",
            border: "2px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 30,
          }}
        >
          <div
            style={{
              height: 42,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FF5555" }} />
              <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#FFB86C" }} />
              <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#50FA7B" }} />
              <span
                style={{
                  marginLeft: 14,
                  fontSize: 16,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: 600,
                }}
              >
                data/mapper/StudentMapper.kt
              </span>
            </div>
            <span style={{ fontSize: 14, fontFamily: "'Inter', sans-serif", color: "#50FA7B", fontWeight: 700 }}>
              Extension Function
            </span>
          </div>

          <div
            style={{
              padding: "18px 24px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 24,
              lineHeight: 1.5,
              color: "#F8F8F2",
              whiteSpace: "pre-wrap",
            }}
          >
            {MAPPER_CODE}
          </div>
        </div>
      )}

      {/* State 16: layerTag Repository Pop-in + 3 Poin Rangkuman */}
      {pStop4 > 0 && (
        <>
          {/* Lencana Repository di atas gerbang */}
          <div
            style={{
              position: "absolute",
              left: 1295,
              top: 250,
              transform: `translate(-50%, -50%) scale(${Math.min(1, sprRepoTag)})`,
              backgroundColor: "var(--c-repo, #22C55E)",
              color: "var(--on-repo, #0F172A)",
              padding: "10px 22px",
              borderRadius: 30,
              fontWeight: 800,
              fontSize: 18,
              boxShadow: "0 8px 24px rgba(34, 197, 94, 0.35)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 35,
              whiteSpace: "nowrap",
            }}
          >
            <span>🌿</span>
            <span>Repository memetakan DTO → Student</span>
          </div>

          {/* Tiga Poin Utama Rangkuman */}
          <div
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              bottom: 60,
              height: 290,
              backgroundColor: "#FFFFFF",
              borderRadius: 18,
              border: "2px solid rgba(15, 23, 42, 0.12)",
              boxShadow: "0 12px 36px rgba(0, 0, 0, 0.08)",
              padding: "24px 36px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              zIndex: 30,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36, fontWeight: 700, color: "var(--text-dark, #0F172A)" }}>
              <span style={{ color: "var(--c-ui, #2563EB)", fontSize: 40 }}>•</span>
              <span>UI hanya mengenal model <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--c-ui, #2563EB)" }}>Student</span>, tidak pernah melihat DTO.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36, fontWeight: 700, color: "var(--text-dark, #0F172A)" }}>
              <span style={{ color: "var(--c-repo, #15803D)", fontSize: 40 }}>•</span>
              <span>Jika API luar berubah, cukup ubah <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--c-repo, #15803D)" }}>DTO</span> dan <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--c-repo, #15803D)" }}>Mapper</span>. UI tetap aman.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36, fontWeight: 700, color: "var(--text-dark, #0F172A)" }}>
              <span style={{ color: "var(--c-vm, #EA580C)", fontSize: 40 }}>•</span>
              <span>Model Student kini berisi <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>email & university</span> (menggantikan program/year Modul 06).</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

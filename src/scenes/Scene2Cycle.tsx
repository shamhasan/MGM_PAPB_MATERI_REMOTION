import React from "react";
import { interpolate, spring } from "remotion";
import { Smartphone, Cloud, Cog, Braces, ArrowRight } from "lucide-react";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { JSON_FULL, RESPONSE_OBJECT } from "../assets/code";
import { Rail, StationData } from "../components/Rail";
import { Packet } from "../components/Packet";
import { JsonBlock } from "../components/JsonBlock";
import { PhoneMock } from "../components/PhoneMock";

export const Scene2Cycle: React.FC = () => {
  // Progres per stop di scene 'cycle'
  const pStop0 = useStopProgress("cycle", 0); // frame 30..48 (State 2)
  const pStop1 = useStopProgress("cycle", 1); // frame 48..84 (State 3)
  const pStop2 = useStopProgress("cycle", 2); // frame 84..120 (State 4)
  const pStop3 = useStopProgress("cycle", 3); // frame 120..156 (State 5)
  const pStop4 = useStopProgress("cycle", 4); // frame 156..192 (State 6)

  // Konfigurasi 5 stasiun rel
  const stations: StationData[] = [
    {
      number: 1,
      name: "App",
      subtitle: "memanggil endpoint",
      icon: <Smartphone size={64} strokeWidth={2.2} />,
    },
    {
      number: 2,
      name: "HTTP GET",
      subtitle: "/users?limit=10",
      icon: <ArrowRight size={64} strokeWidth={2.2} />,
    },
    {
      number: 3,
      name: "Server",
      subtitle: "mengirim JSON",
      icon: <Cloud size={64} strokeWidth={2.2} />,
    },
    {
      number: 4,
      name: "Converter",
      subtitle: "JSON → object",
      icon: <Cog size={64} strokeWidth={2.2} />,
    },
    {
      number: 5,
      name: "UI State",
      subtitle: "ditampilkan di Compose",
      icon: <Braces size={64} strokeWidth={2.2} />,
    },
  ];

  // Koordinat pusat X stasiun pada rel (lebar 1600, slot 320):
  // rel mulai x=160. Slot 0: 160 + 160 = 320 (App)
  // Slot 1: 320 + 320 = 640 (HTTP GET)
  // Slot 2: 640 + 320 = 960 (Server)
  // Slot 3: 960 + 320 = 1280 (Converter)
  // Slot 4: 1280 + 320 = 1600 (UI State)
  const stationCenters = [320, 640, 960, 1280, 1600];

  // =========================================================================
  // LOGIKA ALUR TOKEN & STASIUN AKTIF (State 2..6)
  // =========================================================================
  const sprStep3 = spring({
    frame: pStop3 * 36,
    fps: FPS,
    durationInFrames: 36,
    config: { stiffness: 100, damping: 14 },
  });

  const sprStep4 = spring({
    frame: pStop4 * 36,
    fps: FPS,
    durationInFrames: 36,
    config: { stiffness: 100, damping: 14 },
  });

  let tokenX = stationCenters[0];
  let activeIndex = 0;

  if (pStop4 > 0) {
    activeIndex = 4;
    tokenX = interpolate(sprStep4, [0, 1], [stationCenters[3], stationCenters[4]]);
  } else if (pStop3 > 0) {
    activeIndex = 3;
    tokenX = interpolate(sprStep3, [0, 1], [stationCenters[2], stationCenters[3]]);
  } else if (pStop2 > 0) {
    activeIndex = 2;
    tokenX = stationCenters[2];
  } else if (pStop1 > 0) {
    // Stop 1 (State 3, 36 frame): ① App -> ② HTTP GET -> ③ Server
    // Token bergerak mulus ① -> ② (p: 0..0.45), singgah sejenak di ② (p: 0.45..0.55), lalu ② -> ③ (p: 0.55..1.0)
    tokenX = interpolate(
      pStop1,
      [0, 0.45, 0.55, 1],
      [stationCenters[0], stationCenters[1], stationCenters[1], stationCenters[2]],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    activeIndex = pStop1 < 0.25 ? 0 : pStop1 < 0.75 ? 1 : 2;
  } else {
    activeIndex = 0;
    tokenX = stationCenters[0];
  }

  // Animasi PacketFly pada Stop 1 (State 3):
  // Paket muncul di stasiun 1, terbang melewati stasiun 2 ke stasiun 3 mengikuti token
  const packetFlyOpacity = interpolate(pStop1, [0, 0.08, 0.92, 1], [0, 1, 1, 0.25]);
  const packetFlyX = tokenX;

  // Stop 2 (State 4): jsonReveal (reveal linear) & chip 200 OK
  const chip200Opacity = interpolate(pStop2, [0.5, 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stop 3 (State 5): shrinkIntoMachine
  // Separuh pertama (p: 0 -> 0.5): JSON scale 1 -> 0.2, opacity 1 -> 0 bergerak ke Cog
  // Cog rotation: 360 * p
  // Separuh kedua (p: 0.5 -> 1): RESPONSE_OBJECT fade-in dan bergeser dari Cog ke kanan
  const jsonShrinkScale = interpolate(pStop3, [0, 0.5], [1, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const jsonShrinkOpacity = interpolate(pStop3, [0, 0.45], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const jsonShrinkX = interpolate(pStop3, [0, 0.5], [0, 150], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cogRotation = pStop3 * 360;

  const responseObjectOpacity = interpolate(pStop3, [0.5, 0.85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const responseObjectX = interpolate(pStop3, [0.5, 1], [-25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stop 4 (State 6): phoneState kartu Emily Johnson
  const phoneOpacity = interpolate(pStop4, [0, 0.35], [0, 1], {
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
      }}
    >
      {/* Rel 5 Stasiun di Bagian Atas (y=80) */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 160,
          right: 160,
          zIndex: 10,
        }}
      >
        <Rail
          stations={stations}
          activeStationIndex={activeIndex}
          tokenPositionX={tokenX - 160} // koordinat relatif terhadap kontainer rel
        />
      </div>

      {/* Chip Paket Bergerak packetFly (Stop 1) */}
      {pStop1 > 0 && pStop2 === 0 && (
        <Packet
          label="GET /users?limit=10"
          x={packetFlyX}
          y={310}
          opacity={packetFlyOpacity}
          variant="event"
        />
      )}

      {/* Panggung Muatan (x=80, y=340, dimensi 1760 x 630) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 340,
          width: 1760,
          height: 630,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 20,
        }}
      >
        {/* ======================================================== */}
        {/* KONTEN STOP 0 (STATE 2): TEKS PEMBUKA                    */}
        {/* ======================================================== */}
        {pStop1 === 0 && (
          <div
            style={{
              textAlign: "center",
              maxWidth: 1200,
              padding: "40px 60px",
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              border: "1.5px solid rgba(15, 23, 42, 0.08)",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
              opacity: interpolate(pStop0, [0, 1], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "var(--text-dark, #0F172A)",
                lineHeight: 1.3,
                marginBottom: 20,
              }}
            >
              Aplikasi ingin menampilkan daftar mahasiswa.
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 500,
                color: "var(--c-vm, #F97316)",
                lineHeight: 1.4,
              }}
            >
              Datanya ada di server, bukan di dalam aplikasi.
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* KONTEN STOP 1 (STATE 3): DETAIL REQUEST DENGAN FASE HTTP GET */}
        {/* ======================================================== */}
        {pStop1 > 0 && pStop2 === 0 && (
          <div
            style={{
              backgroundColor: "var(--editor-bg, #282A36)",
              color: "var(--text-light, #F8F8F2)",
              padding: "40px 64px",
              borderRadius: 24,
              boxShadow: "0 24px 50px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              minWidth: 880,
              textAlign: "center",
              border: "1.5px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", gap: 16, alignItems: "center" }}>
              <span
                style={{
                  backgroundColor: "var(--c-ui, #3B82F6)",
                  color: "#FFFFFF",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 28,
                  fontWeight: 800,
                  padding: "6px 20px",
                  borderRadius: 8,
                }}
              >
                HTTP GET
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#50FA7B",
                }}
              >
                /users?limit=10
              </span>
            </div>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 24,
                color: "var(--text-muted, #64748B)",
                letterSpacing: "0.02em",
              }}
            >
              Target Endpoint:{" "}
              <span style={{ color: "var(--text-light, #F8F8F2)", fontWeight: 600 }}>
                https://dummyjson.com/users?limit=10
              </span>
            </div>

            <div
              style={{
                fontSize: 22,
                color: "var(--text-muted, #64748B)",
                fontFamily: "'Inter', sans-serif",
                marginTop: 4,
              }}
            >
              {pStop1 <= 0.5 ? (
                <span>① Aplikasi memicu request → melalui jalur ② HTTP GET</span>
              ) : (
                <span>② Request HTTP GET diteruskan ke ③ Server DummyJSON</span>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* KONTEN STOP 2 (STATE 4): JSON REVEAL 16 BARIS + 200 OK  */}
        {/* ======================================================== */}
        {pStop2 > 0 && pStop3 === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              width: "100%",
            }}
          >
            <div style={{ width: 1040 }}>
              <JsonBlock
                json={JSON_FULL}
                typeProgress={pStop2}
                fontSize={24}
                statusChip={{
                  text: "200 OK",
                  opacity: chip200Opacity,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 600,
                color: "var(--text-muted, #64748B)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Status code + body JSON harus dicek: sukses maupun gagal
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* KONTEN STOP 3 (STATE 5): SHRINK INTO MACHINE (FIT LAYOUT)*/}
        {/* ======================================================== */}
        {pStop3 > 0 && pStop4 === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 48,
              width: "100%",
              maxWidth: 1680,
              boxSizing: "border-box",
            }}
          >
            {/* Blok JSON yang mengecil dan bergerak ke Cog */}
            {jsonShrinkOpacity > 0 && (
              <div
                style={{
                  transform: `translateX(${jsonShrinkX}px) scale(${jsonShrinkScale})`,
                  opacity: jsonShrinkOpacity,
                  width: 580,
                  transformOrigin: "center right",
                  flexShrink: 0,
                }}
              >
                <JsonBlock json={JSON_FULL} typeProgress={1} fontSize={20} />
              </div>
            )}

            {/* Ikon Mesin Converter Cog berputar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  backgroundColor: "var(--editor-bg, #282A36)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFB86C",
                  transform: `rotate(${cogRotation}deg)`,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
                  border: "4px solid #FFB86C",
                }}
              >
                <Cog size={68} strokeWidth={2} />
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--text-dark, #0F172A)",
                }}
              >
                GsonConverter
              </span>
            </div>

            {/* Objek Hasil Kotlin: UserResponse(...) Muat Presisi Tanpa Overflow */}
            {responseObjectOpacity > 0 && (
              <div
                style={{
                  opacity: responseObjectOpacity,
                  transform: `translateX(${responseObjectX}px)`,
                  backgroundColor: "var(--editor-bg, #282A36)",
                  padding: "24px 32px",
                  borderRadius: 20,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 20,
                  lineHeight: 1.4,
                  color: "#50FA7B",
                  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.3)",
                  border: "2px solid rgba(80, 250, 123, 0.4)",
                  width: 680,
                  maxWidth: 680,
                  boxSizing: "border-box",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflow: "hidden",
                }}
              >
                {RESPONSE_OBJECT}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* KONTEN STOP 4 (STATE 6): PHONESTATE SOLID & PROPORSI CEPAT*/}
        {/* ======================================================== */}
        {pStop4 > 0 && (
          <div
            style={{
              opacity: phoneOpacity,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 80,
              width: "100%",
              zIndex: 40,
            }}
          >
            {/* Mockup Ponsel di Skala 0.76 Agar Muat Proporsional di Panggung */}
            <div
              style={{
                transform: "scale(0.76)",
                transformOrigin: "center center",
                zIndex: 50,
              }}
            >
              <PhoneMock mode="custom">
                <div
                  style={{
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#F8FAFC",
                      padding: 24,
                      borderRadius: 20,
                      border: "1.5px solid rgba(15, 23, 42, 0.1)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#0F172A",
                      }}
                    >
                      Emily Johnson
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        color: "#64748B",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      emily.johnson@x.dummyjson.com
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 20,
                        fontWeight: 600,
                        color: "var(--c-ui, #3B82F6)",
                      }}
                    >
                      University of Wisconsin--Madison
                    </div>
                  </div>
                </div>
              </PhoneMock>
            </div>

            {/* Teks Penjelasan Samping */}
            <div
              style={{
                maxWidth: 680,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                zIndex: 40,
              }}
            >
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  color: "var(--text-dark, #0F172A)",
                  lineHeight: 1.25,
                }}
              >
                Data berhasil sampai ke layar ponsel!
              </div>
              <div
                style={{
                  fontSize: 32,
                  color: "var(--text-muted, #64748B)",
                  lineHeight: 1.4,
                  fontWeight: 500,
                }}
              >
                Sebelum tampil, DTO dipetakan menjadi model domain{" "}
                <span style={{ color: "var(--c-repo, #22C55E)", fontWeight: 700 }}>
                  Student
                </span>{" "}
                di lapisan Repository (dibahas lengkap pada Scene 4).
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from "react";
import { interpolate, spring } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { EditorWindow } from "../components/EditorWindow";
import { CodeBlock } from "../components/CodeBlock";
import { PhoneMock } from "../components/PhoneMock";
import { AlertTriangle, AlertOctagon, Utensils, BellRing, Smartphone, XCircle } from "lucide-react";

const CODE_ENQUEUE = `api.getUsers().enqueue(object : Callback<UserResponse> {
    override fun onResponse(call, response) {
        val body = response.body()
        if (response.isSuccessful && body != null) {
            updateUi(body.users)
        }
    }
    override fun onFailure(call, t) {
        showError(t)
    }
})`;

const CODE_PYRAMID = `getUserId { user ->
    getProfile(user.id) { profile ->
        getPosts(profile.id) { posts ->
            // Semakin banyak dependensi,
            // semakin menjorok ke kanan!
            updateFeed(user, profile, posts)
        }
    }
}`;

const CODE_LEAK = `repository.getStudents { result ->
    result.onSuccess { data ->
        // BAHAYA: Dipanggil 2-5 detik kemudian!
        // Jika layar ditutup, UI sudah mati -> CRASH
        updateUi(data)
    }
}`;

/**
 * Scene 1: Titik Jenuh Callback (State 0 - 3)
 * Sesuai spesifikasi docs/02-storyboard.md Scene 1 & docs/06-acceptance.md C.0-3.
 */
export const Scene1PainPoints: React.FC = () => {
  const pStop1 = useStopProgress("painpoints", 1);
  const pStop2 = useStopProgress("painpoints", 2);
  const pStop3 = useStopProgress("painpoints", 3);

  // Easing pegas untuk kartu masalah
  const spring1 = spring({ frame: pStop1 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring2 = spring({ frame: pStop2 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring3 = spring({ frame: pStop3 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });

  // Tentukan state aktif (0, 1, 2, atau 3)
  const isState3 = pStop3 > 0.05;
  const isState2 = pStop2 > 0.05 && !isState3;
  const isState1 = pStop1 > 0.05 && !isState2 && !isState3;

  // Opacity diagram kasir
  const cashierOpacity = interpolate(pStop1, [0, 1], [1, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOutState3 = interpolate(pStop3, [0, 0.8], [1, 0], {
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
      {/* Header Scene */}
      <div
        style={{
          position: "absolute",
          top: "var(--safe, 80px)",
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 14px",
              borderRadius: 999,
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              color: "var(--err, #DC2626)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            <span>Scene 1: Titik Jenuh Callback</span>
          </div>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "var(--text-dark, #0F172A)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Aturan Emas: Main Thread Hanya untuk UI
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "var(--text-muted, #64748B)",
              margin: "6px 0 0 0",
            }}
          >
            Evolusi Pemrograman Asinkron di Android • Membongkar Kerapuhan Pola Callback Modul 07
          </p>
        </div>
      </div>

      {/* Konten 2 Kolom (y = 200px, safe = 80px, gap = 40px) */}
      <div
        style={{
          position: "absolute",
          top: 210,
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          bottom: 70,
          display: "flex",
          gap: "var(--gap, 40px)",
        }}
      >
        {/* ============================================================== */}
        {/* KOLOM KIRI: ANALOGI KASIR (State 0-2) / PHONEMOCK (State 3) */}
        {/* ============================================================== */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* DIAGRAM KASIR & BUZZER (State 0 - 2) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: cashierOpacity * fadeOutState3,
              pointerEvents: isState3 ? "none" : "auto",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Kartu Main Thread: Kasir Restoran */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "2px solid var(--c-ui, #3B82F6)",
                padding: "24px 28px",
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.1)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      backgroundColor: "rgba(59, 130, 246, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--c-ui, #3B82F6)",
                    }}
                  >
                    <Smartphone size={26} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--c-ui, #3B82F6)" }}>
                      Main Thread (Kasir)
                    </h3>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-muted, #64748B)" }}>
                      Waktu Tanggap: 16.6 ms per frame (60 FPS)
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    backgroundColor: "rgba(22, 163, 74, 0.15)",
                    color: "var(--life-active, #16A34A)",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  UI Responsif
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 17, color: "var(--text-dark, #0F172A)", lineHeight: 1.55 }}>
                Kasir melayani pesanan pembeli tanpa memasak ayam sendiri. Kasir segera memberikan <strong>Buzzer Antrean</strong> agar antrean pelanggan di depan tidak macet (bebas dari ANR).
              </p>
            </div>

            {/* Token Buzzer Antrean (Callback) */}
            <div
              style={{
                alignSelf: "center",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 28px",
                borderRadius: 999,
                backgroundColor: "var(--editor-bg, #282A36)",
                border: "2px solid var(--c-bookmark, #EAB308)",
                color: "var(--text-light, #F8F8F2)",
                boxShadow: "0 6px 18px rgba(234, 179, 8, 0.25)",
              }}
            >
              <BellRing size={22} color="var(--c-bookmark, #EAB308)" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--c-bookmark, #EAB308)",
                  }}
                >
                  Token Buzzer Antrean
                </span>
                <span style={{ fontSize: 14, color: "var(--text-light, #F8F8F2)", opacity: 0.9 }}>
                  Representasi Callback: Bergetar nanti saat pesanan siap
                </span>
              </div>
            </div>

            {/* Kartu Background Thread: Dapur Restoran */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "2px solid var(--c-ds, #1E3A8A)",
                padding: "24px 28px",
                boxShadow: "0 10px 25px rgba(30, 58, 138, 0.1)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      backgroundColor: "rgba(30, 58, 138, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--c-ds, #1E3A8A)",
                    }}
                  >
                    <Utensils size={26} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--c-ds, #1E3A8A)" }}>
                      Background Thread (Dapur / Koki)
                    </h3>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-muted, #64748B)" }}>
                      Operasi Berat: Jaringan Retrofit HTTP I/O
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    padding: "6px 14px",
                    borderRadius: 999,
                    backgroundColor: "rgba(30, 58, 138, 0.1)",
                    color: "var(--c-ds, #1E3A8A)",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  Durasi: 500ms - 2s
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 17, color: "var(--text-dark, #0F172A)", lineHeight: 1.55 }}>
                Koki memasak pesanan secara independen di dapur belakang tanpa mengganggu kasir. Saat masakan siap, koki memicu buzzer agar pembeli mengambil makanan.
              </p>
            </div>

            {/* Teks Peran Callback Modul 07 */}
            <div
              style={{
                marginTop: "auto",
                padding: "16px 22px",
                borderRadius: 14,
                backgroundColor: "rgba(15, 23, 42, 0.04)",
                border: "1px solid rgba(15, 23, 42, 0.08)",
                fontSize: 16,
                color: "var(--text-dark, #0F172A)",
                lineHeight: 1.55,
              }}
            >
              💡 <strong>Modul 07:</strong> Callback melepas beban jaringan ke background thread agar UI tidak mengalami <em>Application Not Responding (ANR)</em>.
            </div>
          </div>

          {/* SIMULASI PHONEMOCK LAYAR HANCUR (State 3) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: interpolate(pStop3, [0.1, 1], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `scale(${interpolate(spring3, [0, 1], [0.92, 1])})`,
              pointerEvents: isState3 ? "auto" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
            }}
          >
            {/* PhoneMock dalam kondisi layar tertutup */}
            <div style={{ position: "relative" }}>
              <PhoneMock
                mode="empty"
                title="DetailScreen"
                style={{
                  width: 380,
                  height: 640,
                  opacity: 0.45,
                  filter: "grayscale(60%)",
                }}
              />

              {/* Tanda Silang Merah & Stempel Layar Hancur */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 48,
                  backgroundColor: "rgba(220, 38, 38, 0.15)",
                  border: "3px solid var(--err, #DC2626)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  padding: 24,
                  textAlign: "center",
                  zIndex: 10,
                }}
              >
                <XCircle size={72} color="var(--err, #DC2626)" strokeWidth={2.5} />
                <div
                  style={{
                    backgroundColor: "var(--err, #DC2626)",
                    color: "#FFFFFF",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 800,
                    fontSize: 20,
                    letterSpacing: "0.08em",
                    padding: "8px 22px",
                    borderRadius: 999,
                    boxShadow: "0 6px 20px rgba(220, 38, 38, 0.4)",
                  }}
                >
                  LAYAR DIHANCURKAN
                </div>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--err, #DC2626)",
                    maxWidth: 270,
                    lineHeight: 1.4,
                  }}
                >
                  Tombol Back Ditekan • Activity / Composable Berstatus Destroyed
                </span>
              </div>
            </div>

            {/* Panah Respon Ilegal Menembus Layar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                maxWidth: 230,
              }}
            >
              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: 12,
                  backgroundColor: "rgba(220, 38, 38, 0.12)",
                  border: "2px dashed var(--err, #DC2626)",
                  color: "var(--err, #DC2626)",
                  fontSize: 15,
                  fontWeight: 800,
                  textAlign: "center",
                }}
              >
                Response Callback Tiba Terlambat!
              </div>

              {/* SVG Panah Merah Putus-putus dengan X */}
              <svg width="60" height="120" viewBox="0 0 60 120">
                <line
                  x1="50"
                  y1="10"
                  x2="10"
                  y2="110"
                  stroke="var(--err, #DC2626)"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
                <circle cx="10" cy="110" r="6" fill="var(--err, #DC2626)" />
              </svg>

              <span
                style={{
                  fontSize: 15,
                  color: "var(--err, #DC2626)",
                  fontWeight: 800,
                  textAlign: "center",
                }}
              >
                updateUi() terpanggil di layar mati ➔ CRASH!
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* KOLOM KANAN: PANEL KODE DRACULA & KARTU MASALAH BERGILIR */}
        {/* ============================================================== */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Jendela Editor Dracula */}
          <div style={{ position: "relative", minHeight: 390 }}>
            {/* Editor State 0 & 1: Enqueue */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: interpolate(pStop2, [0, 0.8], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                pointerEvents: isState2 || isState3 ? "none" : "auto",
              }}
            >
              <EditorWindow tabTitle="StudentRemoteDataSource.kt" style={{ width: "100%", height: 390 }}>
                <div style={{ padding: "18px 20px" }}>
                  <CodeBlock
                    code={CODE_ENQUEUE}
                    fontSize={17}
                    lineHeight={1.4}
                    lineEmphasis={(idx) => {
                      // Pada State 1, beri sorotan kurung kurawal onResponse (baris 2..7 -> index 1..6)
                      if (pStop1 > 0 && idx >= 1 && idx <= 6) {
                        return { background: "rgba(139, 92, 246, 0.25)", opacity: 1 };
                      }
                      return 1;
                    }}
                  />
                </div>
              </EditorWindow>
            </div>

            {/* Editor State 2: Pyramid of Doom */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: interpolate(pStop2, [0.2, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `scale(${interpolate(spring2, [0, 1], [0.95, 1])})`,
                pointerEvents: isState2 ? "auto" : "none",
                display: pStop2 > 0 && !isState3 ? "block" : "none",
              }}
            >
              <EditorWindow tabTitle="HomeViewModel.kt — Pyramid of Doom" style={{ width: "100%", height: 390 }}>
                <div style={{ padding: "18px 20px" }}>
                  <CodeBlock
                    code={CODE_PYRAMID}
                    fontSize={18}
                    lineHeight={1.5}
                    lineEmphasis={(idx) => {
                      if (idx === 1) return { background: "rgba(249, 115, 22, 0.15)" };
                      if (idx === 2) return { background: "rgba(220, 38, 38, 0.2)" };
                      return 1;
                    }}
                  />
                </div>
              </EditorWindow>
            </div>

            {/* Editor State 3: Lifecycle Blindness Leak */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: interpolate(pStop3, [0.2, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `scale(${interpolate(spring3, [0, 1], [0.95, 1])})`,
                pointerEvents: isState3 ? "auto" : "none",
                display: isState3 ? "block" : "none",
              }}
            >
              <EditorWindow tabTitle="HomeViewModel.kt — Kebutaan Daur Hidup" style={{ width: "100%", height: 390 }}>
                <div style={{ padding: "18px 20px" }}>
                  <CodeBlock
                    code={CODE_LEAK}
                    fontSize={18}
                    lineHeight={1.5}
                    lineEmphasis={(idx) => {
                      if (idx >= 2 && idx <= 4) {
                        return { background: "rgba(220, 38, 38, 0.3)" };
                      }
                      return 1;
                    }}
                  />
                </div>
              </EditorWindow>
            </div>
          </div>

          {/* ============================================================== */}
          {/* KARTU PERINGATAN MASALAH BERGILIR (1, 2, 3) */}
          {/* ============================================================== */}
          <div style={{ position: "relative", minHeight: 180 }}>
            {/* KARTU MASALAH 1 (State 1): Inverted Control Flow */}
            {isState1 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: interpolate(pStop1, [0.2, 1], [0, 1]),
                  transform: `translateY(${interpolate(spring1, [0, 1], [20, 0])}px)`,
                  backgroundColor: "#2B1B1B",
                  borderRadius: 18,
                  border: "2px solid var(--err, #DC2626)",
                  boxShadow: "0 12px 30px rgba(220, 38, 38, 0.25)",
                  padding: "20px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <AlertTriangle size={26} color="#EF4444" />
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#EF4444",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    1. Pembalikan Alur Pikir (Inverted Control Flow)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 17, color: "#FFFFFF", lineHeight: 1.55 }}>
                  Kode tidak dieksekusi secara linear dari atas ke bawah. Logika terpecah dan melompat ke dalam kurung kurawal <code>onResponse</code> di masa depan ketika data server tiba.
                </p>
                <div style={{ fontSize: 15, color: "#CBD5E1", fontStyle: "italic" }}>
                  ↳ Otak dipaksa berpindah konteks; menyulitkan debugging dan pembacaan alur program.
                </div>
              </div>
            )}

            {/* KARTU MASALAH 2 (State 2): Pyramid of Doom */}
            {isState2 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: interpolate(pStop2, [0.2, 1], [0, 1]),
                  transform: `translateY(${interpolate(spring2, [0, 1], [20, 0])}px)`,
                  backgroundColor: "#2B1B1B",
                  borderRadius: 18,
                  border: "2px solid var(--err, #DC2626)",
                  boxShadow: "0 12px 30px rgba(220, 38, 38, 0.25)",
                  padding: "20px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <AlertTriangle size={26} color="#EF4444" />
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#EF4444",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    2. Kaskade Bersarang (Pyramid of Doom)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 17, color: "#FFFFFF", lineHeight: 1.55 }}>
                  Ketika beberapa request asinkron saling bergantung secara berurutan, indentasi menjorok ekstrem ke kanan membentuk piramida callback bersarang (*Callback Hell*).
                </p>
                <div style={{ fontSize: 15, color: "#CBD5E1", fontStyle: "italic" }}>
                  ↳ Penanganan error dan pembatalan di setiap tingkatan menjadi mimpi buruk pemeliharaan.
                </div>
              </div>
            )}

            {/* KARTU MASALAH 3 (State 3): Lifecycle Blindness */}
            {isState3 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: interpolate(pStop3, [0.2, 1], [0, 1]),
                  transform: `translateY(${interpolate(spring3, [0, 1], [20, 0])}px)`,
                  backgroundColor: "#2B1B1B",
                  borderRadius: 18,
                  border: "2px solid var(--err, #DC2626)",
                  boxShadow: "0 12px 30px rgba(220, 38, 38, 0.25)",
                  padding: "20px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <AlertOctagon size={26} color="#EF4444" />
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#EF4444",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    3. Kebutaan Daur Hidup (Lifecycle Blindness)
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 17, color: "#FFFFFF", lineHeight: 1.55 }}>
                  Callback murni tidak sadar daur hidup (*lifecycle-blind*). Ketika user menekan Back dan layar ditutup, callback jaringan yang baru selesai tetap berusaha menyentuh UI yang sudah mati.
                </p>
                <div style={{ fontSize: 15, color: "#CBD5E1", fontStyle: "italic" }}>
                  ↳ Mengakibatkan kebocoran memori (memory leak) atau IllegalArgumentException/NullPointerException fatal.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

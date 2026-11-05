import React from "react";
import { interpolate, spring } from "remotion";
import { useStopProgress } from "../deck/useStopProgress";
import { FPS } from "../deck/stops";
import { EditorWindow } from "../components/EditorWindow";
import { CodeBlock } from "../components/CodeBlock";
import { FlowPipeline, QueryParticle } from "../components/FlowPipeline";
import { OperatorNode } from "../components/OperatorNode";
import { PhoneMock } from "../components/PhoneMock";
import { OBSERVE_SEARCH_CODE, PHONE_ROWS } from "../assets/code";
import {
  Waves,
  Timer,
  CheckCheck,
  Ban,
  XCircle,
  CheckCircle2,
  Search,
  Zap,
} from "lucide-react";

/**
 * Scene 5: Aliran Data Reaktif Flow (Pencarian Otomatis) (State 19 - 24)
 * Sesuai spesifikasi docs/02-storyboard.md Scene 5 & docs/06-acceptance.md C.19-24.
 */
export const Scene5FlowSearch: React.FC = () => {
  const pStop0 = useStopProgress("flowsearch", 0);
  const pStop1 = useStopProgress("flowsearch", 1);
  const pStop2 = useStopProgress("flowsearch", 2);
  const pStop3 = useStopProgress("flowsearch", 3);
  const pStop4 = useStopProgress("flowsearch", 4);
  const pStop5 = useStopProgress("flowsearch", 5);

  // Easing pegas antar-stop
  const spring0 = spring({ frame: pStop0 * 24, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring1 = spring({ frame: pStop1 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring2 = spring({ frame: pStop2 * 36, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring3 = spring({ frame: pStop3 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring4 = spring({ frame: pStop4 * 36, fps: FPS, config: { stiffness: 120, damping: 14 } });
  const spring5 = spring({ frame: pStop5 * 30, fps: FPS, config: { stiffness: 120, damping: 14 } });

  // Tentukan state aktif (19 s.d. 24)
  const isState24 = pStop5 > 0.05;
  const isState23 = pStop4 > 0.05 && !isState24;
  const isState22 = pStop3 > 0.05 && !isState23 && !isState24;
  const isState21 = pStop2 > 0.05 && !isState22 && !isState23 && !isState24;
  const isState20 = pStop1 > 0.05 && !isState21 && !isState22 && !isState23 && !isState24;
  const isState19 = !isState20 && !isState21 && !isState22 && !isState23 && !isState24;

  // Daftar node aktif pada pipa
  const getActiveNodes = (): string[] => {
    if (pStop5 > 0) return ["D", "E", "F", "G"];
    if (pStop4 > 0) return ["D", "E"];
    if (pStop3 > 0) return ["D", "E"];
    if (pStop2 > 0) return ["A", "B", "C", "D"];
    if (pStop1 > 0) {
      if (pStop1 > 0.66) return ["A", "B", "C"];
      if (pStop1 > 0.33) return ["A", "B"];
      return ["A"];
    }
    return [];
  };

  // Posisi partikel query di dalam pipa Flow (lebar pipa 1760px, padding 48px)
  // Stasiun: A(~80px), B(~340px), C(~600px), D(~860px), E(~1120px), F(~1380px), G(~1640px)
  const getQueryParticles = (): QueryParticle[] => {
    const particles: QueryParticle[] = [];

    if (isState20) {
      // Partikel "j", "ja", "john" memancar masuk
      if (pStop1 >= 0.1) {
        particles.push({
          id: "p1",
          text: '"j"',
          x: interpolate(pStop1, [0.1, 0.4], [60, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          opacity: interpolate(pStop1, [0.1, 0.25], [0, 1]),
        });
      }
      if (pStop1 >= 0.4) {
        particles.push({
          id: "p2",
          text: '"ja"',
          x: interpolate(pStop1, [0.4, 0.7], [60, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          opacity: interpolate(pStop1, [0.4, 0.55], [0, 1]),
        });
      }
      if (pStop1 >= 0.7) {
        particles.push({
          id: "p3",
          text: '"john"',
          x: interpolate(pStop1, [0.7, 1], [60, 680], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          opacity: interpolate(pStop1, [0.7, 0.85], [0, 1]),
        });
      }
    } else if (isState21) {
      // Partikel tertahan di gerbang Node D (x = 880px)
      particles.push({
        id: "p-hold",
        text: '"john"',
        x: interpolate(spring2, [0, 1], [700, 880]),
        scale: 1.05,
      });
    } else if (isState22) {
      // Partikel lolos melewati Node D menuju Node E (x = 1140px)
      particles.push({
        id: "p-distinct",
        text: '"john"',
        x: interpolate(spring3, [0, 1], [880, 1140]),
        scale: 1,
      });
    } else if (isState23) {
      // Partikel query baru "john" tiba di Node E
      particles.push({
        id: "p-latest",
        text: '"john"',
        x: 1140,
        scale: 1.1,
      });
    } else if (isState24) {
      // Partikel "john" meluncur dari Node E ke F (x = 1400px) lalu ke G (x = 1640px)
      particles.push({
        id: "p-final",
        text: '"john"',
        x: interpolate(spring5, [0, 1], [1140, 1640]),
        scale: 1,
      });
    }

    return particles;
  };

  const isCancelledBurst = isState23 && pStop4 > 0.15 && pStop4 < 0.85;

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
      {/* Header Scene 5 */}
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
              backgroundColor: "rgba(6, 182, 212, 0.12)",
              border: "1px solid rgba(6, 182, 212, 0.35)",
              color: "var(--c-flow, #06B6D4)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            <Waves size={16} />
            <span>Scene 5: Aliran Data Reaktif Flow</span>
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
            Pencarian Reaktif: Mengalirkan Data Lewat Pipa Flow
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "var(--text-muted, #64748B)",
              margin: "6px 0 0 0",
            }}
          >
            Pipeline Operator: debounce(500), distinctUntilChanged, & collectLatest (Gambar 3 Modul 08)
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BAGIAN TENGAH: REL KONVEYOR PIPA FLOW (y = 205px s.d. 450px) */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          top: 205,
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Tombol Cari Lama Disilang Merah (State 19) */}
        {isState19 && (
          <div
            style={{
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 20px",
              borderRadius: 999,
              backgroundColor: "rgba(220, 38, 38, 0.12)",
              border: "2px solid var(--err, #DC2626)",
              color: "var(--err, #DC2626)",
              transform: `scale(${interpolate(spring0, [0, 1], [0.94, 1])})`,
            }}
          >
            <XCircle size={20} strokeWidth={2.5} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                fontSize: 15,
                textDecoration: "line-through",
              }}
            >
              [Tombol Cari Manual Modul 07]
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dark, #0F172A)" }}>
              ➔ Dihapus! Pencarian kini otomatis mengalir setiap ketukan huruf.
            </span>
          </div>
        )}

        {/* Pipa Konveyor 7 Stasiun (A - G) */}
        <div style={{ width: "100%", transform: `scale(${interpolate(spring0, [0, 1], [0.97, 1])})` }}>
          <FlowPipeline
            activeNodes={getActiveNodes()}
            queryParticles={getQueryParticles()}
            cancelledBurst={isCancelledBurst}
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* BAGIAN BAWAH: PANEL KODE DRACULA & KARTU PREVIEW (y = 480px) */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          top: 480,
          left: "var(--safe, 80px)",
          right: "var(--safe, 80px)",
          bottom: 50,
          display: "flex",
          gap: "var(--gap, 40px)",
        }}
      >
        {/* ============================================================== */}
        {/* PANEL KIRI: EDITOR DRACULA observeSearch() (1060px) */}
        {/* ============================================================== */}
        <div style={{ flex: 1.15, display: "flex", flexDirection: "column" }}>
          <EditorWindow tabTitle="HomeViewModel.kt — observeSearch()" style={{ width: "100%", height: "100%" }}>
            <div style={{ padding: "18px 24px" }}>
              <CodeBlock
                code={OBSERVE_SEARCH_CODE}
                fontSize={17}
                lineHeight={1.42}
                lineEmphasis={(idx) => {
                  // State 20 & 21: Sorot baris debounce(500) (index 4)
                  if ((isState20 || isState21) && idx === 4) {
                    return { background: "rgba(249, 115, 22, 0.28)" };
                  }
                  // State 22: Sorot baris distinctUntilChanged() (index 5)
                  if (isState22 && idx === 5) {
                    return { background: "rgba(6, 182, 212, 0.28)" };
                  }
                  // State 23: Sorot baris collectLatest (index 6)
                  if (isState23 && idx === 6) {
                    return { background: "rgba(239, 68, 68, 0.28)" };
                  }
                  // State 24: Sorot baris searchStudents dan _uiState (index 15..17)
                  if (isState24 && idx >= 15 && idx <= 17) {
                    return { background: "rgba(22, 163, 74, 0.25)" };
                  }
                  return 1;
                }}
              />
            </div>
          </EditorWindow>
        </div>

        {/* ============================================================== */}
        {/* PANEL KANAN: KARTU EDUKASI / OPERATOR / PHONEMOCK (680px) */}
        {/* ============================================================== */}
        <div
          style={{
            flex: 0.85,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* KARTU STATE 19: One-Shot vs Stream Reaktif */}
          {isState19 && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "1.5px solid rgba(15, 23, 42, 0.1)",
                boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <Zap size={24} color="var(--c-flow, #06B6D4)" />
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--text-dark, #0F172A)" }}>
                    One-Shot vs Data Stream (Flow)
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 14,
                      backgroundColor: "rgba(139, 92, 246, 0.08)",
                      border: "1.5px solid var(--c-coroutine, #8B5CF6)",
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--c-coroutine, #8B5CF6)", marginBottom: 4 }}>
                      1. Operasi One-Shot (suspend fun)
                    </div>
                    <p style={{ margin: 0, fontSize: 15, color: "var(--text-dark, #0F172A)", lineHeight: 1.45 }}>
                      Ambil detail profil / daftar mahasiswa: Minta sekali, server membalas sekali, selesai. Tidak perlu pipa aliran bersambung.
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 14,
                      backgroundColor: "rgba(6, 182, 212, 0.08)",
                      border: "1.5px solid var(--c-flow, #06B6D4)",
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 800, color: "var(--c-flow, #06B6D4)", marginBottom: 4 }}>
                      2. Aliran Reaktif Stream (Flow)
                    </div>
                    <p style={{ margin: 0, fontSize: 15, color: "var(--text-dark, #0F172A)", lineHeight: 1.45 }}>
                      Ketikan teks pencarian pengguna: Huruf terus memancar dari waktu ke waktu. Butuh pipa air (*stream*) dengan katup penyaring.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 15, color: "var(--text-muted, #475569)", lineHeight: 1.5 }}>
                💡 <strong>Gambar 3 Modul 08:</strong> Rangkaian pipa menghubungkan 7 stasiun (A s.d. G) dari ketikan Composable hingga hasil akhir `HomeUiState`.
              </div>
            </div>
          )}

          {/* KARTU STATE 20: Emisi Partikel TextField */}
          {isState20 && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "1.5px solid var(--c-ui, #3B82F6)",
                boxShadow: "0 10px 28px rgba(59, 130, 246, 0.12)",
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                height: "100%",
                justifyContent: "space-between",
                transform: `scale(${interpolate(spring1, [0, 1], [0.96, 1])})`,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <Search size={24} color="var(--c-ui, #3B82F6)" />
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--c-ui, #3B82F6)" }}>
                    Ketikan Reaktif di TextField
                  </h3>
                </div>

                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: 14,
                    backgroundColor: "var(--editor-bg, #282A36)",
                    color: "var(--text-light, #F8F8F2)",
                    fontFamily: "'JetBrains Mono', monospace",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--text-muted, #94A3B8)" }}>
                    // Setiap huruf memicu onSearchQueryChange:
                  </span>
                  <div style={{ fontSize: 16, color: "#50FA7B", fontWeight: 700 }}>
                    TextField(value = query) ➔ emit("j"), emit("ja"), emit("john")
                  </div>
                </div>

                <p style={{ fontSize: 16, color: "var(--text-dark, #0F172A)", lineHeight: 1.55, marginTop: 14 }}>
                  Nilai teks masuk ke <code>_searchQuery.value</code> dan memancar seketika ke dalam pipa Flow melewati Node A, B, dan C secara berurutan.
                </p>
              </div>

              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--c-ui, #3B82F6)",
                }}
              >
                Partikel teks meluncur menuju katup Node D (debounce)...
              </div>
            </div>
          )}

          {/* KARTU STATE 21: Katup Debounce (500 ms) */}
          {isState21 && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "2px solid var(--c-vm, #F97316)",
                boxShadow: "0 10px 28px rgba(249, 115, 22, 0.15)",
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                height: "100%",
                justifyContent: "space-between",
                transform: `scale(${interpolate(spring2, [0, 1], [0.96, 1])})`,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <Timer size={28} color="var(--c-vm, #F97316)" />
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--c-vm, #F97316)" }}>
                    Operator debounce(500 ms)
                  </h3>
                </div>

                <div style={{ alignSelf: "center", margin: "10px 0" }}>
                  <OperatorNode
                    type="debounce"
                    label="debounce(500)"
                    sublabel="Katup Penahan Jeda Ketik"
                    isActive={true}
                    isOpen={false}
                    timerProgress={pStop2}
                  />
                </div>

                <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #0F172A)", lineHeight: 1.55 }}>
                  <strong>Mencegah Spam Jaringan:</strong> Bayangkan jika setiap huruf langsung menembak HTTP API. Debounce bertindak sebagai bendungan yang menahan air sampai pengguna berhenti mengetik selama setengah detik.
                </p>
              </div>

              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  backgroundColor: "rgba(249, 115, 22, 0.12)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--c-vm, #F97316)",
                }}
              >
                ⏳ Partikel "j" dan "ja" dilebur; menunggu pengguna selesai mengetik...
              </div>
            </div>
          )}

          {/* KARTU STATE 22: Operator distinctUntilChanged */}
          {isState22 && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "2px solid var(--c-flow, #06B6D4)",
                boxShadow: "0 10px 28px rgba(6, 182, 212, 0.15)",
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                height: "100%",
                justifyContent: "space-between",
                transform: `scale(${interpolate(spring3, [0, 1], [0.96, 1])})`,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <CheckCheck size={28} color="var(--c-flow, #06B6D4)" />
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "var(--c-flow, #06B6D4)" }}>
                    distinctUntilChanged()
                  </h3>
                </div>

                <div style={{ alignSelf: "center", margin: "10px 0" }}>
                  <OperatorNode
                    type="distinct"
                    label="distinctUntilChanged()"
                    sublabel="Filter Pencegah Query Duplikat"
                    isActive={true}
                    isOpen={true}
                  />
                </div>

                <p style={{ margin: 0, fontSize: 16, color: "var(--text-dark, #0F172A)", lineHeight: 1.55 }}>
                  Pengguna berhenti mengetik kata <strong>"john"</strong> selama 500 ms. Katup Node D membuka! Operator <code>distinctUntilChanged()</code> memastikan query berbeda dari query sebelumnya agar tidak menembak server dua kali untuk kata yang sama.
                </p>
              </div>

              <div
                style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  backgroundColor: "rgba(6, 182, 212, 0.12)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--c-flow, #06B6D4)",
                }}
              >
                ✓ Query "john" lolos verifikasi dan meluncur ke Node E (collectLatest)!
              </div>
            </div>
          )}

          {/* KARTU STATE 23: Operator collectLatest & cancelBurst */}
          {isState23 && (
            <div
              style={{
                backgroundColor: "#2B1B1B",
                borderRadius: 20,
                border: "2px solid var(--err, #DC2626)",
                boxShadow: "0 12px 32px rgba(220, 38, 38, 0.3)",
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                height: "100%",
                justifyContent: "space-between",
                transform: `scale(${interpolate(spring4, [0, 1], [0.96, 1])})`,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <Ban size={28} color="#EF4444" />
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#EF4444" }}>
                    collectLatest: Batalkan Yang Lama!
                  </h3>
                </div>

                <div style={{ alignSelf: "center", margin: "10px 0" }}>
                  <OperatorNode
                    type="collectLatest"
                    label="collectLatest { ... }"
                    sublabel="Pembatalan Otomatis (Race-Condition Free)"
                    isActive={true}
                    isCancelled={true}
                  />
                </div>

                <p style={{ margin: 0, fontSize: 16, color: "#FFFFFF", lineHeight: 1.55 }}>
                  Bila request jaringan untuk query lama <code>"joh"</code> masih tertunda di background dan query baru <code>"john"</code> tiba, <code>collectLatest</code> seketika mematikan pekerjaan lama (*cancelBurst*).
                </p>
              </div>

              <div style={{ fontSize: 14, color: "#CBD5E1", fontStyle: "italic" }}>
                ↳ Hasil lama tidak akan pernah menimpa hasil terbaru (bebas race condition).
              </div>
            </div>
          )}

          {/* KARTU STATE 24: Data Tiba & Hasil di PhoneMock */}
          {isState24 && (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                border: "2px solid var(--life-active, #16A34A)",
                boxShadow: "0 12px 32px rgba(22, 163, 74, 0.2)",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                height: "100%",
                justifyContent: "space-between",
                transform: `scale(${interpolate(spring5, [0, 1], [0.96, 1])})`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle2 size={24} color="var(--life-active, #16A34A)" />
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--life-active, #16A34A)" }}>
                    Hasil Pencarian Tampil Otomatis
                  </h3>
                </div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    backgroundColor: "rgba(22, 163, 74, 0.15)",
                    color: "var(--life-active, #16A34A)",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  ✓ REAKTIF
                </span>
              </div>

              {/* Preview Hasil Mockup Ponsel Mini */}
              <div style={{ alignSelf: "center" }}>
                <PhoneMock
                  mode="success"
                  title="Cari: 'john'"
                  rows={PHONE_ROWS.slice(0, 3)}
                  style={{ width: 340, height: 260 }}
                />
              </div>

              <p style={{ margin: 0, fontSize: 15, color: "var(--text-dark, #0F172A)", lineHeight: 1.45 }}>
                Data dari Node F mengalir ke Node G (<code>HomeUiState</code>). Layar ponsel menampilkan profil mahasiswa Emily Johnson secara instan tanpa tombol!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

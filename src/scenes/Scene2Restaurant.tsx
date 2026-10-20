import React from "react";
import { interpolate, Easing } from "remotion";
import { ConciergeBell, ClipboardList, Truck, Warehouse } from "lucide-react";
import { useStopProgress } from "../deck/useStopProgress";
import { LayerCard } from "../components/LayerCard";

export const Scene2Restaurant: React.FC = () => {
  // Stop 0: sceneIn (frame 162 s.d. 180, 18 frame)
  const sceneInProgress = useStopProgress(1, 0);

  // Stop 1–4: popIn masing-masing kartu (masing-masing 24 frame)
  const p1 = useStopProgress(1, 1);
  const p2 = useStopProgress(1, 2);
  const p3 = useStopProgress(1, 3);
  const p4 = useStopProgress(1, 4);

  // Scene fade in
  const sceneOpacity = interpolate(sceneInProgress, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: "var(--bg-light, #F8FAFC)",
        opacity: sceneOpacity,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px var(--safe, 80px)",
        boxSizing: "border-box",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      {/* Header (Judul & Subjudul) */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 48,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "var(--text-dark, #0F172A)",
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          Prinsip Restoran
        </h1>
        <p
          style={{
            fontSize: 42,
            fontWeight: 500,
            color: "var(--text-muted, #64748B)",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Satu peran, satu tanggung jawab
        </p>
      </div>

      {/* Grid 4 Kolom (lebar kartu 410px, gap 40px, total 1760px) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 40,
          width: 1760,
          alignItems: "center",
        }}
      >
        {/* Slot 1: Pelayan (UI) */}
        <div style={{ width: 410, height: 620 }}>
          <LayerCard
            layer="ui"
            roleName="Pelayan"
            chipLabel="(UI)"
            taskLabel="Tugas:"
            taskDetail="Menyajikan hidangan"
            icon={<ConciergeBell size={96} strokeWidth={2} />}
            progress={p1}
          />
        </div>

        {/* Slot 2: Pencatat Pesanan (ViewModel) */}
        <div style={{ width: 410, height: 620 }}>
          <LayerCard
            layer="viewmodel"
            roleName="Pencatat Pesanan"
            chipLabel="(ViewModel)"
            taskLabel="Tugas:"
            taskDetail="Status meja & orderan"
            icon={<ClipboardList size={96} strokeWidth={2} />}
            progress={p2}
          />
        </div>

        {/* Slot 3: Bagian Pengadaan (Repository) */}
        <div style={{ width: 410, height: 620 }}>
          <LayerCard
            layer="repository"
            roleName="Bagian Pengadaan"
            chipLabel="(Repository)"
            taskLabel="Tugas:"
            taskDetail="Atur sumber bahan"
            icon={<Truck size={96} strokeWidth={2} />}
            progress={p3}
          />
        </div>

        {/* Slot 4: Gudang (Data Source) */}
        <div style={{ width: 410, height: 620 }}>
          <LayerCard
            layer="datasource"
            roleName="Gudang"
            chipLabel="(Data Source)"
            taskLabel="Tugas:"
            taskDetail="Tempat fisik bahan baku"
            icon={<Warehouse size={96} strokeWidth={2} />}
            progress={p4}
          />
        </div>
      </div>
    </div>
  );
};

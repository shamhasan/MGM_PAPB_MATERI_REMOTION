export const FPS = 30;

// angka = frame transisi MENUJU stop tersebut (sama dengan 02-storyboard.md)
export const SCENES = [
  { id: "spaghetti", stops: [0, 90, 24, 24, 24] },
  { id: "restaurant", stops: [18, 24, 24, 24, 24] },
  { id: "cut", stops: [18, 48, 36] },
  { id: "layers", stops: [0, 24, 24, 24, 24] }, // stop 0 ≡ akhir 'cut'.2
  { id: "flow", stops: [24, 60, 60] },
  { id: "test", stops: [24, 24, 24, 24, 24, 30] },
] as const;

export interface TimelineEntry {
  sceneIndex: number;
  sceneId: string;
  stopIndex: number;
  duration: number;
  start: number;
  end: number;
}

// Turunkan dari SCENES (jangan tulis tangan):
// TIMELINE: { sceneIndex, sceneId, stopIndex, duration, start, end }[]
let currentFrame = 0;
export const TIMELINE: TimelineEntry[] = [];

for (let sIdx = 0; sIdx < SCENES.length; sIdx++) {
  const scene = SCENES[sIdx];
  for (let stIdx = 0; stIdx < scene.stops.length; stIdx++) {
    const duration = scene.stops[stIdx];
    const start = currentFrame;
    const end = start + duration;
    TIMELINE.push({
      sceneIndex: sIdx,
      sceneId: scene.id,
      stopIndex: stIdx,
      duration,
      start,
      end,
    });
    currentFrame = end;
  }
}

// SETTLED: number[] → nilai `end` unik & terurut = daftar state (harus 25 item)
export const SETTLED: number[] = Array.from(
  new Set(TIMELINE.map((t) => t.end))
).sort((a, b) => a - b);

// TOTAL_FRAMES = SETTLED.at(-1)! + 1 → durasi komposisi (745)
export const TOTAL_FRAMES = SETTLED[SETTLED.length - 1] + 1;

export function lookup(
  sceneIndex: number,
  stopIndex: number
): { start: number; end: number } {
  const entry = TIMELINE.find(
    (item) => item.sceneIndex === sceneIndex && item.stopIndex === stopIndex
  );
  if (!entry) {
    throw new Error(
      `Stop not found for sceneIndex: ${sceneIndex}, stopIndex: ${stopIndex}`
    );
  }
  return { start: entry.start, end: entry.end };
}

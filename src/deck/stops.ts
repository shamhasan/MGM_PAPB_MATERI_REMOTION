export const FPS = 30;

// Nilai angka merepresentasikan frame transisi MENUJU stop tersebut
export const SCENES = [
  { id: 'recap',   stops: [0, 30] },
  { id: 'cycle',   stops: [18, 36, 36, 36, 36] },
  { id: 'layers',  stops: [24, 60, 60, 30, 30] },
  { id: 'mapping', stops: [24, 30, 30, 36, 30] },
  { id: 'async',   stops: [24, 36, 36, 36, 36, 36] },
  { id: 'states',  stops: [24, 30, 30, 24, 30] },
  { id: 'errors',  stops: [24, 30, 30, 30, 30] },
  { id: 'summary', stops: [24, 30, 30, 30, 30, 30] },
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

// SETTLED: number[] → nilai `end` unik & terurut = daftar state (harus 39 item)
export const SETTLED: number[] = Array.from(
  new Set(TIMELINE.map((t) => t.end))
).sort((a, b) => a - b);

// TOTAL_FRAMES = SETTLED.at(-1)! + 1 → durasi komposisi (1207)
export const TOTAL_FRAMES = SETTLED[SETTLED.length - 1] + 1;

export function lookup(
  scene: number | string,
  stopIndex: number
): { start: number; end: number } {
  let entry: TimelineEntry | undefined;

  if (typeof scene === "string") {
    entry = TIMELINE.find(
      (item) => item.sceneId === scene && item.stopIndex === stopIndex
    );
  } else {
    entry = TIMELINE.find(
      (item) => item.sceneIndex === scene && item.stopIndex === stopIndex
    );
  }

  if (!entry) {
    throw new Error(
      `Stop not found for scene: ${scene}, stopIndex: ${stopIndex}`
    );
  }
  return { start: entry.start, end: entry.end };
}

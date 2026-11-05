export const FPS = 30;

// Nilai angka merepresentasikan frame transisi MENUJU stop tersebut
export const SCENES = [
  { id: "painpoints", stops: [0, 30, 30, 30] }, // Scene 1: State 0–3   (90 frame)
  { id: "suspend", stops: [24, 36, 36, 30, 24] }, // Scene 2: State 4–8   (150 frame)
  { id: "structured", stops: [24, 30, 30, 36, 30] }, // Scene 3: State 9–13  (150 frame)
  { id: "stateflow", stops: [24, 30, 30, 36, 30] }, // Scene 4: State 14–18 (150 frame)
  { id: "flowsearch", stops: [24, 30, 36, 30, 36, 30] }, // Scene 5: State 19–24 (186 frame)
  { id: "summary", stops: [24, 30, 30, 30, 30, 30] }, // Scene 6: State 25–30 (174 frame)
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

// SETTLED: number[] → nilai `end` unik & terurut = daftar state (harus 31 item)
export const SETTLED: number[] = Array.from(
  new Set(TIMELINE.map((t) => t.end))
).sort((a, b) => a - b);

// TOTAL_FRAMES = SETTLED.at(-1)! + 1 → durasi komposisi (901)
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

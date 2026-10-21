import { useCurrentFrame } from "remotion";
import { lookup } from "./stops";

export function useStopProgress(scene: number | string, stop: number): number {
  const frame = useCurrentFrame();
  const { start, end } = lookup(scene, stop);
  if (end === start) return frame >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (frame - start) / (end - start)));
}

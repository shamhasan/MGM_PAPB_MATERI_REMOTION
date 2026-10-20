import type { PlayerRef } from "@remotion/player";
import { FPS, SETTLED } from "./stops";

let idx = 0;
let raf = 0;
let target: number | null = null;
let playerRef: PlayerRef | null = null;

export function setPlayer(p: PlayerRef | null) {
  playerRef = p;
  if (p) {
    const f = p.getCurrentFrame();
    const foundIdx = SETTLED.indexOf(f);
    if (foundIdx !== -1) {
      idx = foundIdx;
    }
  }
}

export function getPlayer(): PlayerRef | null {
  return playerRef;
}

export function getCurrentStateIndex(): number {
  return idx;
}

export function getTargetFrame(): number | null {
  return target;
}

function animateTo(p: PlayerRef, to: number) {
  cancelAnimationFrame(raf);
  target = to;
  const from = p.getCurrentFrame();
  if (from === to) {
    target = null;
    return;
  }
  const dir = Math.sign(to - from);
  const t0 = performance.now();

  const tick = (now: number) => {
    const elapsed = Math.max(0, now - t0);
    const f = from + dir * Math.floor((elapsed / 1000) * FPS);
    const c = dir > 0 ? Math.min(f, to) : Math.max(f, to);
    p.seekTo(c);
    if (c !== to) {
      raf = requestAnimationFrame(tick);
    } else {
      target = null;
    }
  };
  raf = requestAnimationFrame(tick);
}

export function next(): void {
  if (!playerRef) return;

  if (target !== null) {
    cancelAnimationFrame(raf);
    playerRef.seekTo(target);
    target = null;
    return;
  }

  idx = Math.min(idx + 1, SETTLED.length - 1);
  animateTo(playerRef, SETTLED[idx]);
}

export function prev(): void {
  if (!playerRef) return;

  if (target !== null) {
    cancelAnimationFrame(raf);
    playerRef.seekTo(target);
    target = null;
    return;
  }

  idx = Math.max(idx - 1, 0);
  animateTo(playerRef, SETTLED[idx]);
}

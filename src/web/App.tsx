import React, { useEffect, useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { Deck } from "../deck/Deck";
import { FPS, TOTAL_FRAMES } from "../deck/stops";
import { next, prev, setPlayer } from "../deck/driver";

export const App: React.FC = () => {
  const playerRef = useRef<PlayerRef>(null);

  useEffect(() => {
    setPlayer(playerRef.current);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Abaikan auto-repeat tombol (docs/05 bagian 6 butir 2)
      if (e.repeat) return;

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (e.button === 0) {
        next();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);

    return () => {
      setPlayer(null);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-dark, #191A21)",
        overflow: "hidden",
        userSelect: "none",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "calc(100vh * (16 / 9))",
          maxHeight: "calc(100vw * (9 / 16))",
          aspectRatio: "16 / 9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Player
          ref={playerRef}
          component={Deck}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={FPS}
          durationInFrames={TOTAL_FRAMES}
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          loop={false}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
};

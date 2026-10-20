import React from "react";
import { Composition } from "remotion";
import { Deck } from "./deck/Deck";
import { FPS, TOTAL_FRAMES } from "./deck/stops";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "./styles/tokens.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Deck"
        component={Deck}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};

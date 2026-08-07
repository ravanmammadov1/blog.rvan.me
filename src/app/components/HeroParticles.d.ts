import type { CSSProperties, MutableRefObject } from "react";

declare const HeroParticles: (props: {
  mouseRef?: MutableRefObject<{ x: number; y: number }>;
  style?: CSSProperties;
}) => JSX.Element;

export default HeroParticles;

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import ParticleField from './ParticleField.jsx';

/**
 * HeroParticles
 *
 * Decorative WebGL particle background.
 * Rendered with alpha transparency behind Hero content (-z-10).
 */
export default function HeroParticles({ mouseRef, style = {} }) {
  return (
    <div
      style={{
        position:      'absolute',
        inset:         0,
        overflow:      'hidden',
        pointerEvents: 'none',
        zIndex:        -10,
        ...style,
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias:       false,
          alpha:           true,
          powerPreference: 'high-performance',
          stencil:         false,
          depth:           false,
        }}
        camera={{
          fov:      60,
          near:     0.1,
          far:      1000,
          position: [0, 0, 14],
        }}
        style={{
          display:       'block',
          width:         '100%',
          height:        '100%',
          pointerEvents: 'none',
        }}
      >
        <ParticleField mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}

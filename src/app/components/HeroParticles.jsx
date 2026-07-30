import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import ParticleField from './ParticleField.jsx';

/**
 * HeroParticles
 *
 * Pure WebGL canvas — pointer-events: none so the cursor and all DOM
 * interactions pass straight through to the parent hero section.
 * Mouse tracking lives in the parent (Hero.jsx) and is forwarded here
 * via the mouseRef prop.
 *
 * Props:
 *   mouseRef  – { x, y } in canvas-relative pixels (from Hero.jsx)
 *   style     – optional extra inline styles for the wrapper div
 */
export default function HeroParticles({ mouseRef, style = {} }) {
  return (
    <div
      style={{
        position:      'absolute',
        inset:         0,
        overflow:      'hidden',
        pointerEvents: 'none',   // ← pass ALL events (including cursor) to parent
        zIndex:        0,
        ...style,
      }}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias:       false,
          alpha:           false,
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
          display: 'block',
          width:   '100%',
          height:  '100%',
          // Canvas itself must also not steal the cursor
          pointerEvents: 'none',
        }}
      >
        <color attach="background" args={['#050505']} />
        <ParticleField mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}

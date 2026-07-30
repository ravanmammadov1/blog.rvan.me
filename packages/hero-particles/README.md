# hero-particles

> Premium interactive WebGL particle background — React Three Fiber

A fully self-contained, reusable React component that renders 6,336 particles with cinematic mouse interaction using potential flow physics.

## Physics Model

This is **not** a simple particle repulsion system. The interaction is based on two mathematical primitives:

### 1. Curl Noise (idle animation)
The background motion uses **2D curl noise** — the numerical curl of a noise potential field:
```
curl_x = ∂N/∂y
curl_y = -∂N/∂x
```
This produces a **divergence-free** (incompressible) flow field: particles swirl, eddy, and drift with zero sources or sinks. The field evolves continuously so the background is never static.

### 2. Rankine Cylinder Potential Flow (cursor interaction)
When the cursor moves, it acts as a **solid cylinder** passing through an ideal fluid, governed by the complex velocity potential:
```
w(z) = U · (z + R²/z)
```
This means particles **flow around** the cursor like water flowing around an obstacle — not simply pushed away. The asymmetry, the split ahead of the cursor, and the wake behind it emerge naturally from the mathematics.

At low cursor speed a soft radial push is blended in (so particles don't cluster at the cursor). As speed increases, the Rankine flow dominates.

### 3. Velocity Target Integration
Instead of integrating forces → acceleration → velocity → position (Newtonian), particles follow a **target velocity** using an exponential moving average:
```
vel = lerp(vel, targetVel, smoothingFactor) * damping
pos += vel
```
This gives the fluid, laggy, organic feel of a real viscous medium.

## File Structure

```
src/
├── components/
│   ├── HeroParticles.jsx    ← Drop-in canvas wrapper (pointer-events: none)
│   ├── ParticleField.jsx    ← Core physics + Three.js rendering
│   └── MouseRepulsion.js   ← Curl noise + Rankine flow math utilities
└── Hero.jsx                 ← Demo hero section with mouse tracking
```

## Usage

```jsx
import { useRef, useCallback } from 'react';
import HeroParticles from './components/HeroParticles.jsx';

function MyHero() {
  const mouseRef = useRef({ x: -99999, y: -99999 });

  return (
    <section
      style={{ position: 'relative', height: '100vh' }}
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }}
      onMouseLeave={() => { mouseRef.current = { x: -99999, y: -99999 }; }}
    >
      <HeroParticles mouseRef={mouseRef} />
      {/* your content here */}
    </section>
  );
}
```

## Performance

| Metric | Value |
|---|---|
| Particles | 6,336 (88 × 72 grid) |
| Position storage | `Float32Array` (zero GC pressure) |
| Update strategy | In-place mutation + `BufferAttribute.needsUpdate` |
| Render path | Single `THREE.Points` draw call |
| CPU/frame | ~0.5–1.5 ms (M-series / modern laptop) |
| Target FPS | 60 |

## Stack

- [React Three Fiber](https://r3f.docs.pmnd.rs/) — React renderer for Three.js
- [Three.js](https://threejs.org/) — WebGL
- [Vite](https://vitejs.dev/) — dev server + build

## Getting Started

```bash
npm install
npm run dev
```

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { curlNoise2D, cursorDisturbance } from './MouseRepulsion.js';

// ─────────────────────────────────────────────────────────────────────────────
// Particle grid
// ─────────────────────────────────────────────────────────────────────────────
const COLS           = 88;
const ROWS           = 72;
const PARTICLE_COUNT = COLS * ROWS;   // 6 336

const SPREAD_X = 24;   // world units, horizontal
const SPREAD_Y = 16;   // world units, vertical

// ─────────────────────────────────────────────────────────────────────────────
// Physics — flow-field model (not force/spring)
//
// Instead of computing forces and integrating acceleration → velocity → pos,
// we compute a TARGET VELOCITY from three sources and smoothly blend toward it.
// This gives the fluid, organic feel of modern WebGL demos.
// ─────────────────────────────────────────────────────────────────────────────

// Global curl-noise field (idle animation — always evolving)
const CURL_SCALE     = 0.13;   // spatial frequency: lower = larger vortices
const CURL_SPEED     = 1.0;    // time evolution rate
const CURL_AMPLITUDE = 0.015;  // world units/frame added by curl field

// Spring — extremely gentle, purely to prevent unbounded drift
const SPRING_K       = 0.0018; // acceleration toward origin per unit displacement

// Cursor influence zone (in screen pixels — converted per-frame to world units)
const INFLUENCE_PX   = 240;    // outer radius
const INNER_RATIO    = 0.18;   // innerR = INFLUENCE_PX * INNER_RATIO (≈43 px)

// Cursor disturbance amplitudes
const STATIC_PUSH    = 0.010;  // world-units/frame push when cursor is stationary
const FLOW_STR       = 0.14;   // Rankine flow amplitude multiplier

// Velocity smoothing — exponential moving average toward target each frame
// Lower = more inertia (laggy, fluid)  Higher = snappier
const VEL_SMOOTHING  = 0.055;

// Global damping — very gentle, particles keep moving long after disturbance
const DAMPING        = 0.975;

// Hard speed cap to prevent rare runaway accumulation
const MAX_SPEED      = 0.55;   // world units/frame

// Visual
const PARTICLE_SIZE    = 0.11;
const PARTICLE_COLOR   = '#3B82F6';
const PARTICLE_OPACITY = 0.90;

// ─────────────────────────────────────────────────────────────────────────────
// Glow texture
// ─────────────────────────────────────────────────────────────────────────────
function createGlowTexture() {
  const S  = 64;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const ctx = cv.getContext('2d');
  const cx  = S / 2;

  const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
  g.addColorStop(0.00, 'rgba(255,255,255,1.00)');
  g.addColorStop(0.20, 'rgba(255,255,255,0.90)');
  g.addColorStop(0.48, 'rgba(255,255,255,0.45)');
  g.addColorStop(0.75, 'rgba(255,255,255,0.12)');
  g.addColorStop(1.00, 'rgba(255,255,255,0.00)');

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return new THREE.CanvasTexture(cv);
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function ParticleField({ mouseRef }) {
  const pointsRef = useRef(null);
  const { camera, size } = useThree();

  // Typed arrays — allocated once, mutated every frame
  const origX  = useRef(null);
  const origY  = useRef(null);
  const velX   = useRef(null);
  const velY   = useRef(null);
  const posArr = useRef(null);

  // ── Geometry (built once) ────────────────────────────────────────────────
  const geometry = useMemo(() => {
    const N   = PARTICLE_COUNT;
    const pos = new Float32Array(N * 3);
    const ox  = new Float32Array(N);
    const oy  = new Float32Array(N);
    const vx  = new Float32Array(N);
    const vy  = new Float32Array(N);

    let i = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = (col / (COLS - 1) - 0.5) * SPREAD_X;
        const y = (row / (ROWS - 1) - 0.5) * SPREAD_Y;
        pos[i * 3]     = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = 0;
        ox[i] = x;
        oy[i] = y;
        i++;
      }
    }

    origX.current  = ox;
    origY.current  = oy;
    velX.current   = vx;
    velY.current   = vy;
    posArr.current = pos;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  // ── Material ─────────────────────────────────────────────────────────────
  const material = useMemo(() => {
    const tex = createGlowTexture();
    return new THREE.PointsMaterial({
      color:           new THREE.Color(PARTICLE_COLOR),
      size:            PARTICLE_SIZE,
      sizeAttenuation: true,
      transparent:     true,
      opacity:         PARTICLE_OPACITY,
      blending:        THREE.AdditiveBlending,
      depthWrite:      false,
      depthTest:       false,
      map:             tex,
      alphaMap:        tex,
      alphaTest:       0.001,
    });
  }, []);

  // ── Frame state (mutable, no re-render) ──────────────────────────────────
  let clock     = 0;
  let prevMxW   = 0;
  let prevMyW   = 0;
  let smoothCvx = 0;  // smoothed cursor world velocity x
  let smoothCvy = 0;  // smoothed cursor world velocity y
  let mouseWasActive = false;

  // ── Animation loop ───────────────────────────────────────────────────────
  useFrame((_state, delta) => {
    if (!pointsRef.current) return;

    const dt = Math.min(delta, 0.05);
    clock += dt;

    const pos = posArr.current;
    const ox  = origX.current;
    const oy  = origY.current;
    const vx  = velX.current;
    const vy  = velY.current;

    // ── World-space mouse position ────────────────────────────────────────
    // Camera is perspective at z=14, fov=60.
    // visibleHeight = 2 * tan(30°) * 14 ≈ 16.17 world units
    const fovRad    = (camera.fov * Math.PI) / 180;
    const visH      = 2 * Math.tan(fovRad / 2) * camera.position.z;
    const visW      = visH * (size.width / size.height);
    const pxToWorld = visH / size.height;

    const mouse = mouseRef.current;
    let mxW  = prevMxW;
    let myW  = prevMyW;
    let mouseActive = false;

    if (mouse && mouse.x > -9000) {
      mxW  = (mouse.x / size.width  - 0.5) * visW;
      myW  = (0.5 - mouse.y / size.height) * visH;
      mouseActive = true;
    }

    // ── Smoothed cursor velocity (world units / frame) ────────────────────
    const rawCvx = mouseActive ? (mxW - prevMxW) : 0;
    const rawCvy = mouseActive ? (myW - prevMyW) : 0;

    // Exponential smoothing kills high-frequency mouse jitter
    const velSmooth = 0.25;
    smoothCvx = smoothCvx + (rawCvx - smoothCvx) * velSmooth;
    smoothCvy = smoothCvy + (rawCvy - smoothCvy) * velSmooth;

    prevMxW = mxW;
    prevMyW = myW;
    mouseWasActive = mouseActive;

    // Cursor speed and direction
    const cSpeed   = Math.sqrt(smoothCvx * smoothCvx + smoothCvy * smoothCvy);
    const invCSpeed = cSpeed > 1e-5 ? 1 / cSpeed : 0;
    const cdx      = smoothCvx * invCSpeed;  // normalized direction, (0,0) when still
    const cdy      = smoothCvy * invCSpeed;

    // Convert influence radius from screen pixels to world units
    const outerR = INFLUENCE_PX * pxToWorld;
    const innerR = outerR * INNER_RATIO;

    // ── Per-particle loop ─────────────────────────────────────────────────
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const px = pos[i3];
      const py = pos[i3 + 1];

      // 1. Global curl-noise field sampled at ORIGIN position.
      //    Using the resting position (not current position) avoids feedback
      //    loops where drift changes the noise sample → more drift.
      const noiseX = ox[i] * CURL_SCALE;
      const noiseY = oy[i] * CURL_SCALE;
      const curl = curlNoise2D(noiseX, noiseY, clock * CURL_SPEED);

      // 2. Gentle spring toward origin (just enough to prevent runaway drift)
      const springVx = (ox[i] - px) * SPRING_K;
      const springVy = (oy[i] - py) * SPRING_K;

      // 3. Cursor disturbance: Rankine cylinder flow + soft static push
      let distVx = 0, distVy = 0;
      if (mouseActive) {
        const dx   = px - mxW;
        const dy   = py - myW;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const { vx: dvx, vy: dvy } = cursorDisturbance(
          dx, dy, dist,
          cdx, cdy, cSpeed,
          innerR, outerR,
          STATIC_PUSH, FLOW_STR
        );
        distVx = dvx;
        distVy = dvy;
      }

      // 4. Target velocity = sum of all contributions
      const targetVx = curl.x * CURL_AMPLITUDE + springVx + distVx;
      const targetVy = curl.y * CURL_AMPLITUDE + springVy + distVy;

      // 5. Smooth integration: exponential blend toward target.
      //    This is the key difference from a force-based system:
      //    velocity FOLLOWS the flow field rather than being accelerated by it.
      //    Gives the impression of a fluid carrying particles.
      vx[i] += (targetVx - vx[i]) * VEL_SMOOTHING;
      vy[i] += (targetVy - vy[i]) * VEL_SMOOTHING;

      // 6. Gentle global damping
      vx[i] *= DAMPING;
      vy[i] *= DAMPING;

      // 7. Speed clamp (rare — prevents occasional numerical blow-up)
      const spd = Math.sqrt(vx[i] * vx[i] + vy[i] * vy[i]);
      if (spd > MAX_SPEED) {
        const inv = MAX_SPEED / spd;
        vx[i] *= inv;
        vy[i] *= inv;
      }

      // 8. Integrate position
      pos[i3]     += vx[i];
      pos[i3 + 1] += vy[i];
    }

    // Mark GPU buffer for upload
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}

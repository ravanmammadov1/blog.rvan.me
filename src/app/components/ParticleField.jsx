import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Increased particle grid from 90x75 (6,750) to 110x95 (10,450) -> +54.8% density increase
const COLS = 110;
const ROWS = 95;
const PARTICLE_COUNT = COLS * ROWS; // 10,450 particles

// Premium branding color palette (cyan, blue, purple with luminous variations)
const PALETTE = [
  new THREE.Color('#06b6d4'), // Cyan
  new THREE.Color('#3b82f6'), // Blue
  new THREE.Color('#8b5cf6'), // Purple
  new THREE.Color('#60a5fa'), // Light Blue
  new THREE.Color('#22d3ee'), // Bright Cyan
];

const REVEAL_RADIUS_PX = 250; // Screen-space reveal radius around cursor
const FADE_SPEED = 0.12; // Smooth fade-in / fade-out speed
const LERP_POSITION = 0.05; // Soft anti-gravity movement lerp speed

export default function ParticleField({ mouseRef }) {
  const pointsRef = useRef(null);
  const { camera, size } = useThree();

  // Dynamically compute visible dimensions at camera depth
  const visH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
  const visW = visH * (size.width / size.height);

  const SPREAD_X = visW * 1.25; // 25% padding for seamless edge-to-edge coverage
  const SPREAD_Y = visH * 1.25;

  const { positions, baseColors, displayColors, origX, origY, currX, currY, alphaArr, orbitPhases } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const baseCols = new Float32Array(PARTICLE_COUNT * 3);
    const dispCols = new Float32Array(PARTICLE_COUNT * 3);
    const ox = new Float32Array(PARTICLE_COUNT);
    const oy = new Float32Array(PARTICLE_COUNT);
    const cx = new Float32Array(PARTICLE_COUNT);
    const cy = new Float32Array(PARTICLE_COUNT);
    const alphas = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // Normalized coordinates (-1 to 1)
        const nx = (c / (COLS - 1) - 0.5) * 2;
        const ny = (r / (ROWS - 1) - 0.5) * 2;
        const distFromCenter = Math.sqrt(nx * nx + ny * ny);

        // Center-weighted smooth density modulation: ~25% higher particle density near hero center without clustering
        const compress = 1.0 - 0.22 * Math.exp(-distFromCenter * distFromCenter * 1.6);

        const jitterX = (Math.random() - 0.5) * (SPREAD_X / COLS) * 0.75;
        const jitterY = (Math.random() - 0.5) * (SPREAD_Y / ROWS) * 0.75;

        const x = (nx * 0.5 * SPREAD_X * compress) + jitterX;
        const y = (ny * 0.5 * SPREAD_Y * compress) + jitterY;

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = 0;

        ox[i] = x;
        oy[i] = y;
        cx[i] = x;
        cy[i] = y;
        alphas[i] = 0; // Default completely invisible (idle state)
        phases[i] = Math.random() * Math.PI * 2;

        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        baseCols[i * 3] = color.r;
        baseCols[i * 3 + 1] = color.g;
        baseCols[i * 3 + 2] = color.b;

        dispCols[i * 3] = 0;
        dispCols[i * 3 + 1] = 0;
        dispCols[i * 3 + 2] = 0;

        i++;
      }
    }

    return {
      positions: pos,
      baseColors: baseCols,
      displayColors: dispCols,
      origX: ox,
      origY: oy,
      currX: cx,
      currY: cy,
      alphaArr: alphas,
      orbitPhases: phases,
    };
  }, [SPREAD_X, SPREAD_Y]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const pxToWorld = visH / size.height;
    const radiusW = REVEAL_RADIUS_PX * pxToWorld;

    const mouse = mouseRef?.current;
    let mxW = 99999;
    let myW = 99999;
    let mouseActive = false;

    if (mouse && mouse.x > -9000) {
      mxW = (mouse.x / size.width - 0.5) * visW;
      myW = (0.5 - mouse.y / size.height) * visH;
      mouseActive = true;
    }

    let needsColorUpdate = false;
    let needsPositionUpdate = false;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      const dx = currX[i] - mxW;
      const dy = currY[i] - myW;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Target alpha based on distance to cursor with smoothstep radial falloff
      let targetAlpha = 0;
      if (mouseActive && dist < radiusW) {
        const normDist = dist / radiusW; // 0 at center, 1 at edge
        targetAlpha = (1 - normDist) * (1 - normDist) * (3 - 2 * (1 - normDist));
      }

      // Smooth alpha fade-in / fade-out
      const prevAlpha = alphaArr[i];
      alphaArr[i] += (targetAlpha - alphaArr[i]) * FADE_SPEED;

      // Color updates only when alpha changes meaningfully
      if (Math.abs(alphaArr[i] - prevAlpha) > 0.001 || targetAlpha > 0 || alphaArr[i] > 0.001) {
        const a = alphaArr[i];
        displayColors[i3] = baseColors[i3] * a;
        displayColors[i3 + 1] = baseColors[i3 + 1] * a;
        displayColors[i3 + 2] = baseColors[i3 + 2] * a;
        needsColorUpdate = true;
      }

      // Anti-gravity motion physics when particle is visible
      if (alphaArr[i] > 0.001) {
        const idleX = origX[i] + Math.sin(time * 0.75 + orbitPhases[i]) * 0.14;
        const idleY = origY[i] + Math.cos(time * 0.75 + orbitPhases[i]) * 0.14;

        let targetX = idleX;
        let targetY = idleY;

        if (mouseActive && dist < radiusW && dist > 0.001) {
          const angle = Math.atan2(dy, dx) + 0.42; // Soft perpendicular orbit angle
          const pushForce = (1 - dist / radiusW) * 0.38;

          const orbitX = Math.cos(angle) * pushForce;
          const orbitY = Math.sin(angle) * pushForce;

          targetX = currX[i] + orbitX + (dx / dist) * pushForce * 0.22;
          targetY = currY[i] + orbitY + (dy / dist) * pushForce * 0.22;
        }

        currX[i] += (targetX - currX[i]) * LERP_POSITION;
        currY[i] += (targetY - currY[i]) * LERP_POSITION;

        positions[i3] = currX[i];
        positions[i3 + 1] = currY[i];
        needsPositionUpdate = true;
      } else {
        // Return smoothly to rest position while invisible
        currX[i] += (origX[i] - currX[i]) * 0.02;
        currY[i] += (origY[i] - currY[i]) * 0.02;
        positions[i3] = currX[i];
        positions[i3 + 1] = currY[i];
      }
    }

    if (needsColorUpdate) {
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
    if (needsPositionUpdate) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[displayColors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.075}
        vertexColors
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

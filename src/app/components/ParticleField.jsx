import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Ultra-dense particle grid: 150x125 = 18,750 micro-particles
const COLS = 150;
const ROWS = 125;
const PARTICLE_COUNT = COLS * ROWS; // 18,750 particles

// Premium branding color palette (cyan, blue, purple with luminous variations)
const PALETTE = [
  new THREE.Color('#06b6d4'), // Cyan
  new THREE.Color('#3b82f6'), // Blue
  new THREE.Color('#8b5cf6'), // Purple
  new THREE.Color('#60a5fa'), // Light Blue
  new THREE.Color('#22d3ee'), // Bright Cyan
];

const REVEAL_RADIUS_PX = 260; // Screen-space reveal radius around cursor
const FADE_SPEED = 0.14; // Fast & smooth fade-in / fade-out interpolation speed
const LERP_POSITION = 0.05; // Soft anti-gravity movement lerp speed

// Custom ShaderMaterial for per-vertex alpha, full luminous brightness & zero idle pixel rendering
const particleShaderMaterial = {
  uniforms: {
    uPointScale: { value: 36.0 },
  },
  vertexShader: `
    attribute vec3 customColor;
    attribute float customAlpha;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = customColor;
      vAlpha = customAlpha;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = (36.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      // Discard immediately if particle alpha is 0 — zero black dots or background artifacts when idle!
      if (vAlpha <= 0.001) discard;

      // Calculate radial distance from point center for smooth circular anti-aliasing
      vec2 coord = gl_PointCoord - vec2(0.5);
      float distSq = dot(coord, coord);
      if (distSq > 0.25) discard;

      float circleAlpha = smoothstep(0.5, 0.06, sqrt(distSq));
      float finalAlpha = vAlpha * circleAlpha;

      if (finalAlpha <= 0.001) discard;

      // Pass un-premultiplied vColor for AdditiveBlending (produces full original luminous glow)
      gl_FragColor = vec4(vColor, finalAlpha);
    }
  `,
};

export default function ParticleField({ mouseRef }) {
  const pointsRef = useRef(null);
  const { camera, size } = useThree();

  // Dynamically compute visible dimensions at camera depth
  const visH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
  const visW = visH * (size.width / size.height);

  const SPREAD_X = visW * 1.25; // 25% padding for seamless edge-to-edge coverage
  const SPREAD_Y = visH * 1.25;

  const { positions, baseColors, origX, origY, currX, currY, alphaArr, orbitPhases } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const baseCols = new Float32Array(PARTICLE_COUNT * 3);
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

        // Center-weighted smooth density modulation
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

        i++;
      }
    }

    return {
      positions: pos,
      baseColors: baseCols,
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

    if (mouse && mouse.x > -9000 && mouse.x < 9000 && mouse.y > -9000 && mouse.y < 9000) {
      mxW = (mouse.x / size.width - 0.5) * visW;
      myW = (0.5 - mouse.y / size.height) * visH;
      mouseActive = true;
    }

    let needsAlphaUpdate = false;
    let needsPositionUpdate = false;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      const dx = currX[i] - mxW;
      const dy = currY[i] - myW;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Target alpha based on distance to cursor with full 1.0 peak brightness & smooth cubic falloff
      let targetAlpha = 0;
      if (mouseActive && dist < radiusW) {
        const normDist = dist / radiusW; // 0 at center, 1 at edge
        const falloff = 1 - normDist;
        // Smoothstep cubic interpolation: 1.0 peak at cursor center, 0 at edge
        targetAlpha = falloff * falloff * (3.0 - 2.0 * falloff);
      }

      // Smooth alpha fade-in / fade-out interpolation
      const prevAlpha = alphaArr[i];
      alphaArr[i] += (targetAlpha - alphaArr[i]) * FADE_SPEED;

      // Snap micro alphas to 0 for crisp zero-idle performance
      if (alphaArr[i] < 0.001) {
        alphaArr[i] = 0;
      }

      if (alphaArr[i] !== prevAlpha) {
        needsAlphaUpdate = true;
      }

      // Anti-gravity motion physics when particle is visible or returning
      if (alphaArr[i] > 0) {
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
        if (Math.abs(currX[i] - origX[i]) > 0.001 || Math.abs(currY[i] - origY[i]) > 0.001) {
          currX[i] += (origX[i] - currX[i]) * 0.05;
          currY[i] += (origY[i] - currY[i]) * 0.05;
          positions[i3] = currX[i];
          positions[i3 + 1] = currY[i];
          needsPositionUpdate = true;
        }
      }
    }

    if (needsAlphaUpdate && pointsRef.current.geometry.attributes.customAlpha) {
      pointsRef.current.geometry.attributes.customAlpha.needsUpdate = true;
    }
    if (needsPositionUpdate && pointsRef.current.geometry.attributes.position) {
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
          attach="attributes-customColor"
          args={[baseColors, 3]}
        />
        <bufferAttribute
          attach="attributes-customAlpha"
          args={[alphaArr, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        args={[particleShaderMaterial]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const COLS = 70;
const ROWS = 60;
const PARTICLE_COUNT = COLS * ROWS; // 4,200 particles

const SPREAD_X = 26;
const SPREAD_Y = 18;

const RADIUS_PX = 180; // Distance in pixels where repulsion activates
const REPULSION_SPEED = 0.08; // Smooth move away speed
const RETURN_SPEED = 0.03; // Smooth return speed

export default function ParticleField({ mouseRef }) {
  const pointsRef = useRef(null);
  const { camera, size } = useThree();

  const { positions, origX, origY, currX, currY, velX, velY } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const ox = new Float32Array(PARTICLE_COUNT);
    const oy = new Float32Array(PARTICLE_COUNT);
    const cx = new Float32Array(PARTICLE_COUNT);
    const cy = new Float32Array(PARTICLE_COUNT);
    const vx = new Float32Array(PARTICLE_COUNT);
    const vy = new Float32Array(PARTICLE_COUNT);

    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c / (COLS - 1) - 0.5) * SPREAD_X;
        const y = (r / (ROWS - 1) - 0.5) * SPREAD_Y;

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = 0;

        ox[i] = x;
        oy[i] = y;
        cx[i] = x;
        cy[i] = y;
        vx[i] = 0;
        vy[i] = 0;
        i++;
      }
    }

    return {
      positions: pos,
      origX: ox,
      origY: oy,
      currX: cx,
      currY: cy,
      velX: vx,
      velY: vy,
    };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const visH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const pxToWorld = visH / size.height;
    const radiusW = RADIUS_PX * pxToWorld;
    const radiusWSq = radiusW * radiusW;

    const mouse = mouseRef.current;
    let mxW = 99999;
    let myW = 99999;

    if (mouse && mouse.x > -9000) {
      const visW = visH * (size.width / size.height);
      mxW = (mouse.x / size.width - 0.5) * visW;
      myW = (0.5 - mouse.y / size.height) * visH;
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // 1. Idle Floating Motion (minimal & soft)
      const idleX = origX[i] + Math.sin(time * 0.8 + origY[i]) * 0.12;
      const idleY = origY[i] + Math.cos(time * 0.8 + origX[i]) * 0.12;

      // 2. Mouse Repulsion & Return Logic
      const dx = currX[i] - mxW;
      const dy = currY[i] - myW;
      const distSq = dx * dx + dy * dy;

      let targetX = idleX;
      let targetY = idleY;

      if (distSq < radiusWSq && distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / radiusW) * 1.5;
        targetX = currX[i] + (dx / dist) * force;
        targetY = currY[i] + (dy / dist) * force;
      }

      // 3. Smooth Position Interpolation (No complex physics/shaders)
      const lerpFactor = distSq < radiusWSq ? REPULSION_SPEED : RETURN_SPEED;
      currX[i] += (targetX - currX[i]) * lerpFactor;
      currY[i] += (targetY - currY[i]) * lerpFactor;

      positions[i3] = currX[i];
      positions[i3 + 1] = currY[i];
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#FFFFFF"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

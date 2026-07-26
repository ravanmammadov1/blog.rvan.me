import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Center, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import ErrorBoundary from "./ErrorBoundary";

const MODEL_PATH = "/models/ravan-logo.glb";

// Preload 3D model immediately for instant rendering
try {
  useGLTF.preload(MODEL_PATH);
} catch (e) {
  // Silent catch
}

function LogoModel() {
  const gltf = useGLTF(MODEL_PATH);
  const scene = gltf?.scene || (gltf?.scenes && gltf.scenes[0]);

  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { invalidate } = useThree();

  // Clone scene safely and configure pure PBR materials without self-shadowing artifacts
  const clonedScene = useMemo(() => {
    if (!scene) return null;
    try {
      const s = scene.clone();
      s.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          // Disable self-shadowing and contact shadow map reception to eliminate dark gradient artifacts
          mesh.castShadow = false;
          mesh.receiveShadow = false;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat) {
              mat.envMapIntensity = 1.4;
              mat.roughness = Math.min(mat.roughness, 0.35);
              mat.needsUpdate = true;
            }
          }
        }
      });
      return s;
    } catch (e) {
      return scene;
    }
  }, [scene]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.current = { x, y };
      // Request a render frame when pointer moves to avoid continuous render
      try {
        invalidate();
      } catch (e) {}
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const maxTilt = 6 * (Math.PI / 180);
    const targetY = mouse.current.x * maxTilt;
    const targetX = -mouse.current.y * maxTilt;

    const ry = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, delta * 5);
    const rx = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, delta * 5);

    const dy = Math.abs(groupRef.current.rotation.y - ry);
    const dx = Math.abs(groupRef.current.rotation.x - rx);

    groupRef.current.rotation.y = ry;
    groupRef.current.rotation.x = rx;

    // Continue invalidating frames while motion is above a tiny threshold
    if (dy > 0.0005 || dx > 0.0005) {
      try { invalidate(); } catch (e) {}
    }
  });

  if (!clonedScene) return null;

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.3}>
        <Center>
          <primitive object={clonedScene} scale={1.15} />
        </Center>
      </Float>
    </group>
  );
}

export default function Hero3DCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ErrorBoundary fallback={null}>
      <div className="relative h-full w-full overflow-hidden bg-transparent transition-opacity duration-700 ease-out">
        <Suspense fallback={null}>
          <Canvas
            frameloop="demand"
            dpr={[1, 1.2]}
            gl={{
              antialias: false,
              alpha: true,
              powerPreference: "high-performance",
              stencil: false,
              depth: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
            }}
            camera={{ position: [0, 0, 5], fov: 45 }}
            className="h-full w-full"
          >
            {/* Clean, shadowless studio lighting setup */}
            <ambientLight intensity={0.85} />
            <directionalLight position={[0, 6, 8]} intensity={1.6} />
            <directionalLight position={[0, -6, -4]} intensity={0.4} color="#ffffff" />
            <pointLight position={[-4, 2, 4]} intensity={0.8} color="#E2FE52" />

            {/* High-quality PBR environment reflections */}
            <Environment preset="city" environmentIntensity={1.0} />

            {/* 3D Model without artificial shadow planes or self-shadow gradient artifacts */}
            <LogoModel />
          </Canvas>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

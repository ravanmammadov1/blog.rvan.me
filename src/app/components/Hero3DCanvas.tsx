import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Float, Environment, ContactShadows } from "@react-three/drei";
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

  const clonedScene = useMemo(() => {
    if (!scene) return null;
    try {
      const s = scene.clone();
      s.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat) {
              mat.envMapIntensity = 1.2;
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
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const maxTilt = 6 * (Math.PI / 180);
    const targetY = mouse.current.x * maxTilt;
    const targetX = -mouse.current.y * maxTilt;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      delta * 5
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      delta * 5
    );
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
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              stencil: false,
              depth: true,
            }}
            camera={{ position: [0, 0, 5], fov: 45 }}
            className="h-full w-full"
          >
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.8}
              castShadow
              shadow-mapSize={[512, 512]}
            />
            <pointLight position={[-4, -4, 4]} intensity={0.7} color="#E2FE52" />

            <Environment preset="city" environmentIntensity={0.8} />

            <LogoModel />

            <ContactShadows
              position={[0, -1.3, 0]}
              opacity={0.5}
              scale={6}
              blur={2.2}
              far={4}
              color="#000000"
            />
          </Canvas>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

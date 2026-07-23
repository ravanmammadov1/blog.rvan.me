import { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import ErrorBoundary from "./ErrorBoundary";

const MODEL_PATH = "/models/ravanimate-logo.glb";

function LogoModel() {
  const gltf = useGLTF(MODEL_PATH);
  const scene = gltf?.scene || (gltf?.scenes && gltf.scenes[0]);

  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Clone scene safely to avoid re-use issues and apply PBR settings
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
      console.warn("Scene clone warning:", e);
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

    // Max 6 degrees tilt = 6 * (Math.PI / 180) ≈ 0.105 radians
    const maxTilt = 6 * (Math.PI / 180);
    const targetY = mouse.current.x * maxTilt;
    const targetX = -mouse.current.y * maxTilt;

    // Premium spring-damped lerp
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

// Safely preload model
try {
  useGLTF.preload(MODEL_PATH);
} catch (e) {
  console.warn("Preload 3D model notice:", e);
}

function Loader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-md text-foreground">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="mt-3 text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">
        LOADING 3D LOGO...
      </span>
    </div>
  );
}

function FallbackVisual() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-surface text-foreground text-center">
      <div className="h-16 w-16 rounded-2xl border-2 border-primary/60 bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mono mb-4 animate-pulse">
        R
      </div>
      <p className="text-xs font-bold tracking-widest text-primary mono uppercase">
        RAVANMATE CREATIVE 3D
      </p>
    </div>
  );
}

export default function Hero3DCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loader />;

  return (
    <ErrorBoundary fallback={<FallbackVisual />}>
      <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
        <Suspense fallback={<Loader />}>
          <Canvas
            dpr={[1, 2]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            camera={{ position: [0, 0, 5], fov: 45 }}
            className="h-full w-full"
          >
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.8}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[-4, -4, 4]} intensity={0.7} color="#E2FE52" />

            {/* Realistic PBR Environment Lighting */}
            <Environment preset="city" environmentIntensity={0.8} />

            {/* 3D Model with Subtle Mouse Interaction */}
            <LogoModel />

            {/* Soft Contact Shadows */}
            <ContactShadows
              position={[0, -1.3, 0]}
              opacity={0.55}
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

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Radial glow/shockwave burst anchored at a 3D world/local position.
// Non-intrusive: additive blend, no depth write/test, short-lived.
export default function RadialGlowBurst({ position = [0, 0, 0], duration = 0.6, color = "#facc15", onDone }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const startRef = useRef(performance.now());

  useEffect(() => {
    startRef.current = performance.now();
  }, [position]);

  useFrame(() => {
    const elapsed = (performance.now() - startRef.current) / 1000;
    const t = Math.min(elapsed / duration, 1);
    const scale = 0.6 + t * 1.8; // quick expansion
    const opacity = (1 - t) * 0.9; // fade out
    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale);
    }
    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }
    if (t >= 1 && typeof onDone === "function") onDone();
  });

  return (
    <group position={position} renderOrder={12}>
      <mesh rotation-x={Math.PI / 2} ref={meshRef}>
        <circleGeometry args={[0.5, 64]} />
        <meshBasicMaterial
          ref={materialRef}
          color={color}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
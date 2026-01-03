import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { usePlay } from "../contexts/Play";

function ImagesGridScene({ onHoverChange, hoveredIndex }) {
  const textureUrls = [
    "/images/image.png",
    "/images/image copy.png",
    "/images/image copy 2.png",
  ];
  const textures = useTexture(textureUrls);
  const { camera, size } = useThree();
  const dist = camera.position.z; // distance to grid (z=0)
  const fov = camera.fov;
  const heightView = 2 * dist * Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const widthView = heightView * (size.width / size.height);

  const cols = 10;
  const rows = 10; // 100 cubes
  const cellW = widthView / cols;
  const cellH = heightView / rows;
  const sizeBox = Math.min(cellW, cellH) * 0.65;

  const positions = useMemo(() => {
    const arr = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = -widthView / 2 + cellW * (c + 0.5);
        const y = -heightView / 2 + cellH * (r + 0.5);
        const i = r * cols + c;
        const z = Math.sin(i * 0.25) * 0.8 + Math.cos((r + c) * 0.3) * 0.3; // subtle depth
        arr.push([x, y, z]);
      }
    }
    return arr;
  }, [rows, cols, widthView, heightView, cellW, cellH]);

  const groupRef = useRef();
  const meshRefs = useRef([]);

  useFrame((_, delta) => {
    // shallow orbit for parallax
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
      groupRef.current.rotation.x += delta * 0.03;
    }

    const t = performance.now() * 0.001;
    for (let i = 0; i < meshRefs.current.length; i++) {
      const ref = meshRefs.current[i];
      if (!ref) continue;
      ref.rotation.x += delta * 0.15;
      ref.rotation.y += delta * 0.22;
      const base = 1.0 + Math.sin(t * 0.6 + i * 0.2) * 0.03;
      const target = hoveredIndex === i ? 1.22 : base;
      ref.scale.x = THREE.MathUtils.lerp(ref.scale.x, target, delta * 3);
      ref.scale.y = THREE.MathUtils.lerp(ref.scale.y, target, delta * 3);
      ref.scale.z = THREE.MathUtils.lerp(ref.scale.z, target, delta * 3);
    }
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => (meshRefs.current[i] = el)}
          position={pos}
          onPointerOver={() => onHoverChange(i)}
          onPointerOut={() => onHoverChange(null)}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[sizeBox, sizeBox, sizeBox]} />
          <meshStandardMaterial map={textures[i % textures.length]} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function MemoryScreen() {
  const { resetToStart } = usePlay();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const overlayUrls = [
    "/images/image.png",
    "/images/image copy.png",
    "/images/image copy 2.png",
  ];
  const overlaySrc = hoveredIndex !== null ? overlayUrls[hoveredIndex % overlayUrls.length] : null;

  return (
    <>
      <Canvas style={{ position: "fixed", inset: 0, zIndex: 9999 }} shadows frameloop="always">
        <color attach="background" args={["#000000"]} />
        <Suspense fallback={null}>
          {/* Perspective camera to recreate immersive 3D feel */}
          <PerspectiveCamera makeDefault position={[0, 0, 12]} near={0.01} far={2000} fov={85} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[8, 6, 10]} intensity={1.0} castShadow />
          <ImagesGridScene onHoverChange={setHoveredIndex} hoveredIndex={hoveredIndex} />
          <EffectComposer multisampling={2} disableNormalPass>
            <Bloom intensity={2.2} luminanceThreshold={0.1} luminanceSmoothing={0.92} mipmapBlur />
            <ChromaticAberration offset={[0.0015, 0.0015]} radialModulation={true} modulationOffset={0.0} />
            <Noise opacity={0.06} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Hover overlay enlarges the image on hover; pointer-events disabled to preserve 3D interactions */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: hoveredIndex !== null ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.2)",
          zIndex: 10000,
          pointerEvents: "none",
        }}
      >
        <img
          src={overlaySrc || "/images/image.png"}
          alt="memory"
          style={{
            maxWidth: "70vw",
            maxHeight: "70vh",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 8,
            opacity: 0.95,
          }}
        />
      </div>

      {/* Bottom-left welcome + back controls */}
      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 10000,
          color: "red",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ fontSize: "1.125rem", opacity: 0.9 }}>
          Welcome to the memory
        </div>
        <button
          onClick={resetToStart}
          style={{
            width: "fit-content",
            padding: "10px 14px",
            borderRadius: 8,
            border: "none",
            background: "#f97316",
            color: "red",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Back to the game from start
        </button>
      </div>
    </>
  );
}

// Preload image texture for snappier entrance
useTexture.preload("/images/image.png");
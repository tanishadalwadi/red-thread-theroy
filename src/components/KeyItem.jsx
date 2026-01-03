import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function KeyItem({
  position = [0, 0, 0],
  yaw = 0,
  color = "#facc15",
  label,
  collected = false,
  active = false,
}) {
  const groupRef = useRef();
  const materialsRef = useRef([]);
  // Load and clone the GLTF scene to avoid shared mutations across instances
  const gltf = useGLTF("/models/key_golem/scene.gltf");
  const [model] = useState(() => gltf.scene.clone(true));

  // Collect materials and apply emissive color once
  useEffect(() => {
    const mats = [];
    model.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        obj.visible = true;
        obj.frustumCulled = false;
        obj.renderOrder = 10;
        const arr = Array.isArray(obj.material) ? obj.material : [obj.material];
        arr.forEach((m) => {
          if (m && "emissive" in m) {
            m.emissive = new THREE.Color(color);
            m.emissiveIntensity = active ? 2.0 : 1.4; // stronger glow
            if ("side" in m) m.side = THREE.DoubleSide;
            if ("depthTest" in m) m.depthTest = false;
            if ("depthWrite" in m) m.depthWrite = false;
            if ("toneMapped" in m) m.toneMapped = false;
            mats.push(m);
          }
        });
      }
    });
    materialsRef.current = mats;
  }, [model, color, active]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
      const s = active ? 1.08 : 1.02;
      const current = groupRef.current.scale.x;
      const next = THREE.MathUtils.lerp(current, s, delta * 6);
      groupRef.current.scale.setScalar(next);
    }
    if (materialsRef.current.length) {
      const target = active ? 1.8 : 1.2; // maintain stronger glow over time
      materialsRef.current.forEach((m) => {
        m.emissiveIntensity = THREE.MathUtils.lerp(
          m.emissiveIntensity || 1.2,
          target,
          delta * 6
        );
      });
    }
  });

  if (collected) return null;

  return (
    <group ref={groupRef} position={position} rotation={[0, yaw, 0]}>
      {/* GLTF key model */}
      <Float floatIntensity={0.6} speed={1.2} rotationIntensity={0.6}>
        <primitive object={model} scale={[50, 50, 100]} />
      </Float>
      {label && (
        <Html center distanceFactor={10} position={[0, 6, 0]}>
          <div
            style={{
              color: "#ffffff",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "14px",
              background: "rgba(0,0,0,0.35)",
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(2px)",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload("/models/key_golem/scene.gltf");

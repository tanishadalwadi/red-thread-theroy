import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function PortalItem({
  position = [0, 0, 0],
  yaw = 0,
  color = "#f97316", // orange
  // Pitch rotates around X (make vertical); Roll rotates around Z
  pitch = 0,
  roll = 0,
  scale = [0.02, 0.02, 0.02],
}) {
  const groupRef = useRef();
  const materialsRef = useRef([]);
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const timeRef = useRef(0);
  const spinSpeedRef = useRef(0.6); // radians per second, gentle spin

  // Load GLTF blackhole model from public folder
  const gltf = useGLTF("/models/blackhole/scene.gltf");
  const [model] = useState(() => gltf.scene.clone(true));
  useEffect(() => {
    // Quick debug to confirm model loaded and position
    // eslint-disable-next-line no-console
    console.log("Portal GLTF loaded:", {
      name: gltf.scene?.name,
      position,
      yaw,
      scale,
    });
  }, [gltf.scene, position, yaw, scale]);

  // Ensure meshes render reliably; preserve GLTF materials for accurate blackhole look
  useEffect(() => {
    const mats = [];
    model.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        obj.visible = true;
        obj.frustumCulled = false;
        obj.renderOrder = 12;
        const arr = Array.isArray(obj.material) ? obj.material : [obj.material];
        arr.forEach((m) => {
          if (!m) return;
          // Do not override emissive/tone mapping/depth; keep GLTF intact
          mats.push(m);
        });
      }
    });
    materialsRef.current = mats;
  }, [model, color]);

  // Gentle, frame-rate-independent rotation to avoid visual stutter
  useFrame((_, delta) => {
    // Keep model scale constant
    model.scale.set(scale[0], scale[1], scale[2]);
    if (groupRef.current) {
      // Continuous smooth spin around Y
      groupRef.current.rotation.y += spinSpeedRef.current * delta;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[pitch, yaw, roll]}>
      <primitive object={model} scale={scale} dispose={null} />
    </group>
  );
}

useGLTF.preload("/models/blackhole/scene.gltf");

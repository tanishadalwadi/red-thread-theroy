import { useGLTF, useAnimations } from "@react-three/drei";
import React, { useMemo, useEffect } from "react";

export default function HomeBrain({ scale = [4.2, 4.2, 4.2] }) {
  const gltf = useGLTF("/models/cloud/brain_hologram/scene.gltf");
  const { scene, animations } = gltf;

  const cloned = useMemo(() => (scene ? scene.clone(true) : null), [scene]);
  const { actions } = useAnimations(animations || [], cloned);

  useEffect(() => {
    if (!actions) return;
    // Play all available animations from the GLTF
    Object.values(actions).forEach((action) => {
      if (action) {
        action.reset();
        action.play();
      }
    });
  }, [actions]);

  return (
    <group position={[0, 0, 0]} scale={scale}>
      {/* Soft lighting to match hero image look */}
      <ambientLight intensity={0.5} />
      <spotLight position={[0, 3, 4]} intensity={0.6} angle={0.4} penumbra={0.6} />
      {cloned && <primitive object={cloned} />}
  </group>
  );
}

useGLTF.preload("/models/cloud/brain_hologram/scene.gltf");
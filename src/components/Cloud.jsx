/*
GLTF-based cloud: load and render spherical creature model from /models/cloud/spherical_creature/scene.gltf
*/

import { useGLTF } from "@react-three/drei";
import React, { useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { gradientOnBeforeCompile } from "../utils/gradientOverlay";

export function Cloud({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  baseScale = 0.2,
  tint = null,
  emissiveColor = null,
  emissiveIntensity = null,
  gradientColorA = null,
  gradientColorB = null,
  gradientStrength = 0.85,
  ...props
}) {
  // Use singularity_001 GLTF directly (complete package with embedded bin/textures)
  const [modelPath] = useState("/models/cloud/sphere/scene.gltf");

  const gltf = useGLTF(modelPath);
  const { scene } = gltf;

  const cloned = useMemo(() => (scene ? scene.clone(true) : null), [scene]);

  useEffect(() => {
    if (!cloned) return;
    // Center the model so positioning matches expected coordinates
    const bbox = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    cloned.position.sub(center);
    cloned.updateMatrixWorld();

    // Ensure visibility of submeshes and enable shadows; preserve authored materials/colors
    cloned.traverse((n) => {
      if (n.isMesh) {
        n.frustumCulled = false;
        n.castShadow = true;
        n.receiveShadow = true;
        // Clone materials, retain native texture/color (no forced tint)
        const mats = Array.isArray(n.material) ? n.material : [n.material];
        const newMats = [];
        mats.forEach((m) => {
          if (!m) return;
          const cm = m.clone();
          // Optional tint and emissive override to match path color/glow
          if (tint && "color" in cm) {
            cm.color = new THREE.Color(tint);
          }
          const eColor = emissiveColor; // only apply emissive when explicitly provided
          if (eColor && "emissive" in cm) {
            cm.emissive = new THREE.Color(eColor);
            if ("emissiveIntensity" in cm && emissiveIntensity != null) {
              cm.emissiveIntensity = emissiveIntensity;
            }
            if ("toneMapped" in cm) cm.toneMapped = false; // keep glow vivid only when emissiveColor is set
          }
          // Optional non-emissive gradient overlay preserving GLTF shading/textures
          if (gradientColorA && gradientColorB && typeof cm.onBeforeCompile === "function") {
            cm.onBeforeCompile = gradientOnBeforeCompile({
              colorA: gradientColorA,
              colorB: gradientColorB,
              strength: gradientStrength,
            });
          }
          // Preserve color, emissive, roughness, metalness, and normal maps for true 3D shading
          newMats.push(cm);
        });
        if (newMats.length) {
          n.material = Array.isArray(n.material) ? newMats : newMats[0];
        }
      }
    });
  }, [cloned, modelPath]);

  // Final scale: shrink the GLTF uniformly, then apply provided scale
  const finalScale = Array.isArray(scale)
    ? [scale[0] * baseScale, scale[1] * baseScale, scale[2] * baseScale]
    : [scale.x * baseScale, scale.y * baseScale, scale.z * baseScale];

  return (
    <group
      position={position}
      rotation={rotation}
      scale={finalScale}
      {...props}
    >
      {cloned && <primitive object={cloned} />}
    </group>
  );
}
// Preload singularity_001 model for faster start
  useGLTF.preload("/models/cloud/sphere/scene.gltf");

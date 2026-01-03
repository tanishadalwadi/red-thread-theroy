import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Minimal, GLTF-free neon sphere field using instanced meshes
export default function SphereField({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  count = 1200,
  spread = 12,
  radius = 0.34,
  seed = 0,
  // Optional GLTF source and node to extract exact sphere geometry
  source = "/models/cloud/sphere(1)/scene.gltf",
  nodeName = null,
}) {
  // Load GLTF to optionally use the exact node geometry
  const gltf = useGLTF(source);
  const baseGeometry = useMemo(() => {
    let geom = null;
    if (gltf?.scene) {
      gltf.scene.traverse((n) => {
        if (!geom && n.isMesh && n.geometry) {
          if (!nodeName || n.name === nodeName) {
            geom = n.geometry.clone();
          }
        }
      });
    }
    // Fallback: small icosahedron if node not found
    return geom ?? new THREE.IcosahedronGeometry(1, 0);
  }, [gltf, nodeName]);

  const matPink = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#ff56e1"),
      emissive: new THREE.Color("#ff56e1"),
      emissiveIntensity: 1.6,
      roughness: 0.4,
      metalness: 0.0,
      opacity: 0.9,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    m.depthWrite = false;
    m.toneMapped = false;
    return m;
  }, []);

  const matCyan = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#00e5ff"),
      emissive: new THREE.Color("#00e5ff"),
      emissiveIntensity: 1.6,
      roughness: 0.4,
      metalness: 0.0,
      opacity: 0.9,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    m.depthWrite = false;
    m.toneMapped = false;
    return m;
  }, []);

  const pinkRef = useRef();
  const cyanRef = useRef();
  const tmp = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      quat: new THREE.Quaternion(),
      scl: new THREE.Vector3(),
      mat: new THREE.Matrix4(),
    }),
    []
  );

  useEffect(() => {
    if (!pinkRef.current || !cyanRef.current) return;
    const total = Math.max(1, count);
    const half = Math.floor(total / 2);
    const rand = (i) => {
      const x = Math.sin(i * 127.1 + seed * 13.7) * 43758.5453123;
      return x - Math.floor(x);
    };
    const place = (mesh, startIndex, n) => {
      for (let i = 0; i < n; i++) {
        const j = startIndex + i;
        const rx = (rand(j) * 2 - 1) * spread;
        const ry = (rand(j + 1) * 2 - 1) * spread;
        const rz = (rand(j + 2) * 2 - 1) * spread;
        tmp.pos.set(rx, ry, rz);
        tmp.quat.set(0, 0, 0, 1);
        const s = radius * (0.6 + rand(j + 3) * 0.8);
        tmp.scl.set(s, s, s);
        tmp.mat.compose(tmp.pos, tmp.quat, tmp.scl);
        mesh.setMatrixAt(i, tmp.mat);
      }
      mesh.instanceMatrix.needsUpdate = true;
    };
    place(pinkRef.current, 0, half);
    place(cyanRef.current, half, total - half);
  }, [count, spread, radius, seed]);

  const pinkCount = Math.max(1, Math.floor(count / 2));
  const cyanCount = Math.max(1, count - pinkCount);

  return (
    <group position={position} rotation={rotation}>
      <instancedMesh
        ref={pinkRef}
        args={[baseGeometry, matPink, pinkCount]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={cyanRef}
        args={[baseGeometry, matCyan, cyanCount]}
        frustumCulled={false}
      />
    </group>
  );
}
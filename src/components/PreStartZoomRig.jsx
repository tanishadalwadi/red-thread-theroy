import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { usePlay } from "../contexts/Play";

// Pre-start camera rig that animates a smooth zoom into the brain,
// then hands off to the game by toggling play.
export default function PreStartZoomRig() {
  const { setPlay, play } = usePlay();
  const cameraRef = useRef();
  const [isZooming, setIsZooming] = useState(false);

  // Animation tuning
  const duration = 1.8; // seconds
  const startZ = 12;
  const endZ = 1.2;
  const startFov = 55;
  const endFov = 30;

  const stateRef = useRef({ t: 0 });
  // No global overlay/fade; keep transition direct and cinematic via camera only

  useEffect(() => {
    const onStart = () => setIsZooming(true);
    window.addEventListener("prestart-zoom", onStart);
    return () => window.removeEventListener("prestart-zoom", onStart);
  }, []);

  const easeInCubic = (t) => t * t * t;

  useFrame((_, delta) => {
    const cam = cameraRef.current;
    if (!cam || !isZooming) return;

    // Advance normalized timeline
    const s = stateRef.current;
    s.t = Math.min(1, s.t + delta / duration);

    // Eased progress for smoother start and slight acceleration toward end
    const eased = easeInCubic(s.t);

    // Move camera forward and narrow the FOV for a deeper zoom feel
    cam.position.z = THREE.MathUtils.lerp(startZ, endZ, eased);
    cam.fov = THREE.MathUtils.lerp(startFov, endFov, eased);
    cam.updateProjectionMatrix();

    // No black fade overlay; rely on camera motion only for a direct handoff

    if (s.t >= 1) {
      setIsZooming(false);
      // Enter the game view
      setPlay(true);
      // Direct transition: no overlay fade-out signaling
    }
  });

  return (
    <group>
      {/* Dedicated landing camera; becomes non-default once game starts */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault={!play}
        position={[0, 0, startZ]}
        fov={startFov}
      />
    </group>
  );
}
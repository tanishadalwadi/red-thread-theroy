// top-level imports
import { Environment, Sphere, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Gradient, LayerMaterial, Noise } from "lamina";
import { useRef } from "react";
import * as THREE from "three";

export const Background = ({ backgroundColors }) => {
  const start = 0.2;
  const end = -0.5;

  const gradientRef = useRef();
  const gradientEnvRef = useRef();
  const nebulaSphereRef = useRef();
  const envSphereRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Subtle rotation for parallax-like motion
    if (nebulaSphereRef.current) {
      nebulaSphereRef.current.rotation.y += 0.0003;
      nebulaSphereRef.current.rotation.z += 0.0001;
    }
    if (envSphereRef.current) {
      envSphereRef.current.rotation.y += 0.0002;
      envSphereRef.current.rotation.x += 0.0001;
    }

    // Keep gradients in a slightly lighter blue palette
    if (gradientRef.current) {
      gradientRef.current.start = start + Math.sin(t * 0.05) * 0.05;
      gradientRef.current.end = end + Math.cos(t * 0.05) * 0.05;
      const a = "#0d2a5b"; // lighter navy
      const b = "#0b3470"; // softer blue
      gradientRef.current.colorA = new THREE.Color(a);
      gradientRef.current.colorB = new THREE.Color(b);
    }
    if (gradientEnvRef.current) {
      gradientEnvRef.current.start = start + Math.sin(t * 0.05 + Math.PI / 3) * 0.05;
      gradientEnvRef.current.end = end + Math.cos(t * 0.05 + Math.PI / 3) * 0.05;
      const a = "#0d2a5b";
      const b = "#0b3470";
      gradientEnvRef.current.colorA = new THREE.Color(a);
      gradientEnvRef.current.colorB = new THREE.Color(b);
    }
  });

  return (
    <>
      {/* Starfield */}
      <Stars
        radius={180}
        depth={50}
        count={12000}
        factor={1.4}
        saturation={0}
        fade
        speed={0.1}
      />

      {/* Nebula shell */}
      <Sphere ref={nebulaSphereRef} scale={[500, 500, 500]} rotation-y={Math.PI / 2}>
        <LayerMaterial color={"#0a2248"} side={THREE.BackSide}>
          <Noise
            type="perlin"
            scale={1.6}
            colorA={"#0d2a5b"}
            colorB={"#0b3470"}
            mode={"softlight"}
          />
          <Gradient ref={gradientRef} axes={"y"} start={start} end={end} />
        </LayerMaterial>
      </Sphere>

      {/* Environment for subtle reflections */}
      <Environment resolution={256} frames={Infinity}>
        <Sphere
          ref={envSphereRef}
          scale={[100, 100, 100]}
          rotation-y={Math.PI / 2}
          rotation-x={Math.PI}
        >
          <LayerMaterial color={"#0a2248"} side={THREE.BackSide}>
            <Noise
              type="perlin"
              scale={1.8}
              colorA={"#0d2a5b"}
              colorB={"#0b3470"}
              mode={"softlight"}
            />
            <Gradient ref={gradientEnvRef} axes={"y"} start={start} end={end} />
          </LayerMaterial>
        </Sphere>
      </Environment>
    </>
  );
}

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GlowBall({ position = [0, 0, 0], size = 0.32, color = "#7dd3fc", active = false }) {
  const haloRef = useRef();
  const coreMatRef = useRef();
  const maskRef = useRef();
  const rimRef = useRef();

  const rimMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        rimColor: { value: new THREE.Color(color) },
        rimPower: { value: 2.5 },
        rimIntensity: { value: 1.2 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        uniform vec3 rimColor;
        uniform float rimPower;
        uniform float rimIntensity;
        void main() {
          float rim = 1.0 - max(0.0, dot(normalize(vNormal), normalize(vViewDir)));
          rim = pow(rim, rimPower);
          gl_FragColor = vec4(rimColor, rim * rimIntensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true,
      toneMapped: false,
    });
  }, [color]);

  useFrame((_, delta) => {
    const targetOpacity = active ? 0.35 : 0.18;
    if (haloRef.current) {
      const mat = haloRef.current.material;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 4);
      const base = size * 1.8;
      const targetScale = active ? base * 1.12 : base;
      const s = THREE.MathUtils.lerp(haloRef.current.scale.x, targetScale, delta * 3);
      haloRef.current.scale.set(s, s, s);
    }
    if (coreMatRef.current) {
      const targetEmissive = active ? 1.3 : 0.6;
      coreMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        coreMatRef.current.emissiveIntensity || 0.6,
        targetEmissive,
        delta * 6
      );
    }
    if (maskRef.current) {
      // Keep mask larger than core to hide seams within bead radius
      const target = size * 1.9;
      maskRef.current.scale.set(target, target, target);
    }
    if (rimRef.current) {
      const s = size * 1.06;
      rimRef.current.scale.set(s, s, s);
      // Pulse intensity slightly when active
      const u = rimMaterial.uniforms;
      const targetIntensity = active ? 1.6 : 1.0;
      u.rimIntensity.value = THREE.MathUtils.lerp(u.rimIntensity.value, targetIntensity, delta * 6);
    }
  });

  return (
    <group position={position}>
      {/* Invisible depth mask: writes depth, not color; forces underlying lines to be clipped */}
      <mesh ref={maskRef} renderOrder={-10}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          colorWrite={false}
          depthWrite={true}
          depthTest={true}
          stencilWrite={true}
          stencilFunc={THREE.AlwaysStencilFunc}
          stencilRef={1}
          stencilMask={0xff}
          stencilZPass={THREE.ReplaceStencilOp}
        />
      </mesh>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color={color}
          emissive={color}
          emissiveIntensity={active ? 1.2 : 0.6}
          roughness={0.2}
          metalness={0}
          depthWrite
          depthTest
        />
      </mesh>

      {/* Rim glow stroke */}
      <mesh ref={rimRef} renderOrder={9}>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={rimMaterial} attach="material" />
      </mesh>

      {/* Outer glow halo */}
      <mesh ref={haloRef} renderOrder={10}>
        <sphereGeometry args={[size * 1.8, 64, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.35 : 0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
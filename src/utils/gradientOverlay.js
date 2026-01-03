import * as THREE from "three";

// Applies a red-blue gradient overlay to MeshStandardMaterial via onBeforeCompile.
// The gradient blends based on surface normal Y, preserving existing textures/shading.
// strength in [0,1]: 0 = no effect, 1 = full overlay multiply.
export function gradientOnBeforeCompile({ colorA = "#EF4444", colorB = "#3B82F6", strength = 0.85 } = {}) {
  const a = new THREE.Color(colorA);
  const b = new THREE.Color(colorB);
  const s = strength;
  return (shader) => {
    shader.uniforms = shader.uniforms || {};
    shader.uniforms.gradColorA = { value: a };
    shader.uniforms.gradColorB = { value: b };
    shader.uniforms.gradStrength = { value: s };

    shader.fragmentShader = shader.fragmentShader
      .replace(
        `#include <common>`,
        `#include <common>
uniform vec3 gradColorA;
uniform vec3 gradColorB;
uniform float gradStrength;`
      )
      .replace(
        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        `vec3 baseDiffuse = diffuse;
// Gradient across sphere using surface normal Y
float t = clamp(0.5 * (normalize(vNormal).y + 1.0), 0.0, 1.0);
vec3 grad = mix(gradColorA, gradColorB, t);
// Blend by multiplying with baseDiffuse, controlled by strength
diffuse = mix(baseDiffuse, baseDiffuse * grad, gradStrength);
vec4 diffuseColor = vec4( diffuse, opacity );`
      );
  };
}
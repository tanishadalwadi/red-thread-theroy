import * as THREE from "three";

// Generate multiple winding lanes with explicit intersection points and final merge.
// - laneCount: number of lanes
// - laneOffset: lateral separation
// - junctionIndices: indices in base control points where all lanes intersect
// - mergeLastN: number of final control points that converge to the main path
export function makeWindingLanes(
  curvePoints,
  laneCount = 6,
  laneOffset = 46,
  junctionIndices = [2, 3, 5],
  mergeLastN = 2
) {
  const lanes = [];
  const center = (laneCount - 1) / 2;

  for (let i = 0; i < laneCount; i++) {
    const lateralBase = (i - center) * laneOffset;
    const points = curvePoints.map((p, idx, arr) => {
      // Force intersections: all lanes share exactly these control points
      if (junctionIndices.includes(idx)) {
        return new THREE.Vector3(p.x, p.y, p.z);
      }

      // Gradually merge the last N control points back to main path (lateral -> 0)
      let lateral = lateralBase;
      const lastIndex = arr.length - 1;
      const startMerge = Math.max(lastIndex - mergeLastN + 1, 0);
      if (idx >= startMerge) {
        const t = (idx - startMerge) / (lastIndex - startMerge || 1);
        lateral *= 1 - t; // fade out lateral offset
      }

      // Curvy sway along the path
      const zFactor = idx * 0.85 + i * 0.22;
      const sway = Math.sin(zFactor) * 36 + Math.cos(zFactor * 0.7) * 18;
      const yWave = Math.sin(zFactor * 0.55) * 8;
      return new THREE.Vector3(p.x + lateral + sway, p.y + yWave * 0.25, p.z);
    });
    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
    lanes.push(curve);
  }

  const junctionPositions = junctionIndices.map((idx) => curvePoints[idx]);
  const meta = { junctionPositions };
  return { lanes, meta };
}
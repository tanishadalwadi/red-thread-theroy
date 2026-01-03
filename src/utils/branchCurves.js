import * as THREE from "three";

// Rebuild branches to be super-curvy with visible dips and multiple junctions.
// We sample the main curve between tStart and tEnd, offset laterally with
// sinusoidal wobble, and add vertical undulations for dips.
export function makeBranchCurves(curvePoints) {
  const mainCurve = new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5);

  // Domain on the main curve where branches exist
  const tStart = 0.18;
  const tEnd = 0.85;

  // Multiple junction points along the main path where switching is allowed
  const junctionTs = [0.22, 0.38, 0.52, 0.68, 0.80];

  // Curviness parameters
  const sampleCount = 52; // more points => smoother super-curvy branches
  const baseOffset = 14; // keep branches close to the main
  const wiggleAmp = 24; // strong lateral wobble for super curvy look
  const yAmp = 12; // dips in Y
  const frequencyLeft = 5.0; // oscillation frequency
  const frequencyRight = 4.5; // slightly different freq to avoid perfect symmetry
  // Two additional paths with different offsets/frequencies to diversify look
  const baseOffset2 = 26; // slightly wider
  const wiggleAmp2 = 18;
  const yAmp2 = 10;
  const frequencyLeft2 = 3.8;
  const frequencyRight2 = 4.2;

  const leftPoints = [];
  const rightPoints = [];
  const left2Points = [];
  const right2Points = [];

  // Build t samples and ensure exact junction points are included
  const tSamples = [];
  for (let i = 0; i < sampleCount; i++) {
    tSamples.push(THREE.MathUtils.lerp(tStart, tEnd, i / (sampleCount - 1)));
  }
  const allTs = [...tSamples, ...junctionTs.filter((t) => t >= tStart && t <= tEnd)].sort((a, b) => a - b);

  const EPS = 1e-5;
  const uniqueTs = [];
  for (let i = 0; i < allTs.length; i++) {
    if (i === 0 || Math.abs(allTs[i] - allTs[i - 1]) > EPS) uniqueTs.push(allTs[i]);
  }

  uniqueTs.forEach((t) => {
    const u = (t - tStart) / (tEnd - tStart);
    const base = mainCurve.getPoint(t);
    const tangent = mainCurve.getTangent(t).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

    const isJunction = junctionTs.some((jt) => Math.abs(jt - t) < EPS * 10);

    // At junctions, force intersection: zero lateral offset and zero vertical dip
    const wobbleL = isJunction ? 0 : Math.sin(u * Math.PI * frequencyLeft) * wiggleAmp;
    const wobbleR = isJunction ? 0 : Math.cos(u * Math.PI * frequencyRight) * wiggleAmp;
    const yWaveL = isJunction ? 0 : Math.cos(u * Math.PI * 1.8) * yAmp;
    const yWaveR = isJunction ? 0 : Math.sin(u * Math.PI * 1.7) * yAmp * 0.9;

    const wobbleL2 = isJunction ? 0 : Math.sin(u * Math.PI * frequencyLeft2) * wiggleAmp2;
    const wobbleR2 = isJunction ? 0 : Math.cos(u * Math.PI * frequencyRight2) * wiggleAmp2;
    const yWaveL2 = isJunction ? 0 : Math.sin(u * Math.PI * 1.5) * yAmp2;
    const yWaveR2 = isJunction ? 0 : Math.cos(u * Math.PI * 1.6) * yAmp2 * 0.95;

    const left = base
      .clone()
      .add(normal.clone().multiplyScalar(baseOffset + wobbleL))
      .add(new THREE.Vector3(0, yWaveL, 0));
    const right = base
      .clone()
      .add(normal.clone().multiplyScalar(-(baseOffset + wobbleR)))
      .add(new THREE.Vector3(0, yWaveR, 0));

    const left2 = base
      .clone()
      .add(normal.clone().multiplyScalar(baseOffset2 + wobbleL2))
      .add(new THREE.Vector3(0, yWaveL2, 0));
    const right2 = base
      .clone()
      .add(normal.clone().multiplyScalar(-(baseOffset2 + wobbleR2)))
      .add(new THREE.Vector3(0, yWaveR2, 0));

    // If junction, explicitly push the exact base point to guarantee intersection
    if (isJunction) {
      leftPoints.push(base.clone());
      rightPoints.push(base.clone());
      left2Points.push(base.clone());
      right2Points.push(base.clone());
    } else {
      leftPoints.push(left);
      rightPoints.push(right);
      left2Points.push(left2);
      right2Points.push(right2);
    }
  });

  const leftCurve = new THREE.CatmullRomCurve3(leftPoints, false, "catmullrom", 0.5);
  const rightCurve = new THREE.CatmullRomCurve3(rightPoints, false, "catmullrom", 0.5);
  const leftCurve2 = new THREE.CatmullRomCurve3(left2Points, false, "catmullrom", 0.5);
  const rightCurve2 = new THREE.CatmullRomCurve3(right2Points, false, "catmullrom", 0.5);

  const meta = {
    // Allow switching near any of these main-curve parameters
    junctionTs,
    // Merge back to main near the end
    mergeTMain: 0.92,
    // to map between main t and branch u
    tStart,
    tEnd,
  };

  return { leftCurve, rightCurve, leftCurve2, rightCurve2, meta };
}
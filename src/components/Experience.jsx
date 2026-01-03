// imports at top of file
import { Float, PerspectiveCamera } from "@react-three/drei";
import RadialGlowBurst from "./RadialGlowBurst";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Euler, Group, Vector3 } from "three";
import { usePlay } from "../contexts/Play";
import { fadeOnBeforeCompile } from "../utils/fadeMaterial";
// Shader chunk compatibility for three@0.150 with libs expecting newer chunks
if (
  !THREE.ShaderChunk.colorspace_fragment &&
  THREE.ShaderChunk.encodings_fragment
) {
  THREE.ShaderChunk.colorspace_fragment = THREE.ShaderChunk.encodings_fragment;
}
if (
  !THREE.ShaderChunk.colorspace_pars_fragment &&
  THREE.ShaderChunk.encodings_pars_fragment
) {
  THREE.ShaderChunk.colorspace_pars_fragment =
    THREE.ShaderChunk.encodings_pars_fragment;
}
import { Airplane } from "./Airplane";
// Background disabled for solid color scene
import { Cloud } from "./Cloud";
import { Speed } from "./Speed";
import { TextSection } from "./TextSection";
import VideoGrid from "./VideoGrid";
import { HandControls } from "./HandControls";
import PortalItem from "./PortalItem";
import GlobalAudio from "./GlobalAudio";
import GlowBall from "./GlowBall";
import KeyItem from "./KeyItem";
// (Portals removed)
// Quiz overlay disabled for now
import JunctionOverlay from "./JunctionOverlay";
// import QuizOverlay from "./QuizOverlay";
import { makeBranchCurves } from "../utils/branchCurves";

const LINE_NB_POINTS = 1000;
const PATH_Y_OFFSET = -1.2; // raise path closer to airplane
const CURVE_DISTANCE = 50;
  const CURVE_AHEAD_CAMERA = 0.008;
  const CURVE_AHEAD_AIRPLANE = 0.02;
  const AIRPLANE_MAX_ANGLE = 35;
  const AIRPLANE_Y_EXTRA = 0.6; // raise robot further to avoid clipping into path
  const FRICTION_DISTANCE = 42;
  const JUNCTION_STOP_OFFSET = 0.03; // stop slightly before junction for clearer visibility
  const JUNCTION_LOCK_DISTANCE = 3.0; // only lock when within ~3 units of junction

export const Experience = () => {
  const curvePoints = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
      new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
    ],
    []
  );

  const sceneOpacity = useRef(0);
  const lineMaterialRef = useRef();

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5);
  }, []);

  // Branch paths that diverge near point 2 and merge near point 4
  // Create left/right branches and merge metadata
  const { leftCurve, rightCurve, leftCurve2, rightCurve2, meta } = useMemo(
    () => makeBranchCurves(curvePoints),
    [curvePoints]
  );
  const activeCurveRef = useRef(curve);
  const [currentPathId, setCurrentPathId] = useState("main");
  const nearJunctionRef = useRef(false);
  const mergingRef = useRef(false);
  // Lock movement when entering a junction until a direction is chosen
  const junctionLockRef = useRef(false);
  // Unified decision state: true while paused at an intersection awaiting choice
  const awaitingDecisionRef = useRef(false);
  const enteredJunctionRef = useRef(false);
  const junctionStopTRef = useRef(null);
  const [junctionOverlayPos, setJunctionOverlayPos] = useState(null);
  // Cooldown to avoid immediate re-locking after a user makes a junction choice
  const recentUnlockAtRef = useRef(0);
  // Suppress lock/clamp until passing a specific t after a choice
  const lockSuppressUntilTRef = useRef(null);

  const textSections = useMemo(() => {
    return [
      {
        cameraRailDist: -1,
        position: new Vector3(
          curvePoints[1].x - 3,
          curvePoints[1].y,
          curvePoints[1].z
        ),
        subtitle: `Welcome to Red Thread Theory,
Have a seat and enjoy the ride!`,
      },
      {
        cameraRailDist: 1.5,
        position: new Vector3(
          curvePoints[2].x + 2,
          curvePoints[2].y,
          curvePoints[2].z
        ),
        title: "Services",
        subtitle: `Do you want a drink?
We have a wide range of beverages!`,
      },
      {
        cameraRailDist: -1,
        position: new Vector3(
          curvePoints[3].x - 3,
          curvePoints[3].y,
          curvePoints[3].z
        ),
        title: "Fear of flying?",
        subtitle: `Our flight attendants will help you have a great journey`,
      },
      {
        cameraRailDist: 1.5,
        position: new Vector3(
          curvePoints[4].x + 3.5,
          curvePoints[4].y,
          curvePoints[4].z - 12
        ),
        title: "Movies",
        subtitle: `We provide a large selection of medias, we highly recommend you Porco Rosso during the flight`,
      },
    ];
  }, []);

  const videoSources = useMemo(
    () => [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    ],
    []
  );

  const clouds = useMemo(
    () => [
      // STARTING (all path-adjacent spheres removed)
      // FIRST POINT
      // Removed one that sat too close to the path at first point
      {
        scale: new Vector3(1.2, 1.2, 1.2),
        position: new Vector3(
          curvePoints[1].x - 20,
          curvePoints[1].y + 4,
          curvePoints[1].z + 28
        ),
        rotation: new Euler(0, Math.PI / 7, 0),
      },
      {
        rotation: new Euler(0, Math.PI / 7, Math.PI / 5),
        scale: new Vector3(2.5, 2.5, 2.5),
        position: new Vector3(
          curvePoints[1].x - 13,
          curvePoints[1].y + 4,
          curvePoints[1].z - 62
        ),
      },
      {
        rotation: new Euler(Math.PI / 2, Math.PI / 2, Math.PI / 3),
        scale: new Vector3(2.5, 2.5, 2.5),
        position: new Vector3(
          curvePoints[1].x + 54,
          curvePoints[1].y + 2,
          curvePoints[1].z - 82
        ),
      },
      {
        // Moved right and farther from the main path to avoid blocking
        scale: new Vector3(1.5, 1.5, 1.5),
        position: new Vector3(
          curvePoints[1].x + 60,
          curvePoints[1].y - 8,
          curvePoints[1].z - 80
        ),
        rotation: new Euler(0, Math.PI / 5, 0),
      },
      // SECOND POINT
      {
        scale: new Vector3(1.5, 1.5, 1.5),
        position: new Vector3(
          curvePoints[2].x + 6,
          curvePoints[2].y - 7,
          curvePoints[2].z + 50
        ),
      },
      {
        scale: new Vector3(1, 1, 1),
        position: new Vector3(
          curvePoints[2].x - 2,
          curvePoints[2].y + 4,
          curvePoints[2].z - 26
        ),
      },
      {
        scale: new Vector3(2, 2, 2),
        position: new Vector3(
          curvePoints[2].x + 12,
          curvePoints[2].y + 1,
          curvePoints[2].z - 86
        ),
        rotation: new Euler(Math.PI / 4, 0, Math.PI / 3),
      },
      // THIRD POINT
      {
        scale: new Vector3(1.5, 1.5, 1.5),
        position: new Vector3(
          curvePoints[3].x + 3,
          curvePoints[3].y - 10,
          curvePoints[3].z + 50
        ),
      },
      {
        scale: new Vector3(1.5, 1.5, 1.5),
        position: new Vector3(
          curvePoints[3].x - 10,
          curvePoints[3].y,
          curvePoints[3].z + 30
        ),
        rotation: new Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new Vector3(2, 2, 2),
        position: new Vector3(
          curvePoints[3].x - 20,
          curvePoints[3].y - 5,
          curvePoints[3].z - 8
        ),
        rotation: new Euler(Math.PI, 0, Math.PI / 5),
      },
      {
        scale: new Vector3(2.5, 2.5, 2.5),
        position: new Vector3(
          curvePoints[3].x + 0,
          curvePoints[3].y - 5,
          curvePoints[3].z - 98
        ),
        rotation: new Euler(0, Math.PI / 3, 0),
      },
      // FOURTH POINT
      {
        scale: new Vector3(1, 1, 1),
        position: new Vector3(
          curvePoints[4].x + 3,
          curvePoints[4].y - 10,
          curvePoints[4].z + 2
        ),
      },
      {
        scale: new Vector3(1.5, 1.5, 1.5),
        position: new Vector3(
          curvePoints[4].x + 24,
          curvePoints[4].y - 6,
          curvePoints[4].z - 42
        ),
        rotation: new Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new Vector3(1.5, 1.5, 1.5),
        position: new Vector3(
          curvePoints[4].x - 4,
          curvePoints[4].y + 9,
          curvePoints[4].z - 62
        ),
        rotation: new Euler(Math.PI / 3, 0, Math.PI / 3),
      },
      // FINAL
      {
        scale: new Vector3(1.5, 1.5, 1.5),
        position: new Vector3(
          curvePoints[7].x + 12,
          curvePoints[7].y - 5,
          curvePoints[7].z + 60
        ),
        rotation: new Euler(-Math.PI / 4, -Math.PI / 6, 0),
      },
      {
        scale: new Vector3(1.5, 1.5, 1.5),
        position: new Vector3(
          curvePoints[7].x - 12,
          curvePoints[7].y + 5,
          curvePoints[7].z + 120
        ),
        rotation: new Euler(Math.PI / 4, Math.PI / 6, 0),
      },
      // EXTRA FILL CLOUDS
      // Starter area extras (removed to keep the main path clear)
      // Around first point
      // Removed right-side sphere near start (kept path clear)
      {
        scale: new Vector3(1.25, 1.25, 1.25),
        position: new Vector3(
          curvePoints[1].x - 28,
          curvePoints[1].y + 3,
          curvePoints[1].z - 10
        ),
        rotation: new Euler(0, -Math.PI / 5, Math.PI / 6),
      },
      // Around second point
      {
        scale: new Vector3(1.5, 1.5, 1.5),
        position: new Vector3(
          curvePoints[2].x - 14,
          curvePoints[2].y - 5,
          curvePoints[2].z - 60
        ),
        rotation: new Euler(Math.PI / 8, Math.PI / 9, 0),
      },
      // Around third point
      {
        scale: new Vector3(1.25, 1.25, 1.25),
        position: new Vector3(
          curvePoints[3].x + 12,
          curvePoints[3].y - 7,
          curvePoints[3].z - 30
        ),
        rotation: new Euler(-Math.PI / 9, Math.PI / 4, 0),
      },
      {
        scale: new Vector3(1.75, 1.75, 1.75),
        position: new Vector3(
          curvePoints[3].x - 26,
          curvePoints[3].y + 2,
          curvePoints[3].z + 6
        ),
        rotation: new Euler(Math.PI / 5, 0, Math.PI / 6),
      },
      // Around fourth point
      {
        scale: new Vector3(1.5, 1.5, 1.5),
        position: new Vector3(
          curvePoints[4].x + 14,
          curvePoints[4].y - 8,
          curvePoints[4].z - 22
        ),
        rotation: new Euler(0, Math.PI / 3, Math.PI / 8),
      },
      {
        scale: new Vector3(1, 1, 1),
        position: new Vector3(
          curvePoints[4].x - 10,
          curvePoints[4].y + 6,
          curvePoints[4].z - 2
        ),
        rotation: new Euler(Math.PI / 7, -Math.PI / 6, 0),
      },
      // Final stretch
      {
        scale: new Vector3(1.5, 1.5, 1.5),
        position: new Vector3(
          curvePoints[7].x + 6,
          curvePoints[7].y - 4,
          curvePoints[7].z + 90
        ),
        rotation: new Euler(-Math.PI / 6, Math.PI / 8, 0),
      },
      {
        scale: new Vector3(1.25, 1.25, 1.25),
        position: new Vector3(
          curvePoints[7].x - 6,
          curvePoints[7].y + 2,
          curvePoints[7].z + 140
        ),
        rotation: new Euler(Math.PI / 9, -Math.PI / 7, 0),
      },
    ],
    []
  );

  // Procedurally scatter cloud instances across the scene, away from the path
  const autoClouds = useMemo(() => {
    const arr = [];
    if (!curve || typeof curve.getPoint !== "function") return arr;

    // Sample the curve to build bounds and a nearest-distance check
    const samples = [];
    const sampleCount = 120;
    let minX = Infinity,
      maxX = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity;
    for (let i = 0; i <= sampleCount; i++) {
      const t = i / sampleCount;
      const p = curve.getPoint(t);
      samples.push(p);
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.z < minZ) minZ = p.z;
      if (p.z > maxZ) maxZ = p.z;
    }

    // Expand bounds to fill the whole scene around the path
    const margin = 40;
    minX -= margin;
    maxX += margin;
    minZ -= margin;
    maxZ += margin;
    const minY = -8;
    const maxY = 8;

    const desiredCount = 1400; // slightly reduce density
    const safeDist = 20.0; // push spheres farther from path and each other
    for (let i = 0; i < desiredCount; i++) {
      let pos = null;
      // Try a few times to find a position far enough from the path
      for (let attempt = 0; attempt < 30; attempt++) {
        const x = THREE.MathUtils.randFloat(minX, maxX);
        const y = THREE.MathUtils.randFloat(minY, maxY);
        const z = THREE.MathUtils.randFloat(minZ, maxZ);
        const candidate = new Vector3(x, y, z);
        let minDist = Infinity;
        // Fast early exit when inside the unsafe radius
        for (let k = 0; k < samples.length; k++) {
          const d = candidate.distanceTo(samples[k]);
          if (d < minDist) minDist = d;
          if (minDist < safeDist) break;
        }
        if (minDist > safeDist) {
          pos = candidate;
          break;
        }
      }
      if (!pos) continue;

      const s = THREE.MathUtils.randFloat(0.3, 0.6); // super small per-instance scale
      arr.push({
        position: pos,
        scale: new Vector3(s, s, s),
        rotation: new Euler(
          THREE.MathUtils.randFloatSpread(Math.PI),
          THREE.MathUtils.randFloatSpread(Math.PI),
          THREE.MathUtils.randFloatSpread(Math.PI)
        ),
        // Unified look: gradient handled in Cloud material; no per-instance tint
      });
    }
    return arr;
  }, [curve]);

  // Sample the main path to help filter any clouds that sit on or too close to it
  const pathSamples = useMemo(() => {
    if (!curve || typeof curve.getPoint !== "function") return [];
    const samples = [];
    const sampleCount = 120;
    for (let i = 0; i <= sampleCount; i++) {
      const t = i / sampleCount;
      samples.push(curve.getPoint(t));
    }
    return samples;
  }, [curve]);

  // Combine manual and procedural clouds, and filter out any too close to the path
  const renderClouds = useMemo(() => {
    const arr = [...clouds, ...autoClouds];
    const renderSafeDist = 18.0;
    if (!pathSamples.length) return arr;
    return arr.filter((cloud) => {
      const pos = cloud.position instanceof Vector3
        ? cloud.position
        : new Vector3(cloud.position[0], cloud.position[1], cloud.position[2]);
      let minDist = Infinity;
      for (let k = 0; k < pathSamples.length; k++) {
        const d = pos.distanceTo(pathSamples[k]);
        if (d < minDist) minDist = d;
        if (minDist < renderSafeDist) break;
      }
      return minDist >= renderSafeDist;
    });
  }, [clouds, autoClouds, pathSamples]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const cameraRail = useRef();
  const camera = useRef();
  const lastScroll = useRef(0);
  const progress = useRef(0);
  const inputDirection = useRef(0); // keyboard: 1 forward, -1 backward, 0 idle
  const gestureDirection = useRef(0); // gesture: 1 forward, -1 backward, 0 idle
  const movementDirRef = useRef(0); // stable ref for Speed

  // (Removed) Any zoom-in intro belongs to the landing scene, not the game view.

  // Jump state
  const isJumpingRef = useRef(false);
  const jumpTimeRef = useRef(0);
  const jumpDuration = 0.8; // seconds
  const jumpHeight = 1.2; // units up

  // Collected keys
  const [collectedKeys, setCollectedKeys] = useState(() => new Set());
  // Radial glow burst trigger state when the correct key is grabbed
  const [glowBurst, setGlowBurst] = useState(null);

  // Precompute key placements (world and local positions), and yaw to align with curve
  const keyDefs = useMemo(() => {
    const mk = (id, curveRef, t, label, color) => {
      const p = curveRef.getPoint(t);
      // Sit directly on the path with a minimal hover offset
      const hover = 0.2;
      const world = p.clone().add(new Vector3(0, PATH_Y_OFFSET + hover, 0));
      const local = [p.x, p.y + hover, p.z];
      const tangent = curveRef.getTangent(t);
      const yaw = Math.atan2(tangent.x, tangent.z);
      return { id, world, local, yaw, label, color };
    };
    const arr = [];
    // Correct key on LEFT branch
    arr.push(mk("key-main-1", leftCurve, 0.35, "Left", "#facc15"));
    // Wrong key on MAIN path
    arr.push(mk("key-main-wrong-1", curve, 0.58, "Main", "#facc15"));
    // Wrong key on RIGHT branch
    arr.push(mk("key-right-1", rightCurve, 0.45, "Right", "#facc15"));
    return arr;
  }, [curve, leftCurve, rightCurve2, leftCurve2]);

  // Marker position for main key capture (for a yellow stroke indicator)
  const mainKeyPosition = useMemo(() => {
    const def = keyDefs.find((k) => k.id === "key-main-1");
    return def ? def.local : null;
  }, [keyDefs]);

  // Left-branch portal placement (appears only after the correct key is collected)
  const leftPortal = useMemo(() => {
    const t = 1.0; // end of the left branch
    const p = leftCurve.getPoint(t);
    const hover = 0.25;
    const local = [p.x, p.y + hover, p.z];
    const tangent = leftCurve.getTangent(t);
    const yaw = Math.atan2(tangent.x, tangent.z);
    const world = p.clone().add(new Vector3(0, PATH_Y_OFFSET + hover, 0));
    return { local, yaw, world };
  }, [leftCurve]);

  // Right-branch portal placement (unused for portal flow; kept for future)
  const rightPortal = useMemo(() => {
    const t = 1.0; // end of the branch path
    const p = rightCurve.getPoint(t);
    const hover = 0.25;
    const local = [p.x, p.y + hover, p.z];
    const tangent = rightCurve.getTangent(t);
    const yaw = Math.atan2(tangent.x, tangent.z);
    const world = p.clone().add(new Vector3(0, PATH_Y_OFFSET + hover, 0));
    return { local, yaw, world };
  }, [rightCurve]);

  const { play, hasScroll, setHasScroll, end, setEnd, cameraEnabled, inMemory, setInMemory, controlMode } = usePlay();
  const smoothedDirRef = useRef(0);
  // Gesture-mode speed multiplier to smooth acceleration near junctions and after turns
  const gestureSpeedMulRef = useRef(1);

  useFrame((_state, delta) => {
    const curveRef = activeCurveRef.current || curve;
    const isMain = currentPathId === "main";
    const junctionParamsRaw = meta.junctionTs ?? [meta.junctionT];
    const junctionParams = isMain
      ? junctionParamsRaw
      : junctionParamsRaw.map((t) =>
          THREE.MathUtils.clamp(
            (t - (meta.tStart ?? 0)) /
              ((meta.tEnd ?? 1) - (meta.tStart ?? 0) || 1),
            0,
            1
          )
        );
    if (window.innerWidth > window.innerHeight) {
      // LANDSCAPE
      camera.current.fov = 30;
      camera.current.position.z = 5;
    } else {
      // PORTRAIT
      camera.current.fov = 80;
      camera.current.position.z = 2;
    }
    // Ensure projection matrix is updated when FOV changes
    camera.current.updateProjectionMatrix();
    // If user starts moving, mark as scrolled for overlay behavior
    if (lastScroll.current <= 0 && progress.current > 0) {
      setHasScroll(true);
    }

    if (play && !end && sceneOpacity.current < 1) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        1,
        delta * 0.1
      );
    }

    if (end && sceneOpacity.current > 0) {
      sceneOpacity.current = THREE.MathUtils.lerp(
        sceneOpacity.current,
        0,
        delta
      );
    }

    lineMaterialRef.current.opacity = sceneOpacity.current;

    if (end) {
      return;
    }
    // Keyboard/gesture-controlled progress, emulate scroll 0..1
    // Lower speeds to restore smoothness; unify smoothing across modes
    const speedPerSecond = controlMode === "keys" ? 0.026 : 0.018;
    const rawDir =
      cameraEnabled && junctionLockRef.current
        ? 0
        : (!hasScroll
            ? 0
            : (gestureDirection.current !== 0
                ? gestureDirection.current
                : inputDirection.current));
    // Smooth direction changes using exponential damping (frame-rate independent)
    const dirAlpha = 1 - Math.exp(-(controlMode === "keys" ? 8 : 1.5) * delta);
    smoothedDirRef.current = THREE.MathUtils.lerp(
      smoothedDirRef.current,
      rawDir,
      dirAlpha
    );
    // Apply gesture-only speed smoothing: slow slightly near junctions and ramp after choices
    let effectiveSpeed = speedPerSecond;
    if (controlMode !== "keys") {
      // Default target multiplier
      let targetMul = 1.0;
      // If an upcoming junction exists, reduce speed as we get close
      // Variables nextParam, lockDist, distToJunction are computed below
      // We will apply the last computed values when available
      // Note: when no upcoming junction, ramp back to 1 smoothly
      if (typeof window.__distToJunction === "number" && typeof window.__lockDist === "number") {
        const slowNear = THREE.MathUtils.clamp(window.__distToJunction / window.__lockDist, 0.6, 1.0);
        targetMul = Math.min(targetMul, slowNear);
      }
      // After a junction decision, briefly damp speed to avoid sudden surge
      if (Date.now() - recentUnlockAtRef.current < 800) {
        targetMul = Math.min(targetMul, 0.75);
      }
      // Smoothly approach the target multiplier using exponential damping
      const mulAlpha = 1 - Math.exp(-2 * delta);
      gestureSpeedMulRef.current = THREE.MathUtils.lerp(
        gestureSpeedMulRef.current,
        targetMul,
        mulAlpha
      );
      effectiveSpeed *= gestureSpeedMulRef.current;
    }
    progress.current += smoothedDirRef.current * effectiveSpeed * delta;
    // If on any path, clamp forward progress to stop before the upcoming junction
    // Uses hoisted junctionParams (mapped for branches)
      // Find next upcoming junction param relative to current progress on the active curve
      let nextParam = null;
      let nextIdx = -1;
      for (let i = 0; i < junctionParams.length; i++) {
        if (junctionParams[i] >= progress.current) {
          nextParam = junctionParams[i];
          nextIdx = i;
          break;
        }
      }
      // If there is an upcoming junction ahead, apply stop (hand gesture mode only)
      if (nextParam != null) {
        const isLastJunction = nextIdx === junctionParams.length - 1;
        const localStopOffset = JUNCTION_STOP_OFFSET + (isLastJunction ? 0.01 : 0);
        const stopParam = Math.max(0, Math.min(1, nextParam - localStopOffset));
        const movingForward =
          gestureDirection.current > 0 || inputDirection.current > 0;
        const jp = curveRef.getPoint(nextParam);
        const posNow = curveRef.getPoint(Math.min(Math.max(progress.current, 0), 1));
        const lockDist = JUNCTION_LOCK_DISTANCE * (isLastJunction ? 1.3 : 1.0);
        const distToJunction = posNow.distanceTo(jp);
        // Expose for gesture speed smoothing above in this frame
        window.__lockDist = lockDist;
        window.__distToJunction = distToJunction;
      // Hand gesture mode: do not hard-pause at junctions; allow continuous motion
      // Choices (left/right) can still be made via gestures when near a junction
      if (cameraEnabled) {
        const justUnlocked = Date.now() - recentUnlockAtRef.current < 1200;
        const suppressUntilT = lockSuppressUntilTRef.current;
        const suppressedByT = suppressUntilT != null && progress.current < suppressUntilT;
        if (justUnlocked || suppressedByT) {
          console.log("[Experience] skip re-lock due to recent unlock", {
            sinceMs: Date.now() - recentUnlockAtRef.current,
            suppressUntilT,
            progress: progress.current,
          });
        }
        // No junctionLock engagement here to avoid pausing in hand mode
      }
      }
    progress.current = Math.min(Math.max(progress.current, 0), 1);
    let scrollOffset = Math.max(0, progress.current);
    if (cameraEnabled) {
      const suppressUntilT = lockSuppressUntilTRef.current;
      const suppressedByT =
        suppressUntilT != null && progress.current < suppressUntilT;
      if (
        junctionLockRef.current &&
        junctionStopTRef.current != null &&
        !suppressedByT
      ) {
        scrollOffset = Math.min(scrollOffset, junctionStopTRef.current);
        console.log("[Experience] clamp scrollOffset due to lock", {
          scrollOffset,
          stopT: junctionStopTRef.current,
        });
      }
    }

    let friction = 1;
    let resetCameraRail = true;
    // LOOK TO CLOSE TEXT SECTIONS
    textSections.forEach((textSection) => {
      const distance = textSection.position.distanceTo(
        cameraGroup.current.position
      );

      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
        const targetCameraRailPosition = new Vector3(
          (1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
          0,
          0
        );
        const railAlphaNear = 1 - Math.exp(-6 * delta);
        cameraRail.current.position.lerp(targetCameraRailPosition, railAlphaNear);
        resetCameraRail = false;
      }
    });
    if (resetCameraRail) {
      const targetCameraRailPosition = new Vector3(0, 0, 0);
      const railAlphaReset = 1 - Math.exp(-6 * delta);
      cameraRail.current.position.lerp(targetCameraRailPosition, railAlphaReset);
    }

    // CALCULATE LERPED SCROLL OFFSET
    // If no movement input, stop instantly (no smoothing)
    const currentDir = controlMode === "keys" ? smoothedDirRef.current : rawDir;
    let lerpedScrollOffset;
    if (currentDir === 0) {
      lerpedScrollOffset = scrollOffset;
    } else {
      const scrollAlpha = 1 - Math.exp(-3 * delta * friction);
      lerpedScrollOffset = THREE.MathUtils.lerp(
        lastScroll.current,
        scrollOffset,
        scrollAlpha
      );
    }
    // PROTECT BELOW 0 AND ABOVE 1
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

    lastScroll.current = lerpedScrollOffset;
    tl.current.seek(lerpedScrollOffset * tl.current.duration());

    const curPoint = curveRef.getPoint(lerpedScrollOffset);

    // Follow the curve points
    // Slow camera follow for stability
    const camPosAlpha = 1 - Math.exp(-10 * delta);
    cameraGroup.current.position.lerp(curPoint, camPosAlpha);

    // Handle jump arc on airplane
    if (isJumpingRef.current) {
      jumpTimeRef.current += delta;
      const t = Math.min(jumpTimeRef.current / jumpDuration, 1);
      const y = Math.sin(t * Math.PI) * jumpHeight;
      airplane.current.position.y = PATH_Y_OFFSET + 0.02 + AIRPLANE_Y_EXTRA + y;
      if (t >= 1) {
        isJumpingRef.current = false;
        jumpTimeRef.current = 0;
        airplane.current.position.y = PATH_Y_OFFSET + 0.02 + AIRPLANE_Y_EXTRA;
      }
    }

    // Make the group look ahead on the curve

    const lookAtPoint = curveRef.getPoint(
      Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
    );

    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );
    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize();

    const lookAlpha = 1 - Math.exp(-10 * delta);
    const lookAt = currentLookAt.lerp(targetLookAt, lookAlpha);
    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    );

    // Airplane rotation

    const tangent = curveRef.getTangent(
      lerpedScrollOffset + CURVE_AHEAD_AIRPLANE
    );

    const nonLerpLookAt = new Group();
    nonLerpLookAt.position.copy(curPoint);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));

    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLerpLookAt.rotation.y
    );

    let angle = Math.atan2(-tangent.z, tangent.x);
    angle = -Math.PI / 2 + angle;

    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.4; // stronger angle

    // LIMIT PLANE ANGLE
    if (angleDegrees < 0) {
      angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
    }
    if (angleDegrees > 0) {
      angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
    }

    // SET BACK ANGLE
    angle = (angleDegrees * Math.PI) / 180;

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle
      )
    );
    const quatAlpha = 1 - Math.exp(-6 * delta);
    airplane.current.quaternion.slerp(targetAirplaneQuaternion, quatAlpha);

    // Detect proximity to any junction point on the active path and engage junction lock once per approach
      const minDist = junctionParams
        .map((p) => curveRef.getPoint(p))
        .reduce(
          (acc, pos) => Math.min(acc, pos.distanceTo(cameraGroup.current.position)),
          Infinity
        );
      const isNear = minDist < 16;

      if (isNear) {
        nearJunctionRef.current = true;

        if (!enteredJunctionRef.current && cameraEnabled) {
          // Respect suppression and recent unlock to avoid immediate re-lock loops
          const justUnlocked = Date.now() - recentUnlockAtRef.current < 1200;
          const suppressUntilT = lockSuppressUntilTRef.current;
          const suppressedByT =
            suppressUntilT != null && progress.current < suppressUntilT;

          if (justUnlocked || suppressedByT) {
            console.log("[Experience] skip proximity re-lock", {
              sinceMs: Date.now() - recentUnlockAtRef.current,
              suppressUntilT,
              progress: progress.current,
            });
          } else {
            // In hand gesture mode, mark proximity but do not lock or hard-pause
            enteredJunctionRef.current = true;
            const jp = curveRef.getPoint(junctionParams[0]);
            setJunctionOverlayPos(new Vector3(jp.x, jp.y + PATH_Y_OFFSET + 1.0, jp.z));
            console.log("[Experience] near junction (gesture mode); continuous motion enabled");
            awaitingDecisionRef.current = false;
          }
        }
      } else {
        // Not near a junction on the active path
        nearJunctionRef.current = false;
        if (!junctionLockRef.current) {
          // reset approach flag when leaving the junction and not locked
          enteredJunctionRef.current = false;
          setJunctionOverlayPos(null);
        }
      }

    // Do not force merge back to main; let user finish the active path
    // Reset any previous merge state if progress moves away from end
    if (mergingRef.current && lerpedScrollOffset < 0.95) {
      mergingRef.current = false;
    }

    // Detect portal entry when the MAIN key is collected
    if (cameraGroup.current) {
      const playerPos = cameraGroup.current.getWorldPosition(new Vector3());
      let targetPortal = null;
      // Portal only opens on LEFT path after collecting the correct key
      if (collectedKeys.has("key-main-1")) {
        targetPortal = leftPortal;
      }
      if (targetPortal) {
        const distPortal = playerPos.distanceTo(targetPortal.world);
        if (distPortal < 1.25) {
          // Signal overlay to show activation UI; do not auto-enter
          window.dispatchEvent(new CustomEvent("portal-ready", { detail: { world: targetPortal.world } }));
          return;
        } else {
          // Hide activation UI when moving away
          window.dispatchEvent(new Event("portal-not-ready"));
        }
      }
    }

    // End-of-path behavior
    // - If on LEFT branch with the correct key, do NOT restart (portal handles flow).
    // - If on other branch paths, restart to main path at the beginning.
    // - If on main path, restart to the beginning (no portal on main).
    if (lerpedScrollOffset >= 0.995 && !mergingRef.current) {
      if (currentPathId !== "main") {
        const isLeftBranch = currentPathId.startsWith("branch-left");
        const hasCorrectKey = collectedKeys.has("key-main-1");
        if (isLeftBranch && hasCorrectKey) {
          // Do nothing; portal flow will take over
        } else {
          // Restart: switch to main path and reset progress to the start
          setCurrentPathId("main");
          activeCurveRef.current = curve;
          progress.current = 0;
          lastScroll.current = 0;
          window.dispatchEvent(new Event("branch-ended-restart"));
        }
      } else {
        // Always restart when main path ends (no portal on main)
        setCurrentPathId("main");
        activeCurveRef.current = curve;
        progress.current = 0;
        lastScroll.current = 0;
        window.dispatchEvent(new Event("branch-ended-restart"));
      }
    }

    // Key collection detection by proximity (no jump required)
    if (cameraGroup.current) {
      const playerPos = cameraGroup.current.getWorldPosition(new Vector3());
      keyDefs.forEach((k) => {
        if (collectedKeys.has(k.id)) return;
        const dist = playerPos.distanceTo(k.world);
        const threshold = 1.5; // reasonable pass-through radius
        if (dist < threshold) {
          setCollectedKeys((prev) => new Set([...prev, k.id]));
          // Notify overlay for confirmation
          window.dispatchEvent(
            new CustomEvent("key-collected", { detail: { id: k.id } })
          );
          // Trigger radial glow burst at the grabbed key position only for the correct key
          if (k.id === "key-main-1") {
            setGlowBurst({ pos: k.local, at: Date.now() });
          }
          // In hand gesture mode, immediately restart from MAIN path if a wrong key was collected
          if (controlMode !== "keys" && k.id !== "key-main-1") {
            setCurrentPathId("main");
            activeCurveRef.current = curve;
            progress.current = 0;
            lastScroll.current = 0;
            window.dispatchEvent(new Event("branch-ended-restart"));
          }
        }
      });
    }
  });

  const airplane = useRef();

  const tl = useRef();
  const backgroundColors = useRef({
    colorA: "#3535cc",
    colorB: "#abaadd",
  });

  const planeInTl = useRef();
  const planeOutTl = useRef();

  useLayoutEffect(() => {
    tl.current = gsap.timeline();

    tl.current.to(backgroundColors.current, {
      duration: 1.2,
      colorA: "#6f35cc",
      colorB: "#ffad30",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1.2,
      colorA: "#424242",
      colorB: "#ffcc00",
    });
    tl.current.to(backgroundColors.current, {
      duration: 1.2,
      colorA: "#81318b",
      colorB: "#55ab8f",
    });

    tl.current.pause();

    planeInTl.current = gsap.timeline();
    planeInTl.current.pause();
    planeInTl.current.from(airplane.current.position, {
      duration: 3,
      z: 5,
      y: -2,
    });

    planeOutTl.current = gsap.timeline();
    planeOutTl.current.pause();

    planeOutTl.current.to(
      airplane.current.position,
      {
        duration: 10,
        z: -250,
        y: 10,
      },
      0
    );
    // Avoid animating cameraRail via GSAP; it conflicts with per-frame updates
    planeOutTl.current.to(airplane.current.position, {
      duration: 1,
      z: -1000,
    });
  }, []);

  useEffect(() => {
    if (play) {
      planeInTl.current.play();
    }
  }, [play]);

  // Keyboard controls: W/S forward/backward, A/D choose left/right at any junction
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = (e.key || "").toLowerCase();
      if (key === "w" || key === "arrowup") {
        // If locked at a junction, treat forward as "stay on current path" and unlock
        if (junctionLockRef.current) {
          junctionLockRef.current = false; // resume movement on current path
          enteredJunctionRef.current = false;
          junctionStopTRef.current = null;
          window.dispatchEvent(new CustomEvent("junction-lock", { detail: false }));
        }
        inputDirection.current = 1;
        movementDirRef.current = 1;
        setHasScroll(true);
      } else if (key === "s" || key === "arrowdown") {
        inputDirection.current = -1;
        movementDirRef.current = -1;
        setHasScroll(true);
      } else if (key === " " || e.code === "Space" || key === "spacebar" || key === "space") {
        // Space to jump
        if (!isJumpingRef.current) {
          isJumpingRef.current = true;
          jumpTimeRef.current = 0;
        }
      } else if (key === "a" || key === "arrowleft") {
        // In gesture mode, require proximity; in keys mode, allow anywhere
        if (cameraEnabled && !nearJunctionRef.current) return;
        // Choose the primary left branch for clarity
        const nextId = "branch-left";
        const nextCurve = leftCurve;
        setCurrentPathId(nextId);
        activeCurveRef.current = nextCurve;
        // Map current position to closest junction t on main, then into branch u
        const params = meta.junctionTs ?? [meta.junctionT];
        let closestT = params[0];
        let best = Infinity;
        params.forEach((t) => {
          const d = curve.getPoint(t).distanceTo(cameraGroup.current.position);
          if (d < best) {
            best = d;
            closestT = t;
          }
        });
        const u = meta.tStart != null && meta.tEnd != null
          ? THREE.MathUtils.clamp(
              (closestT - meta.tStart) / (meta.tEnd - meta.tStart),
              0,
              1
            )
          : 0.02;
        progress.current = u;
        lastScroll.current = u;
        junctionLockRef.current = false; // unlock after choosing a path
        awaitingDecisionRef.current = false;
        enteredJunctionRef.current = false;
        junctionStopTRef.current = null;
        window.dispatchEvent(new CustomEvent("junction-lock", { detail: false }));
        console.log("[Experience] decision applied (LEFT); movement resumed");
        // Inform overlay of the confirmed LEFT choice
        window.dispatchEvent(
          new CustomEvent("junction-choice-confirm", { detail: { choice: "left" } })
        );
      } else if (key === "d" || key === "arrowright") {
        // In gesture mode, require proximity; in keys mode, allow anywhere
        if (cameraEnabled && !nearJunctionRef.current) return;
        // Choose the primary right branch for clarity
        const nextId = "branch-right";
        const nextCurve = rightCurve;
        setCurrentPathId(nextId);
        activeCurveRef.current = nextCurve;
        const params = meta.junctionTs ?? [meta.junctionT];
        let closestT = params[0];
        let best = Infinity;
        params.forEach((t) => {
          const d = curve.getPoint(t).distanceTo(cameraGroup.current.position);
          if (d < best) {
            best = d;
            closestT = t;
          }
        });
        const u = meta.tStart != null && meta.tEnd != null
          ? THREE.MathUtils.clamp(
              (closestT - meta.tStart) / (meta.tEnd - meta.tStart),
              0,
              1
            )
          : 0.02;
        progress.current = u;
        lastScroll.current = u;
        junctionLockRef.current = false; // unlock after choosing a path
        awaitingDecisionRef.current = false;
        enteredJunctionRef.current = false;
        junctionStopTRef.current = null;
        window.dispatchEvent(new CustomEvent("junction-lock", { detail: false }));
        console.log("[Experience] decision applied (RIGHT); movement resumed");
        // Inform overlay of the confirmed RIGHT choice
        window.dispatchEvent(
          new CustomEvent("junction-choice-confirm", { detail: { choice: "right" } })
        );
      } else if (key === "q") {
        if (!nearJunctionRef.current) return;
        if (currentPathId === "branch-left-2") return;
        setCurrentPathId("branch-left-2");
        activeCurveRef.current = leftCurve2;
        const params = meta.junctionTs ?? [meta.junctionT];
        let closestT = params[0];
        let best = Infinity;
        params.forEach((t) => {
          const d = curve.getPoint(t).distanceTo(cameraGroup.current.position);
          if (d < best) {
            best = d;
            closestT = t;
          }
        });
        const u = meta.tStart != null && meta.tEnd != null
          ? THREE.MathUtils.clamp(
              (closestT - meta.tStart) / (meta.tEnd - meta.tStart),
              0,
              1
            )
          : 0.02;
        progress.current = u;
        lastScroll.current = u;
        junctionLockRef.current = false; // unlock after choosing a path
        awaitingDecisionRef.current = false;
        enteredJunctionRef.current = false;
        junctionStopTRef.current = null;
        window.dispatchEvent(new CustomEvent("junction-lock", { detail: false }));
        // Confirm LEFT choice (alternate branch)
        window.dispatchEvent(
          new CustomEvent("junction-choice-confirm", { detail: { choice: "left" } })
        );
      } else if (key === "e") {
        if (!nearJunctionRef.current) return;
        if (currentPathId === "branch-right-2") return;
        setCurrentPathId("branch-right-2");
        activeCurveRef.current = rightCurve2;
        const params = meta.junctionTs ?? [meta.junctionT];
        let closestT = params[0];
        let best = Infinity;
        params.forEach((t) => {
          const d = curve.getPoint(t).distanceTo(cameraGroup.current.position);
          if (d < best) {
            best = d;
            closestT = t;
          }
        });
        const u = meta.tStart != null && meta.tEnd != null
          ? THREE.MathUtils.clamp(
              (closestT - meta.tStart) / (meta.tEnd - meta.tStart),
              0,
              1
            )
          : 0.02;
        progress.current = u;
        lastScroll.current = u;
        junctionLockRef.current = false; // unlock after choosing a path
        awaitingDecisionRef.current = false;
        enteredJunctionRef.current = false;
        junctionStopTRef.current = null;
        window.dispatchEvent(new CustomEvent("junction-lock", { detail: false }));
        // Confirm RIGHT choice (alternate branch)
        window.dispatchEvent(
          new CustomEvent("junction-choice-confirm", { detail: { choice: "right" } })
        );
      }
    };
    const onKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === "w" || key === "arrowup") {
        if (inputDirection.current === 1) {
          inputDirection.current = 0;
          movementDirRef.current = 0;
        }
      } else if (key === "s" || key === "arrowdown") {
        if (inputDirection.current === -1) {
          inputDirection.current = 0;
          movementDirRef.current = 0;
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [setHasScroll]);

  

  // Handle thumb gesture choice events to unlock and select path
  useEffect(() => {
    const onJunctionChoose = (e) => {
      const choice = (e.detail || "").toLowerCase();
      console.log("[Experience] onJunctionChoose", { choice });
      // Accept junction choices anywhere to match keyboard behavior
      if (choice === "left") {
        // Choose the primary left branch (no cycling) for clarity
        const nextId = "branch-left";
        const nextCurve = leftCurve;
        console.log("[Experience] choosing LEFT", { from: currentPathId, to: nextId });
        setCurrentPathId(nextId);
        activeCurveRef.current = nextCurve;
        const params = meta.junctionTs ?? [meta.junctionT];
        let closestT = params[0];
        let best = Infinity;
        params.forEach((t) => {
          const d = curve.getPoint(t).distanceTo(cameraGroup.current.position);
          if (d < best) {
            best = d;
            closestT = t;
          }
        });
        const u = meta.tStart != null && meta.tEnd != null
          ? THREE.MathUtils.clamp(
              (closestT - meta.tStart) / (meta.tEnd - meta.tStart),
              0,
              1
            )
          : 0.02;
        console.log("[Experience] mapped main t -> branch u", { u });
        progress.current = u;
        lastScroll.current = u;
        junctionLockRef.current = false;
        awaitingDecisionRef.current = false;
        enteredJunctionRef.current = false;
        junctionStopTRef.current = null;
        window.dispatchEvent(new CustomEvent("junction-lock", { detail: false }));
        console.log("[Experience] decision applied (LEFT, gesture); awaiting explicit input to resume");
        // Do not auto-resume; require explicit gesture or key to move
        if (cameraEnabled) {
          gestureDirection.current = 0;
          inputDirection.current = 0;
        }
        // Inform overlay of the confirmed LEFT choice
        window.dispatchEvent(
          new CustomEvent("junction-choice-confirm", { detail: { choice: "left" } })
        );
      } else if (choice === "right") {
        // Choose the primary right branch (no cycling) for clarity
        const nextId = "branch-right";
        const nextCurve = rightCurve;
        console.log("[Experience] choosing RIGHT", { from: currentPathId, to: nextId });
        setCurrentPathId(nextId);
        activeCurveRef.current = nextCurve;
        const params = meta.junctionTs ?? [meta.junctionT];
        let closestT = params[0];
        let best = Infinity;
        params.forEach((t) => {
          const d = curve.getPoint(t).distanceTo(cameraGroup.current.position);
          if (d < best) {
            best = d;
            closestT = t;
          }
        });
        const u = meta.tStart != null && meta.tEnd != null
          ? THREE.MathUtils.clamp(
              (closestT - meta.tStart) / (meta.tEnd - meta.tStart),
              0,
              1
            )
          : 0.02;
        console.log("[Experience] mapped main t -> branch u", { u });
        progress.current = u;
        lastScroll.current = u;
        junctionLockRef.current = false;
        awaitingDecisionRef.current = false;
        enteredJunctionRef.current = false;
        junctionStopTRef.current = null;
        window.dispatchEvent(new CustomEvent("junction-lock", { detail: false }));
        console.log("[Experience] decision applied (RIGHT, gesture); awaiting explicit input to resume");
        if (cameraEnabled) {
          gestureDirection.current = 0;
          inputDirection.current = 0;
        }
        // Inform overlay of the confirmed RIGHT choice
        window.dispatchEvent(
          new CustomEvent("junction-choice-confirm", { detail: { choice: "right" } })
        );
      } else if (choice === "stay" || choice === "up") {
        console.log("[Experience] choosing STAY; unlock and continue");
        // Compute nearest junction point on current path and nudge past it
        const params = meta.junctionTs ?? [meta.junctionT];
        let closestT = params[0];
        let best = Infinity;
        params.forEach((t) => {
          const d = curve.getPoint(t).distanceTo(cameraGroup.current.position);
          if (d < best) {
            best = d;
            closestT = t;
          }
        });
        const nudge = 0.02; // small step past junction to avoid re-lock
        const afterT = THREE.MathUtils.clamp(closestT + nudge, 0, 1);
        progress.current = afterT;
        lastScroll.current = afterT;
        // Suppress re-lock only just past this junction
        lockSuppressUntilTRef.current = THREE.MathUtils.clamp(closestT + 0.08, 0, 1);
        // Reset approach flag; suppression handles avoiding re-lock
        enteredJunctionRef.current = false;
        awaitingDecisionRef.current = false;
        junctionLockRef.current = false;
        junctionStopTRef.current = null;
        recentUnlockAtRef.current = Date.now();
        window.dispatchEvent(new CustomEvent("junction-lock", { detail: false }));
        console.log("[Experience] decision applied (STAY, gesture); movement resumed");
        if (cameraEnabled) {
          gestureDirection.current = 1;
          inputDirection.current = 0;
        }
        // Inform overlay of the confirmed choice
        window.dispatchEvent(
          new CustomEvent("junction-choice-confirm", { detail: { choice: "stay" } })
        );
      }
    };
    window.addEventListener("junction-choose", onJunctionChoose);
    return () => window.removeEventListener("junction-choose", onJunctionChoose);
  }, [curve, meta, currentPathId]);


  // Handle overlay action: go back to main path at nearest junction
  useEffect(() => {
    const onGoBackMain = () => {
      setCurrentPathId("main");
      activeCurveRef.current = curve;
      const params = meta.junctionTs ?? [meta.junctionT];
      let closestT = params[0];
      let best = Infinity;
      params.forEach((t) => {
        const d = curve.getPoint(t).distanceTo(cameraGroup.current.position);
        if (d < best) {
          best = d;
          closestT = t;
        }
      });
      // Move the player to the closest junction point on the main path
      progress.current = closestT;
      lastScroll.current = closestT;
      // Inform overlay of switching back to MAIN path
      window.dispatchEvent(
        new CustomEvent("junction-choice-confirm", { detail: { choice: "main" } })
      );
    };
    window.addEventListener("go-back-main", onGoBackMain);
    return () => window.removeEventListener("go-back-main", onGoBackMain);
  }, [curve, meta]);

  // Junction overlay removed; lanes switch anywhere via keyboard

  return (
    <>
      <directionalLight position={[0, 3, 1]} intensity={0.1} />
      <group ref={cameraGroup}>
        <Speed directionRef={movementDirRef} />
        <group ref={cameraRail}>
          <PerspectiveCamera
            ref={camera}
            position={[0, 0, 5]}
            fov={30}
            near={0.5}
            far={300}
            makeDefault
          />
        </group>
        {/* HandControls gated by user camera consent */}
        {cameraEnabled && (
          <HandControls
            onGestureChange={(dir) => {
              gestureDirection.current = dir;
              movementDirRef.current = dir;
              if (dir !== 0) setHasScroll(true);
            }}
          />
        )}
        <group ref={airplane}>
          <Float floatIntensity={0.25} speed={1} rotationIntensity={0.25}>
          <Airplane
            rotation-y={Math.PI}
            scale={[0.65, 0.65, 0.65]}
            position-y={PATH_Y_OFFSET + 0.02 + AIRPLANE_Y_EXTRA}
          />
          </Float>
        </group>
      </group>

      {/* World-anchored JunctionOverlay removed to avoid duplicate dialogs; HUD overlay remains */}

      {/* Camera-anchored quiz overlay renders above; world-anchored overlay removed */}

      {/* VideoGrid temporarily disabled for quiz visibility
        {textSections.map((section, index) => (
          <VideoGrid
            key={index}
            position={section.position}
            gridSize={10}
            spacing={0.75}
            tileScale={0.7}
            rotateSpeed={0}
            pulseAmplitude={0}
            videoSrc={videoSources[index % videoSources.length]}
            shape={index === 0 ? "heart" : "rect"}
          />
        ))}
        */}

      {/* LINE */}
      <group position-y={PATH_Y_OFFSET}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial
            color={"#ff1744"}
            emissive={"#ff2e2eff"}
            emissiveIntensity={3.2}
            ref={lineMaterialRef}
            transparent
            envMapIntensity={1.0}
            onBeforeCompile={fadeOnBeforeCompile}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
            stencilWrite
            stencilFunc={THREE.NotEqualStencilFunc}
            stencilRef={1}
            stencilZPass={THREE.KeepStencilOp}
          />
        </mesh>
        {/* Main path */}
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial
            color={"#ff1744"}
            emissive={"#ff2e2eff"}
            emissiveIntensity={3.2}
            ref={lineMaterialRef}
            transparent
            envMapIntensity={1.0}
            onBeforeCompile={fadeOnBeforeCompile}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
            stencilWrite
            stencilFunc={THREE.NotEqualStencilFunc}
            stencilRef={1}
            stencilZPass={THREE.KeepStencilOp}
          />
        </mesh>
        {/* Left branch */}
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: leftCurve,
              },
            ]}
          />
          <meshStandardMaterial
            color={"#ff1744"}
            emissive={"#ff2e2eff"}
            emissiveIntensity={3.2}
            transparent
            envMapIntensity={1.0}
            onBeforeCompile={fadeOnBeforeCompile}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
            stencilWrite
            stencilFunc={THREE.NotEqualStencilFunc}
            stencilRef={1}
            stencilZPass={THREE.KeepStencilOp}
          />
        </mesh>
        {/* Right branch */}
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: rightCurve,
              },
            ]}
          />
          <meshStandardMaterial
            color={"#ff1744"}
            emissive={"#ff2e2eff"}
            emissiveIntensity={3.2}
            transparent
            envMapIntensity={1.0}
            onBeforeCompile={fadeOnBeforeCompile}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
            stencilWrite
            stencilFunc={THREE.NotEqualStencilFunc}
            stencilRef={1}
            stencilZPass={THREE.KeepStencilOp}
          />
        </mesh>

        {/* Left branch 2 */}
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: leftCurve2,
              },
            ]}
          />
          <meshStandardMaterial
            color={"#ff1744"}
            emissive={"#ff2e2eff"}
            emissiveIntensity={3.2}
            transparent
            envMapIntensity={1.0}
            onBeforeCompile={fadeOnBeforeCompile}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
            stencilWrite
            stencilFunc={THREE.NotEqualStencilFunc}
            stencilRef={1}
            stencilZPass={THREE.KeepStencilOp}
          />
        </mesh>

        {/* Right branch 2 */}
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: rightCurve2,
              },
            ]}
          />
          <meshStandardMaterial
            color={"#ff1744"}
            emissive={"#ff2e2eff"}
            emissiveIntensity={3.2}
            transparent
            envMapIntensity={1.0}
            onBeforeCompile={fadeOnBeforeCompile}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
            stencilWrite
            stencilFunc={THREE.NotEqualStencilFunc}
            stencilRef={1}
            stencilZPass={THREE.KeepStencilOp}
          />
        </mesh>

      {/* Keys placed along main and branch paths */}
      {keyDefs.map((k) => (
        <KeyItem
          key={k.id}
          position={k.local}
          yaw={k.yaw}
          color={k.color}
          label={k.label}
          collected={collectedKeys.has(k.id)}
          active={nearJunctionRef.current}
        />
      ))}

      {/* Radial glow burst appears briefly at the correct key position */}
      {glowBurst && (
        <RadialGlowBurst
          position={glowBurst.pos}
          duration={0.6}
          color="#facc15"
          onDone={() => setGlowBurst(null)}
        />
      )}

      {/* Yellow stroke indicator when the correct (MAIN) key is captured */}
      {collectedKeys.has("key-main-1") && mainKeyPosition && (
        <group position={mainKeyPosition} renderOrder={11}>
          <mesh rotation-x={Math.PI / 2}>
            <ringGeometry args={[0.35, 0.5, 64]} />
            <meshBasicMaterial
              color={"#facc15"}
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}

      {/* Portal appears only after collecting the correct key, on LEFT path */}
      {collectedKeys.has("key-main-1") ? (
        <PortalItem position={leftPortal.local} yaw={leftPortal.yaw} color="#f97316" scale={[3, 3, 3]} />
      ) : null}

        {/* Junction markers */}
        {(meta.junctionTs ?? [meta.junctionT]).map((t, idx) => (
          <GlowBall
            key={idx}
            position={[
              curve.getPoint(t).x,
              curve.getPoint(t).y + 0.2,
              curve.getPoint(t).z,
            ]}
            size={0.34}
            color="#ff1744"
            active={nearJunctionRef.current}
          />
        ))}
      </group>

      {/* CLOUDS (legacy placements plus procedurals) */}
      {renderClouds.map((cloud, index) => (
        <Cloud
          sceneOpacity={sceneOpacity}
          baseScale={0.3}
          tint="#2196f3"
          {...cloud}
          key={index}
        />
      ))}
    </>
  );
};

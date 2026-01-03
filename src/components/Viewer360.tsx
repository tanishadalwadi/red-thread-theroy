import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import ImageWithFallback from "./figma/ImageWithFallback";
import { RandomFace } from "./RandomFace";
import CountdownOverlay from "./CountdownOverlay.jsx";
import ConfettiBurst from "./ConfettiBurst";
import { useNavigate } from "react-router-dom";

type Viewer360Props = {
  photo?: string | null;
};

// Increased radius slightly to ensure tiles never cross the camera near-plane
// and never appear in front of the UI, while preserving layout/behavior.
const R = 560; // portal radius in px (slightly farther keeps tiles behind UI)
const PANEL_SIZE = 140; // tile size
const COLS = 20; // horizontal columns around cylinder
const ROWS = 10; // vertical rows
const GAP = 16; // gap between tiles
// Place threads slightly OUTSIDE the panel radius so they sit visually behind
const THREAD_R = R * 1.06;

const rand = (n: number) => Math.floor(Math.random() * n);

const Viewer360: React.FC<Viewer360Props> = ({ photo }) => {
  const rotY = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const idleAnimRef = useRef<any>(null);
  const idleResumeTimer = useRef<number | null>(null);
  // Removed interactive reveal; selfie displays automatically when loaded
  const [revealed] = useState(true);
  const [selfieLoaded, setSelfieLoaded] = useState(false);
  const [wrongAlertVisible, setWrongAlertVisible] = useState(false);
  // Remove per-frame React state updates tied to rotation to avoid flicker
  const [postCountdown, setPostCountdown] = useState<number | null>(null);
  const postTimerRef = useRef<number | null>(null);
  const countdownUntilRef = useRef<number | null>(null);
  const [confettiVisible, setConfettiVisible] = useState(false);
  // Avoid subscribing to rotY changes with React state; motion handles rotation smoothly
  const navigate = useNavigate();

  // Helpers to manage idle and gesture rotations without causing React re-renders
  const stopIdleRotation = () => {
    if (idleAnimRef.current) {
      try { idleAnimRef.current.stop(); } catch {}
      idleAnimRef.current = null;
    }
    if (idleResumeTimer.current) {
      try { window.clearTimeout(idleResumeTimer.current); } catch {}
      idleResumeTimer.current = null;
    }
  };
  const resumeIdleRotationLater = () => {
    idleResumeTimer.current = window.setTimeout(() => {
      idleAnimRef.current = animate(rotY, [rotY.get(), rotY.get() + 360], {
        duration: 80,
        repeat: Infinity,
        ease: "linear",
      });
    }, 1800);
  };
  // Start a robust 60s countdown immediately on portal entry
  useEffect(() => {
    if (postTimerRef.current || postCountdown != null) return;
    const start = 60;
    countdownUntilRef.current = Date.now() + start * 1000;
    setPostCountdown(start);
    try { console.log("Portal countdown: start", start); } catch {}
    const intervalId = window.setInterval(() => {
      const until = countdownUntilRef.current ?? Date.now();
      const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000));
      setPostCountdown(remaining);
      try { console.log("Portal countdown: tick", remaining); } catch {}
      if (remaining <= 0) {
        try { console.log("Portal countdown: navigate /end"); } catch {}
        window.clearInterval(intervalId);
        postTimerRef.current = null;
        navigate("/end");
      }
    }, 1000);
    postTimerRef.current = intervalId as unknown as number;
    return () => {
      if (postTimerRef.current) {
        window.clearInterval(postTimerRef.current);
        postTimerRef.current = null;
      }
    };
  }, [navigate]);

  // Auto-hide confetti after a short burst
  useEffect(() => {
    if (!confettiVisible) return;
    const t = window.setTimeout(() => setConfettiVisible(false), 2500);
    return () => window.clearTimeout(t);
  }, [confettiVisible]);
  useEffect(() => {
    if (!wrongAlertVisible) return;
    const t = window.setTimeout(() => setWrongAlertVisible(false), 1500);
    return () => window.clearTimeout(t);
  }, [wrongAlertVisible]);

  // (Optional) deterministic URLs if needed; currently panels use random Unsplash in render
  // const urls = useMemo(() => {
  //   return Array.from({ length: COLS * ROWS }).map((_, i) =>
  //     `https://images.unsplash.com/photo-${1000000000000 + i}?q=80&fm=jpg&w=${PANEL_SIZE}&h=${PANEL_SIZE}&fit=crop&crop=faces`
  //   );
  // }, []);

  // Handle navigation: smooth spring rotation
  useEffect(() => {
    const stopIdle = stopIdleRotation;
    const resumeIdleLater = resumeIdleRotationLater;

    const onKey = (e: KeyboardEvent) => {
      stopIdle();
      if (e.key === "ArrowLeft") {
        animate(rotY, rotY.get() - 18, { type: "spring", stiffness: 100, damping: 20 });
      } else if (e.key === "ArrowRight") {
        animate(rotY, rotY.get() + 18, { type: "spring", stiffness: 100, damping: 20 });
      }
      resumeIdleLater();
    };
    const onWheel = (e: WheelEvent) => {
      stopIdle();
      const delta = Math.sign(e.deltaY) * 12;
      animate(rotY, rotY.get() + delta, { type: "spring", stiffness: 120, damping: 24 });
      resumeIdleLater();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });

    // start idle drift on mount
    idleAnimRef.current = animate(rotY, [0, 360], { duration: 90, repeat: Infinity, ease: "linear" });
    return () => window.removeEventListener("keydown", onKey);
  }, [rotY]);

  // Removed point-gesture nudge for portal; only palm/fist control idle rotation

  // Remove extra particle visuals to strictly match Figma portal UI
  // (Gameplay logic unchanged; only visual styling of tiles is updated.)

  // Build panel transforms: spherical dome for an inside-sphere look
  const panels = useMemo(() => {
    const arr: Array<{ x: number; y: number; z: number; rotX: number; rotY: number; i: number }> = [];
    const phiMargin = (12 * Math.PI) / 180; // avoid poles; gentle top/bottom cutoff
    const rows: number = ROWS; // widen literal type to number to avoid TS literal comparison warnings
    for (let r = 0; r < ROWS; r++) {
      const v = rows === 1 ? 0.5 : r / (rows - 1); // 0..1
      const phi = phiMargin + v * (Math.PI - 2 * phiMargin); // polar angle
      for (let c = 0; c < COLS; c++) {
        const theta = (c / COLS) * Math.PI * 2; // azimuth
        const x = R * Math.sin(phi) * Math.cos(theta);
        const y = R * Math.cos(phi);
        const z = R * Math.sin(phi) * Math.sin(theta);
        const rotYdeg = (theta * 180) / Math.PI + 180; // face center
        const rotXdeg = ((phi - Math.PI / 2) * 180) / Math.PI; // follow curvature
        const i = r * COLS + c;
        arr.push({ x, y, z, rotX: rotXdeg, rotY: rotYdeg, i });
      }
    }
    return arr;
  }, []);

  // Build red threads as 8 spirals with 100 segments
  const threads = useMemo(() => {
    const spirals: Array<{ x: number; y: number; z: number; rotY: number; rotX: number; thick: number }[]> = [];
    const rotations = 3.5;
    for (let t = 0; t < 8; t++) {
      const offset = (t / 8) * Math.PI * 2;
      const segments: Array<{ x: number; y: number; z: number; rotY: number; rotX: number; thick: number }> = [];
      for (let s = 0; s < 100; s++) {
        const k = s / 99; // 0..1
        const theta = k * Math.PI - Math.PI / 2; // -pi/2..pi/2
        const phi = rotations * k * Math.PI * 2 + offset;
        const x = THREAD_R * Math.cos(theta) * Math.cos(phi);
        const y = THREAD_R * Math.sin(theta);
        const z = THREAD_R * Math.cos(theta) * Math.sin(phi);
        const rotYdeg = (-phi * 180) / Math.PI + 90;
        const rotXdeg = (theta * 180) / Math.PI;
        const thick = 10 + 4 * Math.sin(k * Math.PI * 2);
        segments.push({ x, y, z, rotY: rotYdeg, rotX: rotXdeg, thick });
      }
      spirals.push(segments);
    }
    return spirals;
  }, []);

  // Choose one random, always-visible tile for selfie overlay (non-tilted center row)
  const selfieIndices = useMemo(() => {
    if (!photo) return [] as number[];
    const midRow = Math.floor(ROWS / 2); // non-tilted row
    const centerCol = Math.floor(COLS / 2);
    const bandHalfWidth = 3; // limit to front-facing columns so tile is visible initially
    const startCol = Math.max(0, centerCol - bandHalfWidth);
    const endCol = Math.min(COLS - 1, centerCol + bandHalfWidth);
    const candidates: number[] = [];
    for (let c = startCol; c <= endCol; c++) {
      candidates.push(midRow * COLS + c);
    }
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    // eslint-disable-next-line no-console
    console.log("Viewer360: Selfie present, single random visible tile:", chosen);
    return [chosen];
  }, [photo]);

  useEffect(() => {
    if (photo) {
      // eslint-disable-next-line no-console
      console.log("Viewer360: Selfie URL received:", photo);
      // Reset loaded state on new photo and begin preloading for smoother reveal
      setSelfieLoaded(false);
      try {
        const img = new Image();
        img.decoding = "async" as any;
        img.onload = () => {
          try { console.log("Viewer360: Selfie preloaded"); } catch {}
          setSelfieLoaded(true);
        };
        img.onerror = () => {
          try { console.warn("Viewer360: Selfie preload failed"); } catch {}
        };
        img.src = photo;
      } catch {}
    } else {
      // eslint-disable-next-line no-console
      console.log("Viewer360: No selfie URL; using default faces only.");
      setSelfieLoaded(false);
    }
  }, [photo]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        perspective: 500,
        perspectiveOrigin: "50% 50%",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          rotateY: rotY,
          position: "relative",
        }}
      >
        {/* Threads removed to adhere to Figma portal visuals (tiles only) */}

        {/* Panels on inner sphere surface */}
        {panels.map((p) => {
          const isSelfieTile = !!photo && selfieIndices.includes(p.i);
          return (
          <div
            key={p.i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              marginLeft: `-${PANEL_SIZE / 2}px`,
              marginTop: `-${PANEL_SIZE / 2}px`,
              width: PANEL_SIZE,
              height: PANEL_SIZE,
              transform:
                `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateY(${p.rotY}deg) rotateX(${p.rotX}deg)`,
              // Figma Make portal tile visual styling
              boxShadow: "0 12px 24px rgba(0,0,0,0.35), 0 0 24px rgba(96,165,250,0.35)",
              overflow: "hidden",
              borderRadius: 14,
              willChange: "transform",
              opacity: 1,
              // Remove clicks entirely; tiles are view-only
              pointerEvents: "none",
            }}
          >
            {/* Base image: keep showing until selfie finishes loading to avoid black tile */}
            <div style={{ position: "absolute", inset: 0, display: isSelfieTile && selfieLoaded ? "none" : "block" }}>
              <RandomFace
                size={PANEL_SIZE}
                seed={p.i}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 14,
                  filter: "blur(1px) brightness(0.9) saturate(1.05)",
                }}
              />
              {/* Perimeter glow to match Figma colors */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 14,
                  boxShadow:
                    "inset 0 0 0 1px rgba(255,255,255,0.15), 0 0 22px rgba(96,165,250,0.35)",
                  pointerEvents: "none",
                }}
              />
              {/* Tile shine sweep */}
              <motion.div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-60%",
                  width: "40%",
                  height: "100%",
                  borderRadius: 14,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%)",
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
                animate={{ left: ["-60%", "140%"] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            {/* Selfie image rendered directly on the chosen tile; no interactivity */}
            {photo && selfieIndices.includes(p.i) && (
              <img
                src={photo || undefined}
                alt="Your selfie"
                decoding="async"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.98) saturate(1.05)",
                  transform: "rotateY(-15deg)",
                  transformOrigin: "50% 50%",
                  borderRadius: 14,
                  opacity: selfieLoaded ? 1 : 0,
                  transition: "opacity 240ms ease",
                }}
                onLoad={() => {
                  try { console.log("Viewer360: Selfie tile loaded:", p.i); } catch {}
                  setSelfieLoaded(true);
                }}
                onError={(e) => {
                  try { console.warn("Viewer360: Selfie tile failed to load:", p.i, e); } catch {}
                  setWrongAlertVisible(true);
                }}
              />
            )}
            {/* Remove clicks from non-selfie tiles to avoid confusion and missed clicks */}
            {/* Subtle vignette to enhance depth while matching Make UI */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6))",
                pointerEvents: "none",
              }}
            />
          </div>
        )})}

      </motion.div>
      {postCountdown != null && (
        <CountdownOverlay value={postCountdown} visible={true} />
      )}
      {/* Minimal viewer HUD */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.85)",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontWeight: 600 }}>Memory Dome Activated</div>
        <div style={{ fontSize: 14, opacity: 0.8 }}>Navigate through cosmic memories</div>
      </div>
      {/* Removed found-yourself dialog since selfie shows without click */}
      {wrongAlertVisible && (
        <div
          role="dialog"
          aria-label="Wrong tile"
          style={{
            position: "absolute",
            top: 64,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 4000,
            fontFamily: "Inter, sans-serif",
            color: "white",
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.25)",
            padding: "10px 16px",
            borderRadius: 12,
            boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
          }}
        >
          Try another
        </div>
      )}
      {/* Subtle vignette for natural focus */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.5) 95%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 22,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 12,
          alignItems: "center",
          fontFamily: "Inter, sans-serif",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        <button style={{
          padding: "8px 12px",
          borderRadius: 20,
          background: "rgba(99,102,241,0.25)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white",
        }}>◀ Left</button>
        <div style={{ opacity: 0.8 }}>Use arrow keys to look around</div>
        <button style={{
          padding: "8px 12px",
          borderRadius: 20,
          background: "rgba(99,102,241,0.25)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white",
        }}>Right ▶</button>
      </div>
      {confettiVisible && <ConfettiBurst visible={true} />}
    </div>
  );
};

export default Viewer360;
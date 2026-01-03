import { useEffect, useRef } from "react";

// Simple gesture detection:
// - Open hand (>=4 extended fingers) => forward (1)
// - Two fingers (index+middle) extended => backward (-1)
// - Closed fist (0 extended fingers) => stop (0)
export const HandControls = ({ onGestureChange }) => {
  const videoRef = useRef(null);
  const lastDirectionRef = useRef(0);
  const debounceRef = useRef({ dir: 0, since: 0 });
  const pointDebounceRef = useRef({ gesture: null, since: 0 });
  const scriptsLoadedRef = useRef(false);
  const suppressMovementRef = useRef(false);
  const upHoldRef = useRef({ active: false, since: 0 });
  const upConfirmedRef = useRef(false);
  const junctionLockedRef = useRef(false);
  const lockedSinceRef = useRef(0);
  const commitTimerRef = useRef(null);
  const pendingDirRef = useRef(0);
  const lastCommitAtRef = useRef(0);
  const pointConfirmRef = useRef({ choice: null, at: 0 });
  const decisionActiveRef = useRef(false);
  const decisionTriggeredRef = useRef(false);
  const rawBufferRef = useRef([]);

  useEffect(() => {
    const countExtendedFingers = (lm) => {
      if (!lm || lm.length < 21) return 0;
      const isExtended = (tip, pip) => lm[tip].y < lm[pip].y; // tip above pip
      const index = isExtended(8, 6);
      const middle = isExtended(12, 10);
      const ring = isExtended(16, 14);
      const pinky = isExtended(20, 18);
      return [index, middle, ring, pinky].filter(Boolean).length;
    };


    const classifyDirection = (lm) => {
      const count = countExtendedFingers(lm);
      const index = lm && lm[8] && lm[6] ? lm[8].y < lm[6].y : false;
      const middle = lm && lm[12] && lm[10] ? lm[12].y < lm[10].y : false;
      if (count >= 4) return 1; // open hand
      if (index && middle && count === 2) return -1; // two fingers
      if (count === 0) return 0; // fist
      return lastDirectionRef.current; // keep previous to avoid jitter
    };

    // Detect index-finger pointing direction (up/left/right/down) for junction choices
    // Based on MediaPipe Hands landmarks: use vector from index MCP (5) to tip (8)
    // and require other fingers (middle, ring, pinky) to be curled to reduce false positives.
    const detectPointGesture = (lm) => {
      if (!lm || lm.length < 21) return null;
      const isCurled = (tip, pip) => lm[tip].y > lm[pip].y;
      const othersCurled =
        isCurled(12, 10) && isCurled(16, 14) && isCurled(20, 18);
      const indexExtended = lm[8].y < lm[6].y;
      if (!indexExtended || !othersCurled) return null;
      const mcp = lm[5];
      const tip = lm[8];
      const dx = tip.x - mcp.x;
      const dy = tip.y - mcp.y;
      const thresh = 0.06; // slightly lower threshold for easier detection
      if (dy < -thresh) return "up"; // index pointing up
      if (dx > thresh) return "left"; // map to screen-left (no mirroring)
      if (dx < -thresh) return "right"; // map to screen-right (no mirroring)
      if (dy > thresh) return "down"; // index pointing down
      return null;
    };

    const onResults = (results) => {
      const lm = results.multiHandLandmarks?.[0];
      const dir = lm ? classifyDirection(lm) : 0;
      const now = performance.now();
      // Buffer raw directions and commit the mode to suppress jitter
      rawBufferRef.current.push(dir);
      if (rawBufferRef.current.length > 6) rawBufferRef.current.shift();
      const freq = { "-1": 0, "0": 0, "1": 0 };
      for (const d of rawBufferRef.current) freq[d] = (freq[d] || 0) + 1;
      const modeDir = freq[1] >= Math.max(freq[0], freq[-1])
        ? 1
        : freq[-1] >= Math.max(freq[0], freq[1])
        ? -1
        : 0;
      if (pendingDirRef.current !== modeDir) {
        pendingDirRef.current = modeDir;
        if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
        commitTimerRef.current = setTimeout(() => {
          const cooldownMs = 400;
          if (performance.now() - lastCommitAtRef.current < cooldownMs) return;
          if (lastDirectionRef.current !== pendingDirRef.current) {
            lastDirectionRef.current = pendingDirRef.current;
            lastCommitAtRef.current = performance.now();
            onGestureChange?.(lastDirectionRef.current);
          }
        }, 220);
      }
      // Detect index-finger pointing directional gestures and dispatch junction choice
      const point = lm ? detectPointGesture(lm) : null;
      if (pointDebounceRef.current.gesture !== point) {
        pointDebounceRef.current = { gesture: point, since: now };
      }
      // Immediate junction choice dispatch from point gestures; no lock or suppression
      const lastPointAt = pointConfirmRef.current.at || 0;
      const lastPointChoice = pointConfirmRef.current.choice;
      const pointCooldownMs = 700;
      const cooled = now - lastPointAt > pointCooldownMs || lastPointChoice !== point;
      if (point && (point === "left" || point === "right" || point === "up") && cooled) {
        pointConfirmRef.current = { choice: point, at: now };
        console.log("[HandControls] point gesture; dispatch", { choice: point });
        window.dispatchEvent(new CustomEvent("junction-choose", { detail: point }));
      }
    };

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        // prevent duplicate loads
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          existing.addEventListener("load", () => resolve());
          existing.addEventListener("error", (e) => reject(e));
          // If already loaded, resolve immediately
          if (existing.dataset.loaded === "true") return resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => {
          s.dataset.loaded = "true";
          resolve();
        };
        s.onerror = (e) => reject(e);
        document.head.appendChild(s);
      });

    let hands;
    let cam;
    // Create a fixed DOM video element outside the canvas to avoid renderer conflicts
    const createFixedPreview = () => {
      const v = document.createElement("video");
      v.setAttribute("playsinline", "");
      v.muted = true;
      v.autoplay = true;
      Object.assign(v.style, {
        position: "fixed",
        left: "16px",
        bottom: "16px",
        width: "220px",
        height: "140px",
        objectFit: "cover",
        transform: "scaleX(-1)", // mirror for natural feel
        border: "2px solid rgba(250, 204, 21, 0.85)", // yellow accent
        borderRadius: "8px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        background: "#000",
        opacity: "0.95",
        zIndex: "1200",
        pointerEvents: "none",
      });
      document.body.appendChild(v);
      videoRef.current = v;
      return v;
    };
    const setup = async () => {
      // ensure permissions and video element ready
      try {
        if (!scriptsLoadedRef.current) {
          // Load MediaPipe libraries from CDN as globals to avoid bundler issues
          await loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"
          );
          await loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
          );
          scriptsLoadedRef.current = true;
        }

        // Create and mount fixed preview element
        const v = createFixedPreview();

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await new Promise((res) => {
          videoRef.current.onloadedmetadata = () => res();
        });
        hands = new window.Hands({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.8,
          minTrackingConfidence: 0.75,
        });
        hands.onResults(onResults);

        cam = new window.Camera(videoRef.current, {
          onFrame: async () => {
            await hands.send({ image: videoRef.current });
          },
          width: 640,
          height: 480,
        });
        cam.start();
      } catch (e) {
        // If camera fails, do nothing; keyboard controls remain
        console.warn("HandControls: camera unavailable", e);
      }
    };
    setup();

    // Clear suppression and manage decision window after junction lock/unlock
    const onLock = (e) => {
      const locked = Boolean(e.detail);
      junctionLockedRef.current = locked;
      if (locked) {
        lockedSinceRef.current = performance.now();
        decisionActiveRef.current = true;
        decisionTriggeredRef.current = false;
        upConfirmedRef.current = false;
        console.log("[HandControls] junction locked; gesture listening enabled");
      } else {
        console.log("[HandControls] junction unlock received; reset hold/suppression");
        suppressMovementRef.current = false;
        upHoldRef.current = { active: false, since: 0 };
        upConfirmedRef.current = false;
        decisionActiveRef.current = false;
        decisionTriggeredRef.current = false;
        console.log("[HandControls] gesture listening disabled; movement resumes");
      }
    };
    window.addEventListener("junction-lock", onLock);

    return () => {
      try {
        cam?.stop();
        const tracks = videoRef.current?.srcObject?.getTracks?.() ?? [];
        tracks.forEach((t) => t.stop());
      } catch {}
      try {
        hands?.close();
      } catch {}
      // Remove the fixed preview element from the DOM
      try {
        const v = videoRef.current;
        if (v && v.parentNode) v.parentNode.removeChild(v);
      } catch {}
      try {
        if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
      } catch {}
      try {
        window.removeEventListener("junction-lock", onLock);
      } catch {}
    };
  }, [onGestureChange]);

  // No JSX children for R3F; preview is managed imperatively in the DOM
  return null;
};
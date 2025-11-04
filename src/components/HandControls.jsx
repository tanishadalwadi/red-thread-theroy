import { useEffect, useRef } from "react";
import { Html } from "@react-three/drei";
import { Camera } from "@mediapipe/camera_utils";

// Simple gesture detection:
// - Open hand (>=4 extended fingers) => forward (1)
// - Two fingers (index+middle) extended => backward (-1)
// - Closed fist (0 extended fingers) => stop (0)
export const HandControls = ({ onGestureChange }) => {
  const videoRef = useRef(null);
  const lastDirectionRef = useRef(0);
  const debounceRef = useRef({ dir: 0, since: 0 });
  const scriptsLoadedRef = useRef(false);

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

    const onResults = (results) => {
      const lm = results.multiHandLandmarks?.[0];
      const dir = lm ? classifyDirection(lm) : 0;
      const now = performance.now();
      // small debounce to reduce flicker
      if (debounceRef.current.dir !== dir) {
        debounceRef.current = { dir, since: now };
      }
      if (now - debounceRef.current.since > 120) {
        if (lastDirectionRef.current !== debounceRef.current.dir) {
          lastDirectionRef.current = debounceRef.current.dir;
          onGestureChange?.(lastDirectionRef.current);
        }
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
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.6,
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

    return () => {
      try {
        cam?.stop();
        const tracks = videoRef.current?.srcObject?.getTracks?.() ?? [];
        tracks.forEach((t) => t.stop());
      } catch {}
      try {
        hands?.close();
      } catch {}
    };
  }, [onGestureChange]);

  // Hidden video element for mediapipe input
  return (
    <Html>
      <video
        ref={videoRef}
        playsInline
        style={{ position: "fixed", right: 0, bottom: 0, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      />
    </Html>
  );
};
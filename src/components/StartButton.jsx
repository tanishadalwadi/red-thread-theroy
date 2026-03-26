import React, { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import { usePlay } from "../contexts/Play";

export default function StartButton() {
  const { setPlay, setCameraEnabled, controlMode } = usePlay();
  const [disabled, setDisabled] = useState(false);

  // Re-enable button if user navigates away and returns to landing
  useEffect(() => {
    const onReset = () => setDisabled(false);
    window.addEventListener("prestart-reset", onReset);
    return () => window.removeEventListener("prestart-reset", onReset);
  }, []);
  const handleStart = () => {
    if (disabled) return;
    setDisabled(true);

    if (controlMode === "hand") {
      const getUM = navigator.mediaDevices?.getUserMedia?.bind(navigator.mediaDevices);
      if (getUM) {
        getUM({ video: { facingMode: "user" }, audio: false })
          .then((stream) => {
            window.__gestureStream = stream;
            setCameraEnabled(true);
          })
          .catch(() => {
            setCameraEnabled(false);
          });
      } else {
        setCameraEnabled(false);
      }
    } else {
      setCameraEnabled(false);
    }

    window.dispatchEvent(new Event("audio-start"));
    window.dispatchEvent(new Event("prestart-zoom"));
  };

  return (
    <Html fullscreen>
      <div
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "-40vh",
          pointerEvents: "auto",
          zIndex: 10,
        }}
      >
        {/* Glassmorphism primary button to match site-wide Figma UI */}
        <button
          className="glass-btn glass-btn--primary"
          style={{ minWidth: "240px", opacity: disabled ? 0.7 : 1 }}
          onClick={handleStart}
          disabled={disabled}
        >
          Start
        </button>
      </div>
    </Html>
  );
}

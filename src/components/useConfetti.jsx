import { useState, useCallback, useEffect } from "react";
import ConfettiBurst from "./ConfettiBurst";

// Lightweight reusable confetti launcher hook.
// Provides a ConfettiLayer component and a launchConfetti() trigger.
export function useConfetti({ duration = 1.5, zIndex = 1800 } = {}) {
  const [on, setOn] = useState(false);
  const launchConfetti = useCallback(() => setOn(true), []);

  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setOn(false), duration * 1000);
    return () => clearTimeout(t);
  }, [on, duration]);

  const ConfettiLayer = () => (on ? <ConfettiBurst visible={true} duration={duration} zIndex={zIndex} /> : null);
  return { launchConfetti, ConfettiLayer };
}
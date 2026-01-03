import { useEffect, useRef } from "react";
import { usePlay } from "../contexts/Play";

export default function GlobalAudio({ src, volume = 0.6, loop = true }) {
  const { end, play } = usePlay();
  const audioRef = useRef(null);
  const startedRef = useRef(false);

  // Create and wire the HTMLAudio element
  useEffect(() => {
    const resolvedSrc = src?.startsWith("/") ? src : `/${src}`;
    const audio = new Audio(resolvedSrc);
    audio.loop = loop;
    audio.volume = volume;
    audio.preload = "auto";
    audioRef.current = audio;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      audio.play().catch((e) => {
        console.error("[GlobalAudio] play error:", e);
        startedRef.current = false;
      });
    };

    // Start when the Explore button fires the custom event
    window.addEventListener("audio-start", start);
    // Fallback: allow any user gesture to start if needed
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    window.addEventListener("touchstart", start, { once: true });

    return () => {
      window.removeEventListener("audio-start", start);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
      try {
        audio.pause();
      } catch {}
      audioRef.current = null;
    };
  }, [src, volume, loop]);

  // Keep volume/loop in sync with props
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = loop;
  }, [volume, loop]);

  // Pause when the experience ends; resume if play toggles back and audio had started
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (end) {
      try {
        audio.pause();
      } catch {}
    } else if (play && startedRef.current) {
      audio.play().catch(() => {});
    }
  }, [end, play]);

  return null;
}

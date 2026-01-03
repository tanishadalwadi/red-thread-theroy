import { useProgress } from "@react-three/drei";
import { usePlay } from "../contexts/Play";
import { useEffect, useState } from "react";
// Removed Mandala/Orb activation UI for direct portal entry
import { useConfetti } from "./useConfetti";

export const Overlay = () => {
  const { progress } = useProgress();
  const { play, end, setPlay, hasScroll, cameraEnabled, setCameraEnabled, modeChosen, setModeChosen, controlMode, setControlMode, setInMemory } =
    usePlay();
  const [keyNotice, setKeyNotice] = useState(null);
  const [junctionLocked, setJunctionLocked] = useState(false);
  const [choiceNotice, setChoiceNotice] = useState(null);
  const [portalReady, setPortalReady] = useState(false);
  const [orbPos, setOrbPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [orbDragging, setOrbDragging] = useState(false);
  const { launchConfetti, ConfettiLayer } = useConfetti({ duration: 1.5, zIndex: 1800 });

  // Show a transient dialog when a key is collected (always auto-hide)
  useEffect(() => {
    const handler = (e) => {
      const { id } = e.detail || {};
      setKeyNotice({ id, at: Date.now() });
      // Trigger confetti only for the correct key
      if (id === "key-main-1") {
        launchConfetti();
      }
      // Always auto-hide the key notice so it doesn't persist
      setTimeout(() => setKeyNotice(null), 2200);
    };
    window.addEventListener("key-collected", handler);
    return () => window.removeEventListener("key-collected", handler);
  }, [launchConfetti]);

  // Listen for junction lock state to show HUD overlay
  useEffect(() => {
    const onLock = (e) => {
      const locked = Boolean(e.detail);
      console.log("[Overlay] junction lock state", { locked });
      setJunctionLocked(locked);
    };
    window.addEventListener("junction-lock", onLock);
    return () => window.removeEventListener("junction-lock", onLock);
  }, []);

  // Portal activation readiness from Experience: auto-enter directly
  useEffect(() => {
    const onReady = () => {
      try {
        // Hide any previous overlay prompt and immediately enter the memory dome
        window.dispatchEvent(new Event("portal-not-ready"));
      } catch {}
      setPortalReady(false);
      setInMemory(true);
    };
    const onNotReady = () => setPortalReady(false);
    window.addEventListener("portal-ready", onReady);
    window.addEventListener("portal-not-ready", onNotReady);
    return () => {
      window.removeEventListener("portal-ready", onReady);
      window.removeEventListener("portal-not-ready", onNotReady);
    };
  }, [setInMemory]);

  // Keyboard activation when portal is ready
  useEffect(() => {
    const onKey = (e) => {
      if (!portalReady) return;
      if (e.key === " " || e.key === "Enter") {
        // Enter the memory dome
        try {
          const ev = new Event("portal-not-ready");
          window.dispatchEvent(ev);
        } catch {}
        setPortalReady(false);
        setInMemory(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [portalReady]);

  // Show a brief confirmation after a junction choice (e.g., stay on path)
  useEffect(() => {
    const onConfirm = (e) => {
      const { choice } = e.detail || {};
      if (!choice) return;
      console.log("[Overlay] show choice notice", { choice });
      setChoiceNotice({ choice, at: Date.now() });
      const to = setTimeout(() => {
        console.log("[Overlay] hide choice notice");
        setChoiceNotice(null);
      }, 1800);
      return () => clearTimeout(to);
    };
    window.addEventListener("junction-choice-confirm", onConfirm);
    return () => window.removeEventListener("junction-choice-confirm", onConfirm);
  }, []);

  // Removed transitional crossfade to keep page change instantaneous
  return (
    <div
      className={`overlay ${(play || modeChosen) && !junctionLocked ? "overlay--disable" : ""} ${(play || modeChosen) ? "overlay--no-dim" : ""}
    ${hasScroll ? "overlay--scrolled" : ""}`}
    >
      {/* Full-screen confetti layer (non-blocking, above portal, under modals) */}
      <ConfettiLayer />
      <div
        className={`loader ${progress === 100 ? "loader--disappear" : ""}`}
      />
      
      <div className={`outro ${end ? "outro--appear" : ""}`}>
        <p className="outro__text">
          Thank You for visiting down the memory lane
        </p>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: "flex",
          gap: 8,
          zIndex: 1000,
        }}
      >
        {/* Removed mute/unmute, audio starts via “Let’s Go” */}
      </div>

      {/* Key collected confirmation with wrong-key branching */}
      {keyNotice && (
        <div
          role="dialog"
          aria-live="polite"
          className="glass-panel glass-panel--compact"
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {keyNotice.id === "key-main-1" ? (
            <>
              <span style={{ marginRight: 8 }}>
                Portal unlocked ahead on the main path!
              </span>
              <button
                onClick={() => setKeyNotice(null)}
                className="glass-btn glass-btn--success"
              >
                OK
              </button>
            </>
          ) : (
            <>
              <span style={{ marginRight: 8 }}>
                Wrong key, only the left path key opens the portal.
              </span>
              <button
                onClick={() => {
                  window.dispatchEvent(new Event("go-back-main"));
                  setKeyNotice(null);
                }}
                className="glass-btn glass-btn--danger"
              >
                Go back
              </button>
              <button
                onClick={() => setKeyNotice(null)}
                className="glass-btn glass-btn--primary"
              >
                Keep moving forward (restart)
              </button>
            </>
          )}
        </div>
      )}

      {/* Path change guidance (non-interactive, auto-hide) */}
      {choiceNotice && (
        <div
          role="status"
          aria-live="polite"
          className="glass-panel glass-panel--compact"
          style={{
            position: "fixed",
            top: 64,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2100,
            fontFamily: "Inter, sans-serif",
            pointerEvents: "none",
          }}
        >
          {choiceNotice.choice === "stay" && (
            <span>Staying on current path — keep moving forward.</span>
          )}
          {choiceNotice.choice === "left" && (
            <span>Switched to LEFT path.</span>
          )}
          {choiceNotice.choice === "right" && (
            <span>Switched to RIGHT path.</span>
          )}
          {choiceNotice.choice === "main" && (
            <span>Returned to MAIN path.</span>
          )}
        </div>
      )}

      {/* Camera consent dialog (fallback if user didn't choose at intro) */}
      {play && cameraEnabled === null && (
        <div
          role="dialog"
          aria-label="Camera consent"
          className="glass-panel glass-panel--compact"
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2000,
            fontFamily: "Inter, sans-serif",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span style={{ opacity: 0.9 }}>
            Use your camera for hand controls?
          </span>
          <button
            onClick={() => setCameraEnabled(true)}
            className="glass-btn glass-btn--primary"
          >
            Yes
          </button>
          <button
            onClick={() => setCameraEnabled(false)}
            className="glass-btn glass-btn--danger"
          >
            No
          </button>
        </div>
      )}

      {/* Junction choice HUD overlay at top */}
      {junctionLocked && (
        <div
          role="dialog"
          aria-label="Choose your route"
          className="glass-panel glass-panel--green glass-panel--compact"
          style={{
            position: "fixed",
            top: 18,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2200,
            fontFamily: "Inter, sans-serif",
            display: "flex",
            gap: 12,
            alignItems: "center",
            pointerEvents: "auto",
          }}
        >
          <span style={{ opacity: 0.9, marginRight: 8 }}>Select direction:</span>
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("junction-choose", { detail: "stay" })
              )
            }
            className="glass-btn glass-btn--success"
          >
            ↑ Stay
          </button>
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("junction-choose", { detail: "left" })
              )
            }
            className="glass-btn glass-btn--success"
          >
            ← Left
          </button>
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("junction-choose", { detail: "right" })
              )
            }
            className="glass-btn glass-btn--success"
          >
            → Right
          </button>
        </div>
      )}

      {/* Portal activation overlay removed: direct entry enabled */}

      {/* Transitional crossfade removed per request for direct page change */}
    </div>
  );
};

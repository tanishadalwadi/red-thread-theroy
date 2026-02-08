import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { usePlay } from "../contexts/Play";
import { usePhoto } from "../contexts/PhotoContext";
import "../../Cinematic Landing Page Design/src/index.css";

function EndPortalMake() {
  const navigate = useNavigate();
  const { resetToStart } = usePlay();
  const { setPhoto } = usePhoto();

  const restart = () => {
    try { resetToStart(); } catch {}
    try { setPhoto(null); } catch {}
    try {
      navigate("/", { replace: true });
      window.setTimeout(() => { try { window.location.reload(); } catch {} }, 50);
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <div className="make-page make-container make-container--full" style={{ position: "relative", minHeight: "100vh" }}>
      {/* Subtle gradient background from Make UI */}
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,17,36,1) 0%, rgba(10,16,39,1) 50%, rgba(8,17,36,1) 100%)" }} />
      {/* Content card centered */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8 rounded-xl backdrop-blur-xl"
          style={{
            width: "min(680px, 92vw)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div className="make-heading" style={{ color: "rgba(255,255,255,0.95)", fontSize: 28, fontWeight: 700 }}>
            Thank you for playing Threadsacape
          </div>
          <div className="make-body" style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, marginTop: 10 }}>
            Your journey through the portal has concluded.
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <button
              onClick={restart}
              className="px-8 py-3 rounded-full"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                color: "white",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "linear-gradient(180deg, #ff2d75 0%, #ff0844 100%)",
                boxShadow: "0 16px 48px rgba(255, 13, 100, 0.35)",
              }}
            >
              Restart
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default EndPortalMake;
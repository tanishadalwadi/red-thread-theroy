import React, { useEffect } from "react";
import { motion } from "motion/react";
import MandalaPreview from "./MandalaPreview";

type PortalProps = {
  onActivate: () => void;
};

const Portal: React.FC<PortalProps> = ({ onActivate }) => {
  // Keyboard activation: SPACE or ENTER triggers the portal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        onActivate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onActivate]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        color: "white",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        background: "black",
      }}
    >
      {/* Mandala activation preview centered */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MandalaPreview activated={false} />
      </div>

      {/* Instruction hint */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <div style={{ color: "#d8b4fe" }}>Press SPACE or ENTER</div>
        <div style={{ color: "rgba(168,85,247,0.8)" }}>to enter the memory dome</div>
      </div>

      {/* Center orb button retains click activation */}
      <motion.button
        onClick={onActivate}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 120,
          height: 120,
          marginLeft: -60,
          marginTop: -60,
          borderRadius: "50%",
          background: "radial-gradient(circle, #ffffff, rgba(168,85,247,0.85))",
          border: "1px solid rgba(255,255,255,0.7)",
          cursor: "pointer",
          boxShadow: "0 0 30px rgba(168,85,247,0.8), 0 0 60px rgba(59,130,246,0.6)",
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        title="Activate"
        aria-label="Activate portal"
      />
    </div>
  );
};

export default Portal;
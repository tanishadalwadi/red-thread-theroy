import { Html } from "@react-three/drei";

export default function JunctionOverlay({ position, onChoose }) {
  return (
    <Html position={position} transform distanceFactor={10} style={{ pointerEvents: "auto" }}>
      <div className="glass-panel glass-panel--green glass-panel--compact" style={{ display: "flex", gap: 12, alignItems: "center", fontFamily: "Inter, sans-serif" }}>
        <span style={{ opacity: 0.9, marginRight: 8 }}>Choose your route:</span>
        <button
          onClick={() => onChoose?.("stay")}
          title="Thumbs up"
          className="glass-btn glass-btn--success"
        >
          ↑ Stay on path
        </button>
        <button
          onClick={() => onChoose?.("left")}
          title="Thumb left"
          className="glass-btn glass-btn--success"
        >
          ← Left
        </button>
        <button
          onClick={() => onChoose?.("right")}
          title="Thumb right"
          className="glass-btn glass-btn--success"
        >
          → Right
        </button>
      </div>
    </Html>
  );
}
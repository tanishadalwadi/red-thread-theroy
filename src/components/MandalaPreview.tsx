import React from "react";
import { motion } from "motion/react";

type MandalaPreviewProps = {
  activated?: boolean;
};

export default function MandalaPreview({ activated = false }: MandalaPreviewProps) {
  const circles = [0, 1, 2, 3, 4];
  const petals = 12;
  return (
    <div style={{ position: "relative", width: 320, height: 320 }}>
      {/* Decorative rotating circles */}
      {circles.map((idx) => (
        <motion.div
          key={`circle-${idx}`}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 120 + idx * 40,
            height: 120 + idx * 40,
            marginLeft: -(120 + idx * 40) / 2,
            marginTop: -(120 + idx * 40) / 2,
            borderRadius: "50%",
            border: "2px solid",
            borderColor: activated
              ? `rgba(168, 85, 247, ${0.6 - idx * 0.08})`
              : `rgba(139, 92, 246, ${0.45 - idx * 0.08})`,
            boxShadow: activated
              ? "0 0 30px rgba(168,85,247,0.6)"
              : "0 0 0 rgba(0,0,0,0)",
          }}
          animate={{ rotate: activated ? 360 : 0, scale: activated ? [1, 1.05, 1] : 1 }}
          transition={{
            rotate: { duration: 20 + idx * 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}

      {/* Mandala petals */}
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i * 360) / petals;
        return (
          <motion.div
            key={`petal-${i}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 80,
              height: 2,
              transform: `rotate(${angle}deg)`,
              transformOrigin: "left center",
              background: activated
                ? "linear-gradient(to right, rgba(168,85,247,0.8), rgba(59,130,246,0.7), transparent)"
                : "linear-gradient(to right, rgba(139,92,246,0.5), transparent)",
              borderRadius: 9999,
            }}
            animate={{ opacity: activated ? [0.3, 0.85, 0.3] : 0.35 }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
          />
        );
      })}

      {/* Center glow */}
      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 96,
          height: 96,
          marginLeft: -48,
          marginTop: -48,
          borderRadius: "50%",
          border: "4px solid",
          borderColor: activated ? "rgba(168,85,247,0.8)" : "rgba(139,92,246,0.6)",
          background: activated
            ? "radial-gradient(circle, rgba(168,85,247,0.3), transparent)"
            : "radial-gradient(circle, rgba(139,92,246,0.2), transparent)",
          boxShadow: activated
            ? "0 0 30px rgba(168,85,247,0.8), inset 0 0 24px rgba(168,85,247,0.5)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        animate={{ scale: activated ? [1, 1.08, 1] : 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
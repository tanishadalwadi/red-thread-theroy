import React, { useMemo } from "react";
import { motion } from "motion/react";

export default function ConfettiBurst({ visible = true, count = 180, duration = 1.8, zIndex = 5000 }) {
  if (!visible) return null;

  const pieces = useMemo(() => {
    const colors = ["#ff2d75", "#ffb703", "#3b82f6", "#10b981", "#a855f7", "#f59e0b", "#ef4444"];
    return Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2; // 0..2π
      const distance = 200 + Math.random() * 400; // how far it travels
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance + 180; // bias downward
      const rotate = Math.random() * 360;
      const w = 20 + Math.random() * 10;
      const h = 12 + Math.random() * 24;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 0.15;
      const d = duration * (0.9 + Math.random() * 0.6);
      return { id: i, x, y, rotate, w, h, color, delay, d };
    });
  }, [count, duration]);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0.2, x: p.x, y: p.y, rotate: p.rotate }}
          transition={{ duration: p.d, ease: "easeOut", delay: p.delay }}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: p.w,
            height: p.h,
            background: p.color,
            borderRadius: 2,
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
          }}
        />
      ))}
    </div>
  );
}
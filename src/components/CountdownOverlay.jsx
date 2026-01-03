import React from "react";
import { motion } from "motion/react";
// Reuse Make UI components and styles
import "../index.css";
// Use plain elements styled to match Make UI without external deps

export default function CountdownOverlay({ value, visible = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: "50%",
        bottom: 28,
        transform: "translateX(-50%)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          borderRadius: 16,
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 20px 60px rgba(255,0,80,0.12)",
        }}
      >
        <div style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
          Focused on your memory
        </div>
        <button
          aria-label="Countdown"
          disabled
          style={{
            width: 56,
            height: 56,
            borderRadius: 9999,
            fontSize: 22,
            fontWeight: 700,
            color: "white",
            border: "1px solid rgba(255,255,255,0.25)",
            background: "linear-gradient(180deg, #ff2d75 0%, #ff0844 100%)",
            boxShadow: "0 12px 36px rgba(255, 13, 100, 0.35)",
          }}
        >
          {value}
        </button>
      </div>
    </motion.div>
  );
}
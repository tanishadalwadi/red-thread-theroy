import { motion } from "motion/react";

interface OrbProps {
  position: { x: number; y: number };
  isActivated: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: (x: number, y: number) => void;
}

export function Orb({ position, isActivated, isDragging, onDragStart, onDragEnd }: OrbProps) {
  return (
    <motion.div
      style={{ position: "absolute", cursor: "grab", zIndex: 50, left: position.x, top: position.y, transform: "translate(-50%, -50%)" }}
      drag={!isActivated}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={(e, info) => {
        const newX = position.x + info.offset.x;
        const newY = position.y + info.offset.y;
        onDragEnd(newX, newY);
      }}
      whileDrag={{ scale: 1.1 }}
    >
      <motion.div
        style={{ position: "relative", width: 64, height: 64, borderRadius: "50%" }}
        animate={{ scale: isActivated ? [1, 1.1, 1] : [1, 1.05, 1] }}
        transition={{ duration: isActivated ? 1.5 : 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: isActivated
              ? "radial-gradient(circle, rgba(168,85,247,1), rgba(59,130,246,0.8))"
              : "radial-gradient(circle, rgba(139,92,246,0.8), rgba(99,102,241,0.6))",
          }}
          animate={{
            boxShadow: isActivated
              ? [
                  "0 0 30px 10px rgba(168,85,247,0.8), 0 0 60px 20px rgba(59,130,246,0.4)",
                  "0 0 50px 20px rgba(59,130,246,0.8), 0 0 80px 30px rgba(168,85,247,0.4)",
                  "0 0 30px 10px rgba(168,85,247,0.8), 0 0 60px 20px rgba(59,130,246,0.4)",
                ]
              : [
                  "0 0 15px 5px rgba(139,92,246,0.4)",
                  "0 0 20px 8px rgba(99,102,241,0.3)",
                  "0 0 15px 5px rgba(139,92,246,0.4)",
                ],
          }}
          transition={{ duration: isActivated ? 2 : 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          style={{ position: "absolute", inset: 8, borderRadius: "50%", background: "white" }}
          animate={{ opacity: isActivated ? [0.9, 1, 0.9] : [0.6, 0.8, 0.6] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />

        {isActivated && (
          <>
            {[...Array(8)].map((_, i) => {
              const angle = (i * 360) / 8;
              const dx = Math.cos((angle * Math.PI) / 180) * 40;
              const dy = Math.sin((angle * Math.PI) / 180) * 40;
              return (
                <motion.div
                  key={`particle-${i}`}
                  style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "#d8b4fe", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
                  animate={{ x: [0, dx, 0], y: [0, dy, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.25, ease: "easeOut" }}
                />
              );
            })}
          </>
        )}

        <motion.div
          style={{ position: "absolute", inset: 12, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 50%)" }}
        />
      </motion.div>
    </motion.div>
  );
}
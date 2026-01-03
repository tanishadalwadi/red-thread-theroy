import { motion } from "motion/react";

interface MandalaProps {
  isActivated: boolean;
}

export function Mandala({ isActivated }: MandalaProps) {
  const circles = [1, 2, 3, 4, 5];
  const petals = 12;

  return (
    <div style={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {circles.map((circle, index) => (
        <motion.div
          key={`circle-${circle}`}
          style={{
            position: "absolute",
            borderRadius: "50%",
            borderStyle: "solid",
            borderWidth: 2,
            width: `${120 + index * 60}px`,
            height: `${120 + index * 60}px`,
            borderColor: isActivated
              ? `rgba(168, 85, 247, ${0.6 - index * 0.1})`
              : `rgba(139, 92, 246, ${0.4 - index * 0.08})`,
          }}
          animate={{
            rotate: isActivated ? 360 : 0,
            scale: isActivated ? [1, 1.05, 1] : 1,
            borderColor: isActivated
              ? [
                  `rgba(168, 85, 247, ${0.6 - index * 0.1})`,
                  `rgba(59, 130, 246, ${0.6 - index * 0.1})`,
                  `rgba(168, 85, 247, ${0.6 - index * 0.1})`,
                ]
              : `rgba(139, 92, 246, ${0.4 - index * 0.08})`,
          }}
          transition={{
            rotate: { duration: 20 + index * 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            borderColor: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}

      {[...Array(petals)].map((_, i) => {
        const angle = (i * 360) / petals;
        return (
          <motion.div
            key={`petal-${i}`}
            style={{
              position: "absolute",
              width: 80,
              height: 8,
              borderRadius: 9999,
              left: "50%",
              top: "50%",
              transform: `rotate(${angle}deg)`,
              background: isActivated
                ? "linear-gradient(to right, rgba(168,85,247,0.8), rgba(59,130,246,0.8), transparent)"
                : "linear-gradient(to right, rgba(139,92,246,0.5), transparent)",
              transformOrigin: "left center",
            }}
            animate={{ opacity: isActivated ? [0.3, 0.8, 0.3] : 0.3 }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
          />
        );
      })}

      <motion.div
        style={{
          position: "absolute",
          width: 96,
          height: 96,
          borderRadius: "50%",
          borderStyle: "solid",
          borderWidth: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderColor: isActivated ? "rgba(168,85,247,0.8)" : "rgba(139,92,246,0.5)",
          background: isActivated
            ? "radial-gradient(circle, rgba(168,85,247,0.3), transparent)"
            : "radial-gradient(circle, rgba(139,92,246,0.2), transparent)",
        }}
        animate={{
          borderColor: isActivated
            ? ["rgba(168,85,247,0.8)", "rgba(59,130,246,0.8)", "rgba(168,85,247,0.8)"]
            : "rgba(139,92,246,0.5)",
          boxShadow: isActivated
            ? [
                "0 0 20px rgba(168,85,247,0.5)",
                "0 0 40px rgba(59,130,246,0.5)",
                "0 0 20px rgba(168,85,247,0.5)",
              ]
            : "0 0 0px rgba(139,92,246,0)",
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(192,132,252,0.5)" }} />
      </motion.div>

      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <motion.div
            key={`geo-${i}`}
            style={{
              position: "absolute",
              width: 48,
              height: 48,
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(60px)`,
            }}
          >
            <motion.div
              style={{
                width: "100%",
                height: "100%",
                borderStyle: "solid",
                borderWidth: 2,
                borderColor: "rgba(168,85,247,0.4)",
                transform: "rotate(45deg)",
              }}
              animate={{
                borderColor: isActivated
                  ? [
                      "rgba(168,85,247,0.6)",
                      "rgba(59,130,246,0.6)",
                      "rgba(168,85,247,0.6)",
                    ]
                  : "rgba(139,92,246,0.4)",
                rotate: isActivated ? [45, 90, 45] : 45,
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
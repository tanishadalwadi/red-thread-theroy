import { motion, AnimatePresence } from "motion/react";

interface PlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectControl: (method: "keyboard" | "gesture") => void;
}

export function PlayModal({
  isOpen,
  onClose,
  onSelectControl,
}: PlayModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center px-8 pt-24 md:pt-32 lg:pt-36 overflow-y-auto"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />

          {/* Stars in background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => {
              const size = Math.random() * 2;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: size,
                    height: size,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: `0 0 ${size * 3}px ${
                      size * 0.5
                    }px rgba(255,255,255,0.6)`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.4, 1],
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </div>

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-10"
            >
              <h2
                className="mb-3"
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontWeight: 900,
                  paddingTop: "50px",
                }}
              >
                Choose Your <span className="text-[#FF3B3B]">Control</span>{" "}
                Method
              </h2>
              <p className="text-white/70 text-xl">
                Select how you want to navigate through Threadscape
              </p>
            </motion.div>

            {/* Control Cards */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Keyboard Card */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="relative p-8 md:p-10 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-blue-900/25 via-blue-950/15 to-[#0a1a35]/20 border border-white/30 overflow-hidden cursor-pointer group"
                style={{
                  boxShadow:
                    "0 12px 40px 0 rgba(31, 38, 135, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                  }}
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/30 flex items-center justify-center mb-6 md:mb-8 mx-auto">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      className="text-white"
                    >
                      <rect
                        x="4"
                        y="8"
                        width="40"
                        height="32"
                        rx="4"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      />
                      <rect
                        x="10"
                        y="24"
                        width="6"
                        height="6"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="18"
                        y="24"
                        width="6"
                        height="6"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="26"
                        y="24"
                        width="6"
                        height="6"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="34"
                        y="24"
                        width="6"
                        height="6"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="14"
                        y="16"
                        width="6"
                        height="6"
                        rx="1"
                        fill="#FF3B3B"
                      />
                      <rect
                        x="22"
                        y="16"
                        width="6"
                        height="6"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="30"
                        y="16"
                        width="6"
                        height="6"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  <h3 className="text-center mb-4 text-white">
                    Keyboard Controls
                  </h3>

                  <p className="text-center text-white/80 mb-8 leading-relaxed">
                    Navigate using your keyboard with precision and control
                  </p>

                  {/* Keys Display */}
                  <div className="space-y-10">
                    <div className="flex items-center justify-center gap-3">
                      <div className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                        <span
                          className="text-lg"
                          style={{
                            fontFamily: "Orbitron, sans-serif",
                            fontWeight: 700,
                          }}
                        >
                          W
                        </span>
                      </div>
                      <div className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                        <span
                          className="text-lg"
                          style={{
                            fontFamily: "Orbitron, sans-serif",
                            fontWeight: 700,
                          }}
                        >
                          A
                        </span>
                      </div>
                      <div className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                        <span
                          className="text-lg"
                          style={{
                            fontFamily: "Orbitron, sans-serif",
                            fontWeight: 700,
                          }}
                        >
                          S
                        </span>
                      </div>
                      <div className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                        <span
                          className="text-lg"
                          style={{
                            fontFamily: "Orbitron, sans-serif",
                            fontWeight: 700,
                          }}
                        >
                          D
                        </span>
                      </div>
                    </div>

                    <div className="text-center text-white/60 text-sm">or</div>

                    <div className="flex items-center justify-center gap-3">
                      <div className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                        <span className="text-lg">↑</span>
                      </div>
                      <div className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                        <span className="text-lg">←</span>
                      </div>
                      <div className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                        <span className="text-lg">↓</span>
                      </div>
                      <div className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm">
                        <span className="text-lg">→</span>
                      </div>
                    </div>
                  </div>

                  {/* Start Button */}
                  <motion.button
                    className="w-full mt-12 md:mt-16 px-6 md:px-8 py-3 md:py-4 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-white/20 to-white/10 border border-white/30 text-white group-hover:border-white/50 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: "0 4px 16px 0 rgba(255, 255, 255, 0.1)",
                    }}
                    onClick={() => onSelectControl("keyboard")}
                  >
                    <span
                      style={{
                        fontFamily: "Orbitron, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Start with Keyboard
                    </span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Hand Gesture Card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="relative p-8 md:p-10 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-[#FF3B3B]/20 via-[#FF3B3B]/10 to-white/5 border border-[#FF3B3B]/40 overflow-hidden cursor-pointer group"
                style={{
                  boxShadow:
                    "0 12px 40px 0 rgba(255, 59, 59, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 0%, rgba(255,59,59,0.3) 50%, transparent 100%)",
                  }}
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF3B3B] to-transparent" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#FF3B3B]/30 to-[#FF3B3B]/10 border border-[#FF3B3B]/50 flex items-center justify-center mb-6 md:mb-8 mx-auto">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      className="text-[#FF3B3B]"
                    >
                      <path
                        d="M14 28V18C14 16.3431 15.3431 15 17 15C18.6569 15 20 16.3431 20 18V12C20 10.3431 21.3431 9 23 9C24.6569 9 26 10.3431 26 12V14C26 12.3431 27.3431 11 29 11C30.6569 11 32 12.3431 32 14V16C32 14.3431 33.3431 13 35 13C36.6569 13 38 14.3431 38 16V28C38 34.6274 32.6274 40 26 40C19.3726 40 14 34.6274 14 28Z"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 22L20 18"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <h3 className="text-center mb-4 text-white">Hand Gestures</h3>

                  <p className="text-center text-white/80 mb-8 leading-relaxed">
                    Experience the future with natural hand movements
                  </p>

                  {/* Gesture Icons */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { icon: "✋", label: "Move Forward" },
                      { icon: "👈", label: "Move Left" },
                      { icon: "👉", label: "Move Right" },
                      { icon: "✊", label: "Stop" },
                    ].map((gesture, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="p-4 rounded-xl bg-white/5 border border-[#FF3B3B]/20 backdrop-blur-sm text-center"
                      >
                        <div className="text-3xl mb-2">{gesture.icon}</div>
                        <div className="text-sm text-white/70">
                          {gesture.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Start Button */}
                  <motion.button
                    className="w-full mt-6 md:mt-8 px-6 md:px-8 py-3 md:py-4 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-[#FF3B3B]/90 to-[#ff1f1f]/90 border border-[#FF3B3B]/50 text-white overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: "0 8px 24px 0 rgba(255, 59, 59, 0.4)",
                    }}
                    onClick={() => onSelectControl("gesture")}
                  >
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                      }}
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "easeInOut",
                      }}
                    />
                    <span
                      className="relative z-10"
                      style={{
                        fontFamily: "Orbitron, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Start with Gestures
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Bottom constellation decoration */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <svg
                width="150"
                height="60"
                viewBox="0 0 150 60"
                className="mx-auto opacity-30"
              >
                <defs>
                  <filter id="modal-constellation-glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {[
                  { x: 30, y: 30 },
                  { x: 60, y: 20 },
                  { x: 75, y: 40 },
                  { x: 90, y: 20 },
                  { x: 120, y: 30 },
                ].map((point, i) => (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="2"
                    fill={i === 2 ? "#FF3B3B" : "#fff"}
                    filter="url(#modal-constellation-glow)"
                  />
                ))}

                <line
                  x1="30"
                  y1="30"
                  x2="60"
                  y2="20"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                />
                <line
                  x1="60"
                  y1="20"
                  x2="75"
                  y2="40"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                />
                <line
                  x1="75"
                  y1="40"
                  x2="90"
                  y2="20"
                  stroke="rgba(255, 59, 59, 0.4)"
                  strokeWidth="1"
                />
                <line
                  x1="90"
                  y1="20"
                  x2="120"
                  y2="30"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

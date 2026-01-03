import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

interface HeroProps {
  onPlayClick: () => void;
}

export function Hero({ onPlayClick }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax transforms - different speeds for depth
  const yBackground = useTransform(scrollY, [0, 1000], [0, 300]);
  const yStars = useTransform(scrollY, [0, 1000], [0, 200]);
  const yMoon = useTransform(scrollY, [0, 1000], [0, 150]);
  const yHills = useTransform(scrollY, [0, 1000], [0, 100]);
  const yCharacter = useTransform(scrollY, [0, 1000], [0, 50]);
  const yForeground = useTransform(scrollY, [0, 1000], [0, 30]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ minHeight: "calc(100vh - var(--make-nav-height))" }}
    >
      {/* Video Background - Full Screen */}
      <motion.div
        style={{ y: yBackground }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: "brightness(0.7)",
          }}
        >
          <source
            src="https://res.cloudinary.com/dbo5rxyp9/video/upload/v1764537628/unicorn-1764536100841_pcnjxf.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Deep space background - slowest */}
      <motion.div
        style={{ y: yBackground }}
        className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/40 via-[#0d1333]/40 to-[#081124]/60"
      />

      {/* Stars layer */}
      <motion.div style={{ y: yStars }} className="absolute inset-0">
        {Array.from({ length: 150 }).map((_, i) => {
          const size = Math.random() * 2.5;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 5;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                top: `${top}%`,
                boxShadow: `0 0 ${size * 3}px ${
                  size * 0.5
                }px rgba(255,255,255,0.6)`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 4,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Shooting star */}
        <motion.div
          className="absolute"
          style={{ top: "15%", left: "70%" }}
          animate={{
            x: [0, 300],
            y: [0, 150],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 6,
            ease: "easeOut",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full bg-white"
            style={{
              boxShadow:
                "0 0 20px 4px rgba(255,255,255,0.9), -100px 0 40px 10px rgba(255,255,255,0.3)",
            }}
          />
        </motion.div>

        {/* Floating constellation in top right */}
        <motion.div
          className="absolute top-32 right-32 opacity-40"
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="150" height="150" viewBox="0 0 150 150">
            <defs>
              <filter id="hero-constellation-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Mini constellation nodes */}
            {[
              { x: 30, y: 40 },
              { x: 60, y: 30 },
              { x: 90, y: 50 },
              { x: 120, y: 40 },
            ].map((point, i) => (
              <g key={i} filter="url(#hero-constellation-glow)">
                <circle cx={point.x} cy={point.y} r="3" fill="#fff" />
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#fff"
                  animate={{
                    r: [4, 8, 4],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              </g>
            ))}

            {/* Connection lines */}
            {[
              { x1: 30, y1: 40, x2: 60, y2: 30 },
              { x1: 60, y1: 30, x2: 90, y2: 50 },
              { x1: 90, y1: 50, x2: 120, y2: 40 },
            ].map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1"
              />
            ))}
          </svg>
        </motion.div>

        {/* Floating constellation in bottom left */}
        <motion.div
          className="absolute bottom-1/4 left-24 opacity-30"
          animate={{
            y: [0, 10, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <filter id="hero-constellation-glow-2">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Mini constellation with red accent */}
            {[
              { x: 40, y: 50, color: "#FF3B3B" },
              { x: 60, y: 30, color: "#fff" },
              { x: 80, y: 60, color: "#fff" },
            ].map((point, i) => (
              <g key={i} filter="url(#hero-constellation-glow-2)">
                <circle cx={point.x} cy={point.y} r="3" fill={point.color} />
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill={point.color}
                  animate={{
                    r: [4, 7, 4],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />
              </g>
            ))}

            {/* Connection lines */}
            {[
              { x1: 40, y1: 50, x2: 60, y2: 30 },
              { x1: 60, y1: 30, x2: 80, y2: 60 },
            ].map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={
                  i === 0
                    ? "rgba(255, 59, 59, 0.4)"
                    : "rgba(255, 255, 255, 0.3)"
                }
                strokeWidth="1"
              />
            ))}
          </svg>
        </motion.div>
      </motion.div>

      {/* Background hills */}
      {/* <motion.div style={{ y: yHills }} className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 400" className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hill1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0a1a35" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#050d1f" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="hill2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d1f3d" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#081529" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M0,250 Q360,140 720,200 T1440,220 L1440,400 L0,400 Z"
            fill="url(#hill1)"
          />
          <path
            d="M0,300 Q480,220 960,270 T1440,290 L1440,400 L0,400 Z"
            fill="url(#hill2)"
          />
        </svg>
      </motion.div> */}

      {/* Foreground grass */}

      {/* Hero content - centered */}
      <motion.div
        style={{ opacity }}
        className="relative z-40 h-full flex items-center justify-center"
      >
        <div
          className="container mx-auto px-8 max-w-5xl text-center"
          style={{ marginTop: 50 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-10"
          >
            {/* Glass container for text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative px-16 py-12 rounded-3xl backdrop-blur-xl bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/20 shadow-2xl"
              style={{
                boxShadow:
                  "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-30"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                }}
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
              />

              <h1
                className="mb-4 leading-tight drop-shadow-2xl relative z-10"
                style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900 }}
              >
                <span className="text-[#FF3B3B]">Thread</span>scape
              </h1>
              <h1 className="mb-0 text-white/70 drop-shadow-xl relative z-10">
                Walk your path, claim the key and find yourself
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className=""
            >
              <motion.button
                className="relative px-12 py-5 text-lg rounded-full backdrop-blur-2xl bg-gradient-to-br from-[#FF3B3B]/90 via-[#FF3B3B]/80 to-[#ff1f1f]/90 text-white border-2 border-white/30 overflow-hidden transition-all duration-300 shadow-2xl"
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow:
                    "0 8px 32px 0 rgba(255, 59, 59, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)",
                }}
                onClick={onPlayClick}
              >
                {/* Glass shine effect */}
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
                <span className="relative z-10">Play</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

import { motion } from "motion/react";
import { useRef } from "react";
import { Palette, Music, Users, Sparkles, Code2 } from "lucide-react";

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  const designColors = [
    { name: "Deep Space", hex: "#081124", usage: "Primary Background" },
    { name: "Cosmic Red", hex: "#FF3B3B", usage: "Accent & Highlights" },
    { name: "Pure White", hex: "#FFFFFF", usage: "Primary Text" },
    { name: "Midnight Black", hex: "#000000", usage: "Secondary Text" },
  ];

  const techStack = [
    { name: "React", category: "Framework" },
    { name: "TypeScript", category: "Language" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Motion", category: "Animation" },
    { name: "Lucide React", category: "Icons" },
    { name: "Vite", category: "Build Tool" },
    { name: "Three.js", category: "3D Engine" },
    { name: "React Three Fiber", category: "3D React" },
    { name: "@react-three/drei", category: "3D Helpers" },
    { name: "GSAP", category: "Animation" },
    { name: "MediaPipe Hands", category: "Hand Tracking" },
    { name: "React Router", category: "Routing" },
    { name: "sonner", category: "Notifications" },
    { name: "next-themes", category: "Theme" },
    { name: "shadcn/ui", category: "UI Components" },
  ];

  const teamMembers = [
    {
      name: "Tanisha Dalwadi",
      src: "/teamimages/Tanisha_Dalwadi_Headshot.png",
    },
    { name: "Siddharth Satija", src: "/teamimages/Siddhart_Satija.png" },
    { name: "Kalyan Sudharkar", src: "/teamimages/kalyansudharkar.png" },
  ];

  // Reusable team member card to unify square image sizing
  const TeamMemberCard = ({
    member,
    i,
    size = 260,
  }: {
    member: { name: string; src: string };
    i: number;
    size?: number;
  }) => (
    <motion.div
      key={member.name}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.35 + i * 0.1 }}
      className="p-3 inline-flex flex-col items-center rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 hover:border-[#FF3B3B]/30 transition-all duration-300"
      whileHover={{ scale: 1.02, y: -1 }}
    >
      {/* Standardized team photo wrapper to small square size */}
      <div
        className="mx-auto aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40 mb-2"
        style={{ width: size, height: size }}
      >
        <img
          src={member.src}
          alt={member.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div
        className="text-white text-center text-sm"
        style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700 }}
      >
        {member.name}
      </div>
    </motion.div>
  );

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-[#081124] to-[#050d1f]" />

      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => {
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

        {/* Shooting stars */}
        {[1, 2].map((n) => (
          <motion.div
            key={n}
            className="absolute"
            style={{ top: `${15 + n * 20}%`, left: `${60 + n * 10}%` }}
            animate={{
              x: [0, 300],
              y: [0, 150],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 5 + n * 2,
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
        ))}
      </div>

      {/* Floating constellation decoration */}
      <motion.div
        className="absolute top-32 right-32 opacity-30 hidden lg:block"
        animate={{
          y: [0, -10, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180">
          <defs>
            <filter id="about-constellation-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[
            { x: 40, y: 50 },
            { x: 80, y: 30 },
            { x: 120, y: 60 },
            { x: 140, y: 40 },
            { x: 90, y: 90 },
          ].map((point, i) => (
            <g key={i} filter="url(#about-constellation-glow)">
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill={i === 2 ? "#FF3B3B" : "#fff"}
              />
              <motion.circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={i === 2 ? "#FF3B3B" : "#fff"}
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
          <line
            x1="40"
            y1="50"
            x2="80"
            y2="30"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
          />
          <line
            x1="80"
            y1="30"
            x2="120"
            y2="60"
            stroke="rgba(255, 59, 59, 0.4)"
            strokeWidth="1"
          />
          <line
            x1="120"
            y1="60"
            x2="140"
            y2="40"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
          />
          <line
            x1="120"
            y1="60"
            x2="90"
            y2="90"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-8 py-32 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1
            className="mb-6"
            style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900 }}
          >
            About <span className="text-[#FF3B3B]">Thread</span>scape
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            A cosmic journey through interconnected destinies
          </p>
        </motion.div>

        {/* Red String Theory Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative p-12 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-[#FF3B3B]/20 via-white/5 to-transparent border border-[#FF3B3B]/30 overflow-hidden mb-12"
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(255, 59, 59, 0.3), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF3B3B] to-transparent" />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-30"
            style={{
              background:
                "linear-gradient(135deg, transparent 0%, rgba(255,59,59,0.2) 50%, transparent 100%)",
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

          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF3B3B] to-[#ff1f1f] flex items-center justify-center mb-6 mx-auto">
              <Sparkles size={32} className="text-white" />
            </div>
            <h2 className="mb-6 text-white">
              The <span className="text-[#FF3B3B]">Red String</span> Theory
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-4xl mx-auto mb-6">
              In East Asian mythology, the Red String of Fate connects those who
              are destined to meet, regardless of time, place, or circumstance.
              The string may stretch or tangle, but never break.
            </p>
            <p className="text-lg text-white/70 leading-relaxed max-w-3xl mx-auto">
              Threadscape brings this ancient belief to life in a cosmic realm
              where every character you encounter is bound to you by invisible
              threads. Walk your path, claim the key to understanding these
              connections, and find yourself through the people you're meant to
              meet.
            </p>
          </div>
        </motion.div>

        {/* Team Section (moved above Design System) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF3B3B] to-[#ff1f1f] flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <h2 className="text-white">Team</h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="relative p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 overflow-hidden"
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
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />

              <div className="relative z-10">
                <div className="flex justify-center gap-4">
                  <TeamMemberCard
                    member={{
                      name: "Tanisha Dalwadi",
                      src: "/teamimages/Tanisha_Dalwadi_Headshot.png",
                    }}
                    i={0}
                    size={260}
                  />
                  <TeamMemberCard
                    member={{
                      name: "Siddharth Satija",
                      src: "/teamimages/Siddhart_Satija.png",
                    }}
                    i={1}
                    size={260}
                  />
                  <TeamMemberCard
                    member={{
                      name: "Kalyan Sudharkar",
                      src: "/teamimages/kalyansudharkar.png",
                    }}
                    i={2}
                    size={260}
                  />
                </div>
              </div>
          </motion.div>
        </motion.div>

        {/* Design System Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF3B3B] to-[#ff1f1f] flex items-center justify-center">
              <Palette size={24} className="text-white" />
            </div>
            <h2 className="text-white">Design System</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Color Palette */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 overflow-hidden"
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

              <div className="relative z-10">
                <h3 className="mb-6 text-white">Color Palette</h3>
                <div className="space-y-4">
                  {designColors.map((color, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div
                        className="w-12 h-12 rounded-xl border-2 border-white/20 shadow-lg"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1">
                        <div
                          className="text-white"
                          style={{
                            fontFamily: "Orbitron, sans-serif",
                            fontWeight: 600,
                          }}
                        >
                          {color.name}
                        </div>
                        <div className="text-sm text-white/60">{color.hex}</div>
                      </div>
                      <div className="text-xs text-white/50 text-right">
                        {color.usage}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Typography & Effects */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 overflow-hidden"
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
                  repeatDelay: 2.5,
                  ease: "easeInOut",
                }}
              />

              <div className="relative z-10">
                <h3 className="mb-6 text-white">Typography & Effects</h3>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-white/50 mb-2">Title Font</div>
                    <div
                      className="text-2xl text-white"
                      style={{
                        fontFamily: "Orbitron, sans-serif",
                        fontWeight: 900,
                      }}
                    >
                      Orbitron
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white/50 mb-2">Body Font</div>
                    <div className="text-xl text-white">
                      Inter & Inter Tight
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white/50 mb-2">
                      Visual Style
                    </div>
                    <div className="p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/20">
                      <div className="text-white/70">
                        Liquid Glass (Glassmorphism)
                      </div>
                      <div className="text-xs text-white/50 mt-1">
                        Smooth 250-400ms easing animations
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF3B3B] to-[#ff1f1f] flex items-center justify-center">
              <Code2 size={24} className="text-white" />
            </div>
            <h2 className="text-white">Technology Stack</h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 overflow-hidden"
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
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />

            <div className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {techStack.map((tech, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="p-5 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 text-center hover:border-[#FF3B3B]/30 transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -4 }}
                  >
                    <div
                      className="text-white mb-2"
                      style={{
                        fontFamily: "Orbitron, sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      {tech.name}
                    </div>
                    <div className="text-xs text-white/50">{tech.category}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Music Section */}
        <div className="mb-12">
          {/* Music Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="relative"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF3B3B] to-[#ff1f1f] flex items-center justify-center">
                <Music size={24} className="text-white" />
              </div>
              <h2 className="text-white">Music</h2>
            </div>

            <div
              className="relative p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 overflow-hidden"
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
                  repeatDelay: 3.5,
                  ease: "easeInOut",
                }}
              />

              <div className="relative z-10">
                <p className="text-white/70 leading-relaxed mb-4">
                  Cosmic soundscapes and ambient melodies crafted to enhance the
                  journey through Threadscape.
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-white/50 text-sm">
                    Original Soundtrack
                  </div>
                  <div className="text-white">Ambient Space Themes</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom constellation decoration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center"
        >
          <svg
            width="200"
            height="80"
            viewBox="0 0 200 80"
            className="mx-auto opacity-40"
          >
            <defs>
              <filter id="bottom-constellation-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {[
              { x: 40, y: 40 },
              { x: 80, y: 30 },
              { x: 100, y: 50 },
              { x: 120, y: 30 },
              { x: 160, y: 40 },
            ].map((point, i) => (
              <g key={i} filter="url(#bottom-constellation-glow)">
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="2.5"
                  fill={i === 2 ? "#FF3B3B" : "#fff"}
                />
              </g>
            ))}

            <line
              x1="40"
              y1="40"
              x2="80"
              y2="30"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
            />
            <line
              x1="80"
              y1="30"
              x2="100"
              y2="50"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
            />
            <line
              x1="100"
              y1="50"
              x2="120"
              y2="30"
              stroke="rgba(255, 59, 59, 0.4)"
              strokeWidth="1"
            />
            <line
              x1="120"
              y1="30"
              x2="160"
              y2="40"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

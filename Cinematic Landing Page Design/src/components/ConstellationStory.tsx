import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

export function ConstellationStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // Parallax layers
  const ySky = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const yStars = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const yHills = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const yCharacter = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const constellationPoints = [
    { x: 220, y: 80 },
    { x: 280, y: 120 },
    { x: 320, y: 80 },
    { x: 360, y: 140 },
    { x: 400, y: 100 },
  ];

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Sky gradient */}
      <motion.div
        style={{ y: ySky }}
        className="absolute inset-0 bg-gradient-to-b from-[#0a1535] via-[#081124] to-[#050d1f]"
      />

      {/* Stars */}
      <motion.div style={{ y: yStars }} className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => {
          const size = Math.random() * 2.5;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: size,
                height: size,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: `0 0 ${size * 3}px ${size * 0.5}px rgba(255,255,255,0.4)`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          );
        })}
        
        {/* Shooting star */}
        <motion.div
          className="absolute"
          style={{ top: '20%', left: '15%' }}
          animate={{
            x: [0, 300],
            y: [0, 150],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 8,
            ease: 'easeOut',
          }}
        >
          <div 
            className="w-1.5 h-1.5 rounded-full bg-white"
            style={{
              boxShadow: '0 0 20px 4px rgba(255,255,255,0.9), -100px 0 40px 10px rgba(255,255,255,0.3)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Hills */}
      <motion.div style={{ y: yHills }} className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 300" className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hill-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0a1832" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#050d1f" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q360,120 720,160 T1440,180 L1440,300 L0,300 Z"
            fill="url(#hill-grad-1)"
          />
          <path
            d="M0,240 Q480,180 960,220 T1440,240 L1440,300 L0,300 Z"
            fill="#050d1f"
          />
        </svg>
      </motion.div>
    </section>
  );
}
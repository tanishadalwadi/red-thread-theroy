import { motion } from 'motion/react';
import { useMemo } from 'react';

interface Stars3DProps {
  isActivated: boolean;
}

export function Stars3D({ isActivated }: Stars3DProps) {
  // Pre-calculate star positions to prevent flickering
  const stars = useMemo(() => {
    return Array.from({ length: 150 }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const distance = 1200 + Math.random() * 1500;
      
      const x = distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta);
      const z = distance * Math.cos(phi);
      
      return {
        x,
        y,
        z,
        size: Math.random() * 2 + 0.5,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.5 + 0.3,
      };
    });
  }, []);

  const nebulas = useMemo(() => {
    return Array.from({ length: 15 }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const distance = 1000 + Math.random() * 1200;
      
      const x = distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta);
      const z = distance * Math.cos(phi);
      
      return {
        x,
        y,
        z,
        size: Math.random() * 200 + 100,
        color: Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.12)' : 'rgba(59, 130, 246, 0.12)',
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 4,
      };
    });
  }, []);

  return (
    <>
      {/* Stars scattered in 3D space */}
      {stars.map((star, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate3d(${star.x}px, ${star.y}px, ${star.z}px)`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.4, star.opacity],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}

      {/* Nebula clouds */}
      {nebulas.map((nebula, i) => (
        <motion.div
          key={`nebula-${i}`}
          className="absolute rounded-full"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate3d(${nebula.x}px, ${nebula.y}px, ${nebula.z}px)`,
            width: `${nebula.size}px`,
            height: `${nebula.size}px`,
            background: `radial-gradient(circle, ${nebula.color}, transparent)`,
            filter: 'blur(50px)',
          }}
          animate={{
            opacity: isActivated ? [0.4, 0.6, 0.4] : [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: nebula.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: nebula.delay,
          }}
        />
      ))}
    </>
  );
}

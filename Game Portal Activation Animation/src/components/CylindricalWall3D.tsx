import { motion } from 'motion/react';
import { useMemo } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const memoryImages = [
  'https://images.unsplash.com/photo-1681673819379-a183d9acf860?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjBuZWJ1bGElMjBzcGFjZXxlbnwxfHx8fDE3NjQzNzE0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1677926405168-fa86268b7295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWxheHklMjBzdGFycyUyMHVuaXZlcnNlfGVufDF8fHx8MTc2NDQ2NDc5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1762009366676-cf155a52b588?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvc21pYyUyMGxpZ2h0fGVufDF8fHx8MTc2NDQ2NDc5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1654263391025-4c4809a37f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMHBsYW5ldHN8ZW58MXx8fHwxNzY0NDY0Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1715797596409-d6e10120a2d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXJvcmElMjBzcGFjZXxlbnwxfHx8fDE3NjQ0NjQ3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1507413245164-6160d8298b31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjBlbmVyZ3l8ZW58MXx8fHwxNzY0NDY0Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
];

export function CylindricalWall3D() {
  const panels = 24; // Fewer panels so each is more visible
  const radius = 450; // Closer to viewer for more immersion

  const panelData = useMemo(() => {
    return Array.from({ length: panels }, (_, i) => ({
      angle: (i * 360) / panels,
      imageIndex: i % memoryImages.length,
    }));
  }, [panels]);

  return (
    <>
      {/* Main rotating container - all panels visible at once */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          transformStyle: 'preserve-3d',
          width: '0px',
          height: '0px',
        }}
        animate={{ 
          rotateY: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* All cylinder panels - positioned around you in a circle */}
        {panelData.map((panel, i) => (
          <motion.div
            key={`panel-${i}`}
            className="absolute"
            style={{
              width: '200px',
              height: '140vh',
              left: '-100px',
              top: '-70vh',
              transform: `rotateY(${panel.angle}deg) translateZ(${radius}px)`,
              transformStyle: 'preserve-3d',
            }}
            initial={{ 
              opacity: 0,
              scaleY: 0,
            }}
            animate={{ 
              opacity: 1,
              scaleY: 1,
            }}
            transition={{
              opacity: { duration: 1.2, delay: 0.3 },
              scaleY: { duration: 1.5, delay: 0.3, ease: "easeOut" },
            }}
          >
            {/* Panel content wrapper */}
            <div className="relative w-full h-full overflow-hidden">
              {/* Memory image */}
              <ImageWithFallback
                src={memoryImages[panel.imageIndex]}
                alt={`Memory ${i + 1}`}
                className="w-full h-full object-cover"
                style={{
                  filter: 'blur(3px) brightness(0.65)',
                }}
              />
              
              {/* Top/bottom gradient fade */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.9) 100%)',
                }}
              />
              
              {/* Side fade for seamless blending */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.7) 100%)',
                }}
              />
              
              {/* Cosmic color tint */}
              <motion.div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(${panel.angle}deg, rgba(168, 85, 247, 0.25), rgba(59, 130, 246, 0.25))`,
                  mixBlendMode: 'screen',
                }}
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />

              {/* Edge glow */}
              <div 
                className="absolute inset-0 border-l border-r"
                style={{
                  borderColor: 'rgba(168, 85, 247, 0.2)',
                }}
              />

              {/* Subtle scanlines */}
              <motion.div
                className="absolute w-full h-px"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 0 4px rgba(255, 255, 255, 0.3)',
                }}
                animate={{
                  y: ['-10%', '110%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "linear",
                }}
              />
            </div>
          </motion.div>
        ))}

        {/* Vertical light pillars at cardinal points */}
        {[0, 90, 180, 270].map((angle, i) => (
          <motion.div
            key={`pillar-${angle}`}
            className="absolute"
            style={{
              width: '6px',
              height: '120vh',
              left: '-3px',
              top: '-60vh',
              transform: `rotateY(${angle}deg) translateZ(${radius + 30}px)`,
              background: 'linear-gradient(to bottom, transparent 0%, rgba(168, 85, 247, 0.8) 20%, rgba(59, 130, 246, 0.8) 80%, transparent 100%)',
              boxShadow: '0 0 50px rgba(168, 85, 247, 1)',
              transformStyle: 'preserve-3d',
            }}
            initial={{ 
              opacity: 0,
              scaleY: 0,
            }}
            animate={{ 
              opacity: [0.6, 1, 0.6],
              scaleY: 1,
            }}
            transition={{
              scaleY: { duration: 1.8, delay: 1 + i * 0.15, ease: "easeOut" },
              opacity: { duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" },
            }}
          />
        ))}
      </motion.div>

      {/* Top ring - visible in upper field of view */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          width: `${radius * 2.5}px`,
          height: `${radius * 2.5}px`,
          marginLeft: `-${radius * 1.25}px`,
          marginTop: `-${radius * 1.25}px`,
          transform: 'translateY(-50vh) rotateX(88deg)',
          transformStyle: 'preserve-3d',
        }}
        initial={{ 
          opacity: 0,
          scale: 0.5,
        }}
        animate={{ 
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 2,
          delay: 0.8,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full border-4"
          style={{
            borderColor: 'rgba(168, 85, 247, 0.7)',
            boxShadow: '0 0 80px rgba(168, 85, 247, 0.8), inset 0 0 80px rgba(168, 85, 247, 0.5)',
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Bottom ring - visible in lower field of view */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          width: `${radius * 2.5}px`,
          height: `${radius * 2.5}px`,
          marginLeft: `-${radius * 1.25}px`,
          marginTop: `-${radius * 1.25}px`,
          transform: 'translateY(50vh) rotateX(88deg)',
          transformStyle: 'preserve-3d',
        }}
        initial={{ 
          opacity: 0,
          scale: 0.5,
        }}
        animate={{ 
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 2,
          delay: 0.8,
        }}
      >
        <motion.div
          className="w-full h-full rounded-full border-4"
          style={{
            borderColor: 'rgba(59, 130, 246, 0.7)',
            boxShadow: '0 0 80px rgba(59, 130, 246, 0.8), inset 0 0 80px rgba(59, 130, 246, 0.5)',
          }}
          animate={{
            rotate: [0, -360],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </>
  );
}

import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const memoryImages = [
  'https://images.unsplash.com/photo-1681673819379-a183d9acf860?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjBuZWJ1bGElMjBzcGFjZXxlbnwxfHx8fDE3NjQzNzE0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1677926405168-fa86268b7295?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWxheHklMjBzdGFycyUyMHVuaXZlcnNlfGVufDF8fHx8MTc2NDQ2NDc5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1762009366676-cf155a52b588?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvc21pYyUyMGxpZ2h0fGVufDF8fHx8MTc2NDQ2NDc5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1654263391025-4c4809a37f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMHBsYW5ldHN8ZW58MXx8fHwxNzY0NDY0Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1715797596409-d6e10120a2d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXJvcmElMjBzcGFjZXxlbnwxfHx8fDE3NjQ0NjQ3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1507413245164-6160d8298b31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjBlbmVyZ3l8ZW58MXx8fHwxNzY0NDY0Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080',
];

export function CylindricalWall() {
  const panels = 24; // Number of panels around the cylinder
  const panelImages = [...Array(panels)].map((_, i) => memoryImages[i % memoryImages.length]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
        {/* Rotating cylindrical panels */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...Array(panels)].map((_, i) => {
            const angle = (i * 360) / panels;
            const radius = 400; // Radius of the cylinder

            return (
              <motion.div
                key={`panel-${i}`}
                className="absolute overflow-hidden"
                style={{
                  width: '150px',
                  height: '0px',
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                }}
                initial={{ height: '0px', opacity: 0 }}
                animate={{ 
                  height: '600px',
                  opacity: 1,
                }}
                transition={{
                  height: {
                    duration: 1.5,
                    delay: 0.5,
                    ease: "easeOut",
                  },
                  opacity: {
                    duration: 0.8,
                    delay: 0.5,
                  },
                }}
              >
                {/* Panel background with image */}
                <div className="relative w-full h-full">
                  <ImageWithFallback
                    src={panelImages[i]}
                    alt={`Memory ${i + 1}`}
                    className="w-full h-full object-cover"
                    style={{
                      filter: 'blur(8px)',
                    }}
                  />
                  {/* Gradient overlays for better blending */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.8) 100%)',
                    }}
                  />
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(${angle}deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2))`,
                      mixBlendMode: 'overlay',
                    }}
                  />
                  {/* Edge glow */}
                  <div 
                    className="absolute inset-0 border-l border-r"
                    style={{
                      borderColor: 'rgba(168, 85, 247, 0.3)',
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Top and bottom energy rings */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 rounded-full border-4"
          style={{
            width: '800px',
            height: '800px',
            borderColor: 'rgba(168, 85, 247, 0.6)',
            boxShadow: '0 0 40px rgba(168, 85, 247, 0.4), inset 0 0 40px rgba(168, 85, 247, 0.2)',
          }}
          initial={{ 
            y: 'calc(-50% - 300px)',
            opacity: 0,
            scale: 0.5,
          }}
          animate={{ 
            y: 'calc(-50% - 300px)',
            opacity: 1,
            scale: 1,
            rotate: 360,
          }}
          transition={{
            opacity: { duration: 1, delay: 1 },
            scale: { duration: 1, delay: 1 },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 rounded-full border-4"
          style={{
            width: '800px',
            height: '800px',
            borderColor: 'rgba(59, 130, 246, 0.6)',
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.4), inset 0 0 40px rgba(59, 130, 246, 0.2)',
          }}
          initial={{ 
            y: 'calc(-50% + 300px)',
            opacity: 0,
            scale: 0.5,
          }}
          animate={{ 
            y: 'calc(-50% + 300px)',
            opacity: 1,
            scale: 1,
            rotate: -360,
          }}
          transition={{
            opacity: { duration: 1, delay: 1 },
            scale: { duration: 1, delay: 1 },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
        />

        {/* Energy particles rising */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`energy-${i}`}
            className="absolute w-1 h-1 rounded-full bg-purple-400"
            style={{
              left: `${50 + (Math.random() - 0.5) * 40}%`,
              bottom: '50%',
            }}
            animate={{
              y: [0, -600],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

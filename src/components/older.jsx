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
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const memoryImages = [
  'https://images.unsplash.com/photo-1612361844688-c6c9c44f3966?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBlcnNvbnxlbnwxfHx8fDE3NjQ0MDg4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMGZhY2V8ZW58MXx8fHwxNzY0NDY3NTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDQzNDkzMnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjQ0NjM1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1484863137850-59afcfe05386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzbWlsaW5nfGVufDF8fHx8MTc2NDM3NTg4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1618886850494-c79fd48305b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2NDQ2NzU0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBmYWNlc3xlbnwxfHx8fDE3NjQ0Njc1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1544124094-8aea0374da93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2NDQwNTY1NXww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1523469667392-ed01f9c3d757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBjbG9zZXVwfGVufDF8fHx8MTc2NDQ2NzU0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1509112756314-34a0badb29d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMGV4cHJlc3Npb258ZW58MXx8fHwxNzY0NDY3NTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1721411395539-152e35906fc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDQ2NzU0OHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1527565290982-018bcfdbee74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB0aGlua2luZ3xlbnwxfHx8fDE3NjQ0Njc1NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1542185400-f1c993ecbea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMGVtb3Rpb258ZW58MXx8fHwxNzY0NDY3NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcGVvcGxlfGVufDF8fHx8MTc2NDQ2NzU1MHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1530937027413-adadcf3ed719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBvdXRkb29yfGVufDF8fHx8MTc2NDM2NTc5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1525186402429-b4ff38bedec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG5hdHVyYWx8ZW58MXx8fHwxNzY0NDY3NTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1529995049601-ef63465a463f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMHByb2ZpbGV8ZW58MXx8fHwxNzY0NDY3NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1607487768473-cbe887eb0a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBjYW5kaWR8ZW58MXx8fHwxNzY0NDY3NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1492462543947-040389c4a66c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlcnNvbnxlbnwxfHx8fDE3NjQ0Njc1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1651390216985-13347fce9eb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHVsdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDQ2NzU1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1584117759484-6e4a7e3e7ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBsb29raW5nfGVufDF8fHx8MTc2NDQ2NzU1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1532170579297-281918c8ae72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMGJlYXV0eXxlbnwxfHx8fDE3NjQ0Njc1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1741723972198-659a2b181d09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBhcnRpc3RpY3xlbnwxfHx8fDE3NjQ0Njc1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1622825312265-5d5caaed05b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGNyZWF0aXZlfGVufDF8fHx8MTc2NDQ2NzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1580971739182-ccd8cfef3707?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzdHVkaW98ZW58MXx8fHwxNzY0NDY3NTU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1764422474402-5098feedb088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjQ0Njc1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1498558263790-a9555e3d002d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzY0NDY3NTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1582836985321-7a3f82fb6f3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1vb2R5fGVufDF8fHx8MTc2NDQ2NzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
];

interface Viewer360Props {
  rotation: number;
}

export function Viewer360({ rotation }: Viewer360Props) {
  const sphereRadius = 600;

  // Create spherical grid of panels
  const spherePanels = useMemo(() => {
    const panels = [];
    const horizontalSegments = 20; // Around the equator
    const verticalSegments = 10; // From top to bottom
    
    for (let v = 0; v < verticalSegments; v++) {
      // Vertical angle from top (0) to bottom (180 degrees)
      const phi = (v / verticalSegments) * Math.PI;
      
      for (let h = 0; h < horizontalSegments; h++) {
        // Horizontal angle around the sphere
        const theta = (h / horizontalSegments) * Math.PI * 2;
        
        // Calculate position on sphere surface
        const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
        const y = sphereRadius * Math.cos(phi);
        const z = sphereRadius * Math.sin(phi) * Math.sin(theta);
        
        // Calculate rotation to face inward (toward center)
        const rotationY = (theta * 180 / Math.PI) + 180;
        const rotationX = (phi * 180 / Math.PI) - 90;
        
        panels.push({
          x,
          y,
          z,
          rotationX,
          rotationY,
          imageIndex: (v * horizontalSegments + h) % memoryImages.length,
          id: `${v}-${h}`,
        });
      }
    }
    
    return panels;
  }, [sphereRadius]);

  return (
    <div 
      className="absolute inset-0"
      style={{
        perspective: '500px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Camera rotation container */}
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: rotation,
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        {/* Spherical panels - all facing inward toward you */}
        {spherePanels.map((panel) => (
          <div
            key={panel.id}
            className="absolute"
            style={{
              width: '140px',
              height: '140px',
              left: '50%',
              top: '50%',
              marginLeft: '-70px',
              marginTop: '-70px',
              transform: `translate3d(${panel.x}px, ${panel.y}px, ${panel.z}px) rotateY(${panel.rotationY}deg) rotateX(${panel.rotationX}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="relative w-full h-full">
              <ImageWithFallback
                src={memoryImages[panel.imageIndex]}
                alt={`Memory ${panel.id}`}
                className="w-full h-full object-cover"
                style={{
                  filter: 'blur(2px) brightness(0.7)',
                }}
              />
              
              {/* Gradient overlay for blending */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
                }}
              />
              
              {/* Cosmic color tint */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(${panel.rotationY}deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2))`,
                  mixBlendMode: 'screen',
                }}
              />
            </div>
          </div>
        ))}

        {/* Mandala at the bottom of sphere */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: '800px',
            height: '800px',
            marginLeft: '-400px',
            marginTop: '-400px',
            transform: `translateY(${sphereRadius - 100}px) rotateX(90deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="w-full h-full rounded-full relative"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6), rgba(59, 130, 246, 0.4), transparent 70%)',
              boxShadow: '0 0 100px rgba(168, 85, 247, 0.8), inset 0 0 80px rgba(168, 85, 247, 0.5)',
            }}
          >
            {/* Concentric circles */}
            {[1, 2, 3, 4].map((circle, index) => (
              <motion.div
                key={`circle-${circle}`}
                className="absolute left-1/2 top-1/2 rounded-full border-2"
                style={{
                  width: `${120 + index * 140}px`,
                  height: `${120 + index * 140}px`,
                  marginLeft: `-${60 + index * 70}px`,
                  marginTop: `-${60 + index * 70}px`,
                  borderColor: `rgba(168, 85, 247, ${0.8 - index * 0.15})`,
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 25 + index * 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}

            {/* Radial petals */}
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16;
              return (
                <div
                  key={`petal-${i}`}
                  className="absolute left-1/2 top-1/2 origin-left"
                  style={{
                    width: '300px',
                    height: '4px',
                    transform: `rotate(${angle}deg)`,
                    background: 'linear-gradient(to right, rgba(168, 85, 247, 0.9), rgba(59, 130, 246, 0.6), transparent)',
                  }}
                />
              );
            })}

            {/* Center orb */}
            <motion.div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: '120px',
                height: '120px',
                marginLeft: '-60px',
                marginTop: '-60px',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(168, 85, 247, 0.8))',
                boxShadow: '0 0 60px rgba(168, 85, 247, 1), inset 0 0 40px rgba(255, 255, 255, 0.8)',
              }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        {/* Energy grid lines on sphere surface */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <div
              key={`meridian-${i}`}
              className="absolute left-1/2 top-1/2"
              style={{
                width: '2px',
                height: `${sphereRadius * 2}px`,
                marginLeft: '-1px',
                marginTop: `-${sphereRadius}px`,
                transform: `rotateY(${angle}deg) translateZ(${sphereRadius - 50}px)`,
                background: 'linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.4) 25%, rgba(59, 130, 246, 0.4) 75%, transparent)',
                transformStyle: 'preserve-3d',
              }}
            />
          );
        })}

        {/* Horizontal latitude lines */}
        {[...Array(5)].map((_, i) => {
          const latitudeAngle = ((i + 1) / 6) * 180 - 90; // -75 to 75 degrees
          const latitudeRadius = sphereRadius * Math.cos((latitudeAngle * Math.PI) / 180);
          const yPosition = sphereRadius * Math.sin((latitudeAngle * Math.PI) / 180);
          
          return (
            <motion.div
              key={`latitude-${i}`}
              className="absolute left-1/2 top-1/2 rounded-full border-2"
              style={{
                width: `${latitudeRadius * 2}px`,
                height: `${latitudeRadius * 2}px`,
                marginLeft: `-${latitudeRadius}px`,
                marginTop: `-${latitudeRadius}px`,
                transform: `translateY(${yPosition}px) rotateX(90deg)`,
                borderColor: 'rgba(168, 85, 247, 0.3)',
                transformStyle: 'preserve-3d',
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Floating energy particles inside sphere */}
        {[...Array(50)].map((_, i) => {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const radius = Math.random() * (sphereRadius - 200);
          
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '50%',
                width: '4px',
                height: '4px',
                transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                background: Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.9)' : 'rgba(59, 130, 246, 0.9)',
                boxShadow: '0 0 12px currentColor',
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Viewer360 } from './Viewer360';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Portal() {
  const [isActivated, setIsActivated] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (!isActivated) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === ' ' || e.key === 'Enter') {
          setIsActivated(true);
          setTimeout(() => setShowHint(true), 1000);
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isActivated]);

  useEffect(() => {
    if (isActivated) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          setRotation(prev => prev - 5);
          setShowHint(false);
        } else if (e.key === 'ArrowRight') {
          setRotation(prev => prev + 5);
          setShowHint(false);
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isActivated]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {!isActivated ? (
          <motion.div
            key="intro"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Preview of mandala */}
            <div className="text-center">
              <motion.div
                className="mb-8"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-64 h-64 mx-auto rounded-full border-4 border-purple-500 relative"
                  style={{
                    boxShadow: '0 0 60px rgba(168, 85, 247, 0.6), inset 0 0 60px rgba(168, 85, 247, 0.3)',
                  }}
                >
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 360) / 12;
                    return (
                      <div
                        key={i}
                        className="absolute left-1/2 top-1/2 w-32 h-1 origin-left"
                        style={{
                          transform: `rotate(${angle}deg)`,
                          background: 'linear-gradient(to right, rgba(168, 85, 247, 0.8), transparent)',
                        }}
                      />
                    );
                  })}
                </div>
              </motion.div>
              <p className="text-purple-300 mb-2">Press SPACE or ENTER</p>
              <p className="text-purple-400/70">to enter the memory dome</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Viewer360 rotation={rotation} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arrow key hints */}
      {isActivated && showHint && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/30">
            <ChevronLeft className="w-5 h-5 text-purple-300" />
            <span className="text-purple-300">Left</span>
          </div>
          <span className="text-purple-400/70">Use arrow keys to look around</span>
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/30">
            <span className="text-purple-300">Right</span>
            <ChevronRight className="w-5 h-5 text-purple-300" />
          </div>
        </motion.div>
      )}

      {/* Info overlay */}
      {isActivated && (
        <motion.div
          className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <p className="text-purple-200">Memory Dome Activated</p>
          <p className="text-purple-400/70 mt-1">Navigate through cosmic memories</p>
        </motion.div>
      )}
    </div>
  );
}



import { motion } from 'motion/react';
import { useMemo } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const memoryImages = [
  'https://images.unsplash.com/photo-1612361844688-c6c9c44f3966?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBlcnNvbnxlbnwxfHx8fDE3NjQ0MDg4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMGZhY2V8ZW58MXx8fHwxNzY0NDY3NTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDQzNDkzMnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjQ0NjM1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1484863137850-59afcfe05386?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzbWlsaW5nfGVufDF8fHx8MTc2NDM3NTg4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1618886850494-c79fd48305b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2NDQ2NzU0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBmYWNlc3xlbnwxfHx8fDE3NjQ0Njc1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1544124094-8aea0374da93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2NDQwNTY1NXww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1523469667392-ed01f9c3d757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBjbG9zZXVwfGVufDF8fHx8MTc2NDQ2NzU0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1509112756314-34a0badb29d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMGV4cHJlc3Npb258ZW58MXx8fHwxNzY0NDY3NTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1721411395539-152e35906fc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDQ2NzU0OHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1527565290982-018bcfdbee74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB0aGlua2luZ3xlbnwxfHx8fDE3NjQ0Njc1NDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1542185400-f1c993ecbea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMGVtb3Rpb258ZW58MXx8fHwxNzY0NDY3NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcGVvcGxlfGVufDF8fHx8MTc2NDQ2NzU1MHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1530937027413-adadcf3ed719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBvdXRkb29yfGVufDF8fHx8MTc2NDM2NTc5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1525186402429-b4ff38bedec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG5hdHVyYWx8ZW58MXx8fHwxNzY0NDY3NTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1529995049601-ef63465a463f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMHByb2ZpbGV8ZW58MXx8fHwxNzY0NDY3NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1607487768473-cbe887eb0a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBjYW5kaWR8ZW58MXx8fHwxNzY0NDY3NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1492462543947-040389c4a66c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlcnNvbnxlbnwxfHx8fDE3NjQ0Njc1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1651390216985-13347fce9eb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHVsdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDQ2NzU1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1584117759484-6e4a7e3e7ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBsb29raW5nfGVufDF8fHx8MTc2NDQ2NzU1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1532170579297-281918c8ae72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMGJlYXV0eXxlbnwxfHx8fDE3NjQ0Njc1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1741723972198-659a2b181d09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBhcnRpc3RpY3xlbnwxfHx8fDE3NjQ0Njc1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1622825312265-5d5caaed05b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGNyZWF0aXZlfGVufDF8fHx8MTc2NDQ2NzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1580971739182-ccd8cfef3707?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzdHVkaW98ZW58MXx8fHwxNzY0NDY3NTU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1764422474402-5098feedb088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodW1hbiUyMGNoYXJhY3RlcnxlbnwxfHx8fDE3NjQ0Njc1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1498558263790-a9555e3d002d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzY0NDY3NTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1582836985321-7a3f82fb6f3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1vb2R5fGVufDF8fHx8MTc2NDQ2NzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
];

interface Viewer360Props {
  rotation: number;
}

export function Viewer360({ rotation }: Viewer360Props) {
  const sphereRadius = 600;

  // Create spherical grid of panels
  const spherePanels = useMemo(() => {
    const panels = [];
    const horizontalSegments = 20; // Around the equator
    const verticalSegments = 10; // From top to bottom
    
    for (let v = 0; v < verticalSegments; v++) {
      // Vertical angle from top (0) to bottom (180 degrees)
      const phi = (v / verticalSegments) * Math.PI;
      
      for (let h = 0; h < horizontalSegments; h++) {
        // Horizontal angle around the sphere
        const theta = (h / horizontalSegments) * Math.PI * 2;
        
        // Calculate position on sphere surface
        const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
        const y = sphereRadius * Math.cos(phi);
        const z = sphereRadius * Math.sin(phi) * Math.sin(theta);
        
        // Calculate rotation to face inward (toward center)
        const rotationY = (theta * 180 / Math.PI) + 180;
        const rotationX = (phi * 180 / Math.PI) - 90;
        
        panels.push({
          x,
          y,
          z,
          rotationX,
          rotationY,
          imageIndex: (v * horizontalSegments + h) % memoryImages.length,
          id: `${v}-${h}`,
        });
      }
    }
    
    return panels;
  }, [sphereRadius]);

  return (
    <div 
      className="absolute inset-0"
      style={{
        perspective: '500px',
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Camera rotation container */}
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: rotation,
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        {/* Spherical panels - all facing inward toward you */}
        {spherePanels.map((panel) => (
          <div
            key={panel.id}
            className="absolute"
            style={{
              width: '140px',
              height: '140px',
              left: '50%',
              top: '50%',
              marginLeft: '-70px',
              marginTop: '-70px',
              transform: `translate3d(${panel.x}px, ${panel.y}px, ${panel.z}px) rotateY(${panel.rotationY}deg) rotateX(${panel.rotationX}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="relative w-full h-full">
              <ImageWithFallback
                src={memoryImages[panel.imageIndex]}
                alt={`Memory ${panel.id}`}
                className="w-full h-full object-cover"
                style={{
                  filter: 'blur(2px) brightness(0.7)',
                }}
              />
              
              {/* Gradient overlay for blending */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.5) 100%)',
                }}
              />
              
              {/* Cosmic color tint */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(${panel.rotationY}deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2))`,
                  mixBlendMode: 'screen',
                }}
              />
            </div>
          </div>
        ))}

        {/* Mandala at the bottom of sphere */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: '800px',
            height: '800px',
            marginLeft: '-400px',
            marginTop: '-400px',
            transform: `translateY(${sphereRadius - 100}px) rotateX(90deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="w-full h-full rounded-full relative"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.6), rgba(59, 130, 246, 0.4), transparent 70%)',
              boxShadow: '0 0 100px rgba(168, 85, 247, 0.8), inset 0 0 80px rgba(168, 85, 247, 0.5)',
            }}
          >
            {/* Concentric circles */}
            {[1, 2, 3, 4].map((circle, index) => (
              <motion.div
                key={`circle-${circle}`}
                className="absolute left-1/2 top-1/2 rounded-full border-2"
                style={{
                  width: `${120 + index * 140}px`,
                  height: `${120 + index * 140}px`,
                  marginLeft: `-${60 + index * 70}px`,
                  marginTop: `-${60 + index * 70}px`,
                  borderColor: `rgba(168, 85, 247, ${0.8 - index * 0.15})`,
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 25 + index * 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}

            {/* Radial petals */}
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16;
              return (
                <div
                  key={`petal-${i}`}
                  className="absolute left-1/2 top-1/2 origin-left"
                  style={{
                    width: '300px',
                    height: '4px',
                    transform: `rotate(${angle}deg)`,
                    background: 'linear-gradient(to right, rgba(168, 85, 247, 0.9), rgba(59, 130, 246, 0.6), transparent)',
                  }}
                />
              );
            })}

            {/* Center orb */}
            <motion.div
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: '120px',
                height: '120px',
                marginLeft: '-60px',
                marginTop: '-60px',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(168, 85, 247, 0.8))',
                boxShadow: '0 0 60px rgba(168, 85, 247, 1), inset 0 0 40px rgba(255, 255, 255, 0.8)',
              }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        {/* Energy grid lines on sphere surface */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <div
              key={`meridian-${i}`}
              className="absolute left-1/2 top-1/2"
              style={{
                width: '2px',
                height: `${sphereRadius * 2}px`,
                marginLeft: '-1px',
                marginTop: `-${sphereRadius}px`,
                transform: `rotateY(${angle}deg) translateZ(${sphereRadius - 50}px)`,
                background: 'linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.4) 25%, rgba(59, 130, 246, 0.4) 75%, transparent)',
                transformStyle: 'preserve-3d',
              }}
            />
          );
        })}

        {/* Horizontal latitude lines */}
        {[...Array(5)].map((_, i) => {
          const latitudeAngle = ((i + 1) / 6) * 180 - 90; // -75 to 75 degrees
          const latitudeRadius = sphereRadius * Math.cos((latitudeAngle * Math.PI) / 180);
          const yPosition = sphereRadius * Math.sin((latitudeAngle * Math.PI) / 180);
          
          return (
            <motion.div
              key={`latitude-${i}`}
              className="absolute left-1/2 top-1/2 rounded-full border-2"
              style={{
                width: `${latitudeRadius * 2}px`,
                height: `${latitudeRadius * 2}px`,
                marginLeft: `-${latitudeRadius}px`,
                marginTop: `-${latitudeRadius}px`,
                transform: `translateY(${yPosition}px) rotateX(90deg)`,
                borderColor: 'rgba(168, 85, 247, 0.3)',
                transformStyle: 'preserve-3d',
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Floating energy particles inside sphere */}
        {[...Array(50)].map((_, i) => {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const radius = Math.random() * (sphereRadius - 200);
          
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '50%',
                width: '4px',
                height: '4px',
                transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                background: Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.9)' : 'rgba(59, 130, 246, 0.9)',
                boxShadow: '0 0 12px currentColor',
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
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
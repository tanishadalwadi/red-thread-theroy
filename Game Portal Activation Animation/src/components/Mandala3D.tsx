import { motion } from 'motion/react';

interface Mandala3DProps {
  isActivated: boolean;
  isDescending: boolean;
}

export function Mandala3D({ isActivated, isDescending }: Mandala3DProps) {
  const circles = [1, 2, 3, 4, 5, 6];
  const petals = 16;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        transformStyle: 'preserve-3d',
        width: '1200px',
        height: '1200px',
        marginLeft: '-600px',
        marginTop: '-600px',
      }}
      initial={{
        transform: 'translate3d(0, 0, -900px) rotateX(85deg)',
      }}
      animate={{
        transform: isDescending 
          ? 'translate3d(0, 500px, -150px) rotateX(85deg)'
          : 'translate3d(0, 0, -900px) rotateX(85deg)',
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
      }}
    >
      {/* Base platform */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: isActivated
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.6), rgba(59, 130, 246, 0.4), transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.2), transparent 70%)',
          boxShadow: isActivated
            ? '0 0 200px rgba(168, 85, 247, 1), inset 0 0 150px rgba(168, 85, 247, 0.5)'
            : '0 0 100px rgba(139, 92, 246, 0.5)',
        }}
      />

      {/* Concentric circles */}
      {circles.map((circle, index) => (
        <motion.div
          key={`circle-${circle}`}
          className="absolute left-1/2 top-1/2 rounded-full border-2"
          style={{
            width: `${200 + index * 140}px`,
            height: `${200 + index * 140}px`,
            marginLeft: `-${100 + index * 70}px`,
            marginTop: `-${100 + index * 70}px`,
            borderColor: isActivated
              ? `rgba(168, 85, 247, ${0.8 - index * 0.1})`
              : `rgba(139, 92, 246, ${0.5 - index * 0.08})`,
            boxShadow: isActivated
              ? `0 0 30px rgba(168, 85, 247, ${0.6 - index * 0.08})`
              : 'none',
          }}
          animate={{
            rotate: isActivated ? [0, 360] : 0,
          }}
          transition={{
            rotate: {
              duration: 20 + index * 5,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      ))}

      {/* Mandala petals */}
      {[...Array(petals)].map((_, i) => {
        const angle = (i * 360) / petals;
        return (
          <div
            key={`petal-${i}`}
            className="absolute left-1/2 top-1/2 origin-left"
            style={{
              width: '400px',
              height: '8px',
              transform: `rotate(${angle}deg)`,
            }}
          >
            <motion.div
              className="w-full h-full rounded-full"
              style={{
                background: isActivated
                  ? 'linear-gradient(to right, rgba(168, 85, 247, 1), rgba(59, 130, 246, 0.8), transparent)'
                  : 'linear-gradient(to right, rgba(139, 92, 246, 0.7), rgba(99, 102, 241, 0.5), transparent)',
                boxShadow: isActivated
                  ? '0 0 20px rgba(168, 85, 247, 1)'
                  : 'none',
              }}
              animate={{
                opacity: isActivated ? [0.7, 1, 0.7] : [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          </div>
        );
      })}

      {/* Geometric patterns */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 360) / 12;
        const radius = 250;
        return (
          <div
            key={`geo-${i}`}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              width: '50px',
              height: '50px',
              marginLeft: '-25px',
              marginTop: '-25px',
              transform: `rotate(${angle}deg) translateX(${radius}px)`,
            }}
          >
            <motion.div
              className="w-full h-full border-3 rotate-45"
              style={{
                borderColor: isActivated
                  ? 'rgba(168, 85, 247, 1)'
                  : 'rgba(139, 92, 246, 0.6)',
                borderWidth: '3px',
                borderStyle: 'solid',
                boxShadow: isActivated
                  ? '0 0 25px rgba(168, 85, 247, 1)'
                  : 'none',
              }}
              animate={{
                rotate: isActivated ? [45, 135, 45] : 45,
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          </div>
        );
      })}

      {/* Center placeholder - where the orb goes */}
      <motion.div
        className="absolute left-1/2 top-1/2 rounded-full border-4"
        style={{
          width: '180px',
          height: '180px',
          marginLeft: '-90px',
          marginTop: '-90px',
          borderColor: isActivated
            ? 'rgba(168, 85, 247, 1)'
            : 'rgba(139, 92, 246, 0.7)',
          background: isActivated
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.8), rgba(59, 130, 246, 0.5), transparent)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)',
          boxShadow: isActivated
            ? '0 0 80px rgba(168, 85, 247, 1), inset 0 0 60px rgba(168, 85, 247, 1)'
            : '0 0 40px rgba(139, 92, 246, 0.5)',
        }}
        animate={{
          scale: isActivated ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Inner energy rings */}
        {isActivated && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                }}
                animate={{
                  scale: [1, 3, 3],
                  opacity: [1, 0, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.75,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Additional decorative elements */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        const radius = 400;
        return (
          <motion.div
            key={`dot-${i}`}
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '50%',
              width: '20px',
              height: '20px',
              marginLeft: '-10px',
              marginTop: '-10px',
              transform: `rotate(${angle}deg) translateX(${radius}px)`,
              background: isActivated
                ? 'rgba(168, 85, 247, 1)'
                : 'rgba(139, 92, 246, 0.7)',
              boxShadow: isActivated
                ? '0 0 40px rgba(168, 85, 247, 1)'
                : '0 0 20px rgba(139, 92, 246, 0.6)',
            }}
            animate={{
              scale: isActivated ? [1, 1.4, 1] : 1,
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </motion.div>
  );
}

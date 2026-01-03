import { motion } from 'motion/react';

interface MandalaProps {
  isActivated: boolean;
}

export function Mandala({ isActivated }: MandalaProps) {
  const circles = [1, 2, 3, 4, 5];
  const petals = 12;

  return (
    <div className="absolute flex items-center justify-center">
      {/* Outer decorative circles */}
      {circles.map((circle, index) => (
        <motion.div
          key={`circle-${circle}`}
          className="absolute rounded-full border-2"
          style={{
            width: `${120 + index * 60}px`,
            height: `${120 + index * 60}px`,
            borderColor: isActivated 
              ? `rgba(168, 85, 247, ${0.6 - index * 0.1})`
              : `rgba(139, 92, 246, ${0.4 - index * 0.08})`,
          }}
          animate={{
            rotate: isActivated ? 360 : 0,
            scale: isActivated ? [1, 1.05, 1] : 1,
            borderColor: isActivated
              ? [
                  `rgba(168, 85, 247, ${0.6 - index * 0.1})`,
                  `rgba(59, 130, 246, ${0.6 - index * 0.1})`,
                  `rgba(168, 85, 247, ${0.6 - index * 0.1})`,
                ]
              : `rgba(139, 92, 246, ${0.4 - index * 0.08})`,
          }}
          transition={{
            rotate: {
              duration: 20 + index * 5,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
            borderColor: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      ))}

      {/* Mandala petals */}
      {[...Array(petals)].map((_, i) => {
        const angle = (i * 360) / petals;
        return (
          <motion.div
            key={`petal-${i}`}
            className="absolute w-20 h-2 origin-left"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${angle}deg)`,
            }}
            animate={{
              opacity: isActivated ? [0.3, 0.8, 0.3] : 0.3,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          >
            <div
              className={`w-full h-full rounded-full ${
                isActivated
                  ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-transparent'
                  : 'bg-gradient-to-r from-purple-600/50 to-transparent'
              }`}
            />
          </motion.div>
        );
      })}

      {/* Center placeholder */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border-4 flex items-center justify-center"
        style={{
          borderColor: isActivated ? 'rgba(168, 85, 247, 0.8)' : 'rgba(139, 92, 246, 0.5)',
          background: isActivated
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent)'
            : 'radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent)',
        }}
        animate={{
          borderColor: isActivated
            ? [
                'rgba(168, 85, 247, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(168, 85, 247, 0.8)',
              ]
            : 'rgba(139, 92, 246, 0.5)',
          boxShadow: isActivated
            ? [
                '0 0 20px rgba(168, 85, 247, 0.5)',
                '0 0 40px rgba(59, 130, 246, 0.5)',
                '0 0 20px rgba(168, 85, 247, 0.5)',
              ]
            : '0 0 0px rgba(139, 92, 246, 0)',
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-2 h-2 rounded-full bg-purple-400/50" />
      </motion.div>

      {/* Inner geometric patterns */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <motion.div
            key={`geo-${i}`}
            className="absolute w-12 h-12"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(60px)`,
            }}
          >
            <motion.div
              className="w-full h-full border-2 border-purple-500/40 rotate-45"
              animate={{
                borderColor: isActivated
                  ? [
                      'rgba(168, 85, 247, 0.6)',
                      'rgba(59, 130, 246, 0.6)',
                      'rgba(168, 85, 247, 0.6)',
                    ]
                  : 'rgba(139, 92, 246, 0.4)',
                rotate: isActivated ? [45, 90, 45] : 45,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

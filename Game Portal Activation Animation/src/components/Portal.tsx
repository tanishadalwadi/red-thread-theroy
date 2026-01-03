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

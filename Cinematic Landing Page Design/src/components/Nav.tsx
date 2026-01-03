import { motion } from 'motion/react';

interface NavProps {
  currentPage: 'home' | 'about';
  onNavigate: (page: 'home' | 'about') => void;
  onPlayClick: () => void;
}

export function Nav({ currentPage, onNavigate, onPlayClick }: NavProps) {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 px-8 py-6"
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div
          className="relative px-10 py-5 rounded-2xl backdrop-blur-2xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/20 flex items-center justify-between overflow-hidden"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Top highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          
          {/* Logo */}
          <motion.button
            onClick={() => onNavigate('home')}
            className="text-2xl tracking-tight relative z-10 cursor-pointer"
            style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-[#FF3B3B]">Thread</span>scape
          </motion.button>

          {/* Nav buttons */}
          <div className="flex gap-5 relative z-10">
            <motion.button
              onClick={() => onNavigate('about')}
              className="px-8 py-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              About
            </motion.button>
            
            <motion.button
              className="relative px-8 py-3 rounded-full backdrop-blur-xl bg-gradient-to-r from-[#FF3B3B]/90 to-[#ff1f1f]/90 border border-white/20 text-white overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: '0 4px 16px 0 rgba(255, 59, 59, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)',
              }}
              onClick={onPlayClick}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                }}
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: 'easeInOut',
                }}
              />
              <span className="relative z-10">Play</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
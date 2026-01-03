import { motion } from 'motion/react';

export function ShootingStar() {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-white rounded-full pointer-events-none"
      style={{
        boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)',
        top: '20%',
        left: '80%',
      }}
      animate={{
        x: [-100, 400],
        y: [0, 200],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatDelay: 8,
        ease: 'easeOut',
      }}
    >
      <motion.div
        className="absolute w-24 h-0.5 bg-gradient-to-r from-white to-transparent"
        style={{ right: 0, top: 0 }}
      />
    </motion.div>
  );
}

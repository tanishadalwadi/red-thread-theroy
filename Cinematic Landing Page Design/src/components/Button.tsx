import { motion } from 'motion/react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        px-8 py-3 rounded-full transition-all duration-300
        ${variant === 'primary' 
          ? 'bg-[#081124] text-white border border-white/30 hover:bg-[#FF3B3B] hover:border-[#FF3B3B]' 
          : 'bg-[#FF3B3B] text-white hover:bg-[#ff5252]'
        }
      `}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.button>
  );
}

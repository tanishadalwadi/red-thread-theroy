import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export function ValueCard({ icon, title, description, delay = 0 }: ValueCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="relative p-8 rounded-2xl bg-gradient-to-b from-[#0f1a3a]/50 to-[#081124]/30 border border-white/10 backdrop-blur-sm group"
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to top, rgba(255, 59, 59, 0.1), transparent)',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative z-10">
        <motion.div
          animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.5, delay: delay + 0.3, ease: 'easeInOut' }}
          className="mb-6"
        >
          {icon}
        </motion.div>
        <h3 className="mb-3">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>

      {/* Bottom glow on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF3B3B] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ filter: 'blur(4px)' }}
      />
    </motion.div>
  );
}

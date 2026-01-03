import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function Card({ icon, title, description, delay }: CardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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
      initial={{ opacity: 0, y: 60 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="group relative"
    >
      <motion.div
        className="relative p-12 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/0 border border-white/20 overflow-hidden min-h-[320px] flex flex-col"
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Glass shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          }}
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF3B3B]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Bottom border glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF3B3B] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ filter: 'blur(8px)' }}
        />

        {/* Top highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="relative z-10 flex flex-col flex-1">
          <motion.div
            className="mb-8"
            animate={isVisible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 2, delay: delay + 0.3 }}
          >
            {icon}
          </motion.div>
          
          <h3 className="mb-6">{title}</h3>
          <p className="text-white/60 leading-relaxed text-base">
            {description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FinanceIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <motion.circle
        cx="40"
        cy="40"
        r="32"
        stroke="#4a90e2"
        strokeWidth="2.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <motion.path
        d="M 40 16 L 40 64"
        stroke="#4a90e2"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
      <motion.path
        d="M 24 32 L 56 32"
        stroke="#4a90e2"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.path
        d="M 28 48 L 52 48"
        stroke="#4a90e2"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.7 }}
      />
    </svg>
  );
}

function TechIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <motion.rect
        x="16"
        y="20"
        width="48"
        height="40"
        rx="3"
        stroke="#4a90e2"
        strokeWidth="2.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <motion.path
        d="M 28 32 L 38 40 L 28 48"
        stroke="#4a90e2"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
      />
      <motion.line
        x1="44"
        y1="44"
        x2="52"
        y2="44"
        stroke="#4a90e2"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />
    </svg>
  );
}

function AdviceIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <motion.path
        d="M 40 16 L 56 28 L 56 64 L 24 64 L 24 28 Z"
        stroke="#4a90e2"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="40"
        cy="40"
        r="8"
        stroke="#4a90e2"
        strokeWidth="2.5"
        fill="none"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.path
        d="M 40 48 L 40 56"
        stroke="#4a90e2"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
      />
    </svg>
  );
}

export function ValueTriad() {
  return (
    <section className="relative py-40 px-8 bg-gradient-to-b from-[#081124] to-[#0a1535] overflow-hidden">
      {/* Ambient stars */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-28"
        >
          <motion.div
            className="inline-block px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            <p className="text-sm tracking-[0.3em] text-[#4a90e2] uppercase">
              What Sets Us Apart
            </p>
          </motion.div>
          <h2 className="drop-shadow-lg">Your Advantage</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Card
            icon={<FinanceIcon />}
            title="Financial Expertise"
            description="Donec ullamcorper nulla non metus auctor fringilla. Donec sed odio dui. Ullamcorper nulla non metus."
            delay={0.1}
          />
          <Card
            icon={<TechIcon />}
            title="Advanced Technology"
            description="Donec ullamcorper nulla non metus auctor fringilla. Donec sed odio dui. Ullamcorper nulla non metus."
            delay={0.3}
          />
          <Card
            icon={<AdviceIcon />}
            title="Right Advice"
            description="Donec ullamcorper nulla non metus auctor fringilla. Donec sed odio dui. Ullamcorper nulla non metus."
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
}
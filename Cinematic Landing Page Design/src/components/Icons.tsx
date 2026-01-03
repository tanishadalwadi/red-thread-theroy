import { motion } from 'motion/react';

export function FinancialIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <motion.path
        d="M32 8 L32 56 M16 24 L48 24 M20 40 L44 40"
        stroke="#4A90E2"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="32"
        cy="32"
        r="24"
        stroke="#4A90E2"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      <motion.path
        d="M32 16 L28 20 L36 20 Z"
        fill="#4A90E2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      />
    </svg>
  );
}

export function TechnologyIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <motion.rect
        x="12"
        y="16"
        width="40"
        height="32"
        rx="2"
        stroke="#4A90E2"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      <motion.path
        d="M20 24 L28 32 L20 40"
        stroke="#4A90E2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
      />
      <motion.line
        x1="34"
        y1="36"
        x2="44"
        y2="36"
        stroke="#4A90E2"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.6, ease: 'easeInOut' }}
      />
    </svg>
  );
}

export function AdviceIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <motion.path
        d="M32 12 L44 24 L44 52 L20 52 L20 24 Z"
        stroke="#4A90E2"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="32"
        cy="32"
        r="6"
        stroke="#4A90E2"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0, scale: 0 }}
        animate={{ pathLength: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
      />
      <motion.path
        d="M32 38 L32 44"
        stroke="#4A90E2"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1, ease: 'easeInOut' }}
      />
    </svg>
  );
}

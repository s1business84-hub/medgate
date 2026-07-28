'use client';

import { motion } from 'framer-motion';

interface LetterByLetterProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  gradient?: boolean;
}

export function LetterByLetter({ 
  text, 
  className = '', 
  delay = 0.5, 
  duration = 0.05,
  gradient = false
}: LetterByLetterProps) {
  const letters = text.split('');
  
  const gradientStyles = gradient ? {
    background: `linear-gradient(90deg,
      rgb(96, 165, 250),   /* blue-400 */
      rgb(129, 140, 248),  /* indigo-400 */
      rgb(59, 130, 246),   /* blue-500 */
      rgb(96, 165, 250))`,
    backgroundSize: "200% 100%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  } : {};
  
  return (
    <motion.span 
      className={className}
      style={gradientStyles}
      initial={{ backgroundPosition: "0%" }}
      animate={gradient ? { backgroundPosition: "100%" } : {}}
      transition={gradient ? { duration: 6, repeat: Infinity, ease: "linear" } : {}}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + index * duration,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="inline-block"
          style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

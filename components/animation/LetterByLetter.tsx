'use client';

import { motion } from 'framer-motion';

interface LetterByLetterProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function LetterByLetter({ 
  text, 
  className = '', 
  delay = 0.5, 
  duration = 0.05 
}: LetterByLetterProps) {
  const letters = text.split('');
  
  return (
    <span className={className}>
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
    </span>
  );
}

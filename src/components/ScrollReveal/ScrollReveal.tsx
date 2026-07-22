'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { ScrollRevealProps } from '@/lib/types';

export default function ScrollReveal({ 
  children, 
  className = "",
  delay = 0 
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  // If the user prefers reduced motion, skip all animations
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.5, 
            ease: "easeOut", 
            delay,
            staggerChildren: 0.1 
          }
        }
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

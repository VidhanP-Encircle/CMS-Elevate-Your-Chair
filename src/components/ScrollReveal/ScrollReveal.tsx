'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function ScrollReveal({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
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
            duration: 0.6, 
            ease: "easeOut", 
            delay,
            staggerChildren: 0.15 
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

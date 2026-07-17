'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AnimatedImageGrid({ images }: { images: any[] }) {
  return (
    <>
      {images.map((img: any) => (
        <motion.div
          key={img.id}
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { 
              opacity: 1, 
              scale: 1,
              transition: { duration: 0.5, ease: "easeOut" }
            }
          }}
          className="w-full h-full"
        >
          <Image
            src={`/api/assets/${img.image}`}
            alt="Instagram image"
            width={329}
            height={329}
            className="w-full aspect-square object-cover hover:opacity-80 transition-opacity duration-300"
          />
        </motion.div>
      ))}
    </>
  );
}

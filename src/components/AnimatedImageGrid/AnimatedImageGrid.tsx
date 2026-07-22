'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnimatedImageGridProps, DirectusFile } from '@/lib/types';

export default function AnimatedImageGrid({ images }: AnimatedImageGridProps) {
  return (
    <>
      {images.map((img: DirectusFile, idx: number) => {
        const imageId = typeof img === "object" && img !== null && "id" in img ? (img as { id: string }).id : typeof img === "string" ? img : `img-${idx}`;
        const assetPath = typeof img === "object" && img !== null && "image" in img ? String(img.image) : imageId;

        return (
          <motion.div
            key={imageId}
            initial={{ opacity: 1, scale: 1 }}
            className="w-full h-full"
          >
            <Image
              src={`/api/assets/${assetPath}`}
              alt="Instagram image"
              width={329}
              height={329}
              className="w-full aspect-square object-cover hover:opacity-80 transition-opacity duration-300"
            />
          </motion.div>
        );
      })}
    </>
  );
}
